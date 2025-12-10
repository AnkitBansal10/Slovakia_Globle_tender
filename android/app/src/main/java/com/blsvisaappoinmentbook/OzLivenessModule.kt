package com.blsvisaappoinmentbook

import android.app.Activity
import android.content.Intent
import com.facebook.react.bridge.ActivityEventListener
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Arguments // 👈 add this

// Import YOUR app's R (where the license file lives)
import com.blsvisaappoinmentbook.R

// OzForensics imports
import com.ozforensics.liveness.sdk.core.OzLivenessSDK
import com.ozforensics.liveness.sdk.security.LicenseSource
import com.ozforensics.liveness.sdk.network.OzConnection
import com.ozforensics.liveness.sdk.core.StatusListener
import com.ozforensics.liveness.sdk.exceptions.OzException
import com.ozforensics.liveness.sdk.core.OzLivenessResultCode
import com.ozforensics.liveness.sdk.core.model.OzAbstractMedia
import com.ozforensics.liveness.sdk.analysis.AnalysisRequest
import com.ozforensics.liveness.sdk.analysis.entity.Analysis
import com.ozforensics.liveness.sdk.core.model.OzAction

class OzLivenessModule(
    private val reactContext: ReactApplicationContext
) : ReactContextBaseJavaModule(reactContext), ActivityEventListener {

    companion object {
        private const val REQUEST_CODE_SDK = 5
    }

    private var pendingPromise: Promise? = null
    private var isSdkInitialized = false

    init {
        reactContext.addActivityEventListener(this)
    }

    override fun getName(): String = "OzLiveness"

    /**
     * Initialize SDK and login (setApiConnection) from React Native.
     * Call this once after user enters server URL / username / password.
     */
    @ReactMethod
    fun initAndLogin(serverUrl: String, username: String, password: String, promise: Promise) {
        try {
            if (!isSdkInitialized) {
                OzLivenessSDK.init(
                    reactContext,
                    listOf(LicenseSource.LicenseAssetId(R.raw.forensics))
                )
                isSdkInitialized = true
            }

            OzLivenessSDK.setApiConnection(
                OzConnection.fromCredentials(
                    serverUrl.trim(),
                    username.trim(),
                    password.trim()
                ),
                object : StatusListener<String?> {
                   override fun onSuccess(result: String?) {
    val map = Arguments.createMap()
    map.putString("accessToken", result ?: "")
    promise.resolve(map)
}

                    override fun onError(error: OzException) {
                        promise.reject(
                            "LOGIN_ERROR",
                            error.message ?: "Login error",
                            error
                        )
                    }
                }
            )
        } catch (e: Exception) {
            promise.reject("INIT_ERROR", e.message, e)
        }
    }

    /**
     * Start liveness flow (EyeBlink + Scan) from React Native.
     * Returns full analysis result object to JS (resolution, folderId, raw).
     */
    @ReactMethod
    fun startLiveness(promise: Promise) {
        val activity: Activity? = reactContext.currentActivity
        if (activity == null) {
            promise.reject("NO_ACTIVITY", "Current activity is null")
            return
        }
        if (!isSdkInitialized) {
            promise.reject(
                "NOT_INITIALIZED",
                "OzLivenessSDK is not initialized. Call initAndLogin first."
            )
            return
        }
        if (pendingPromise != null) {
            promise.reject("ALREADY_RUNNING", "Liveness process is already running")
            return
        }

        pendingPromise = promise

        // EyeBlink + Scan (no Smile)
        val actions = listOf(OzAction.EyeBlink, OzAction.Scan)
        val intent = OzLivenessSDK.createStartIntent(actions)
        @Suppress("DEPRECATION")
        activity.startActivityForResult(intent, REQUEST_CODE_SDK)
    }

    /**
     * Handle activity result from SDK
     */
    override fun onActivityResult(
        activity: Activity,
        requestCode: Int,
        resultCode: Int,
        data: Intent?
    ) {
        if (requestCode != REQUEST_CODE_SDK) return

        val promise = pendingPromise ?: return
        pendingPromise = null

        when (resultCode) {
            OzLivenessResultCode.SUCCESS -> {
                val mediaList: List<OzAbstractMedia>? = OzLivenessSDK.getResultFromIntent(data)
                if (mediaList.isNullOrEmpty()) {
                    promise.reject("NO_MEDIA", "No media returned from Liveness SDK")
                    return
                }

                AnalysisRequest.Builder()
                    .addAnalysis(
                        Analysis(
                            Analysis.Type.QUALITY,
                            Analysis.Mode.SERVER_BASED,
                            mediaList
                        )
                    )
                    .build()
                    .run(
                        { result ->
                            try {
                               
                                // Build a map to send to JS with folderId, resolution, raw
                                val map = Arguments.createMap()
                                  map.putString("data", result)
                            } catch (e: Exception) {
                                promise.reject("RESULT_PARSE_ERROR", e.message, e)
                            }
                        },
                        { error ->
                            promise.reject(
                                "ANALYSIS_ERROR",
                                error.message ?: "Unknown analysis error",
                                error
                            )
                        },
                        { _progress ->
                            // Optional: emit progress to JS via events, if needed
                        }
                    )
            }

            OzLivenessResultCode.USER_CLOSED_LIVENESS -> {
                promise.reject("USER_CANCELLED", "User closed liveness screen")
            }

            else -> {
                val error = OzLivenessSDK.getErrorFromIntent(data)
                val msg = error ?: "Unknown SDK error"
                promise.reject("SDK_ERROR", msg)
            }
        }
    }

    override fun onNewIntent(intent: Intent) {
        // Not needed for this module
    }
}
