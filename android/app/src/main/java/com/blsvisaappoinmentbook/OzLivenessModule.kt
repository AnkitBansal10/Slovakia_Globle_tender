package com.blsvisaappoinmentbook

import android.app.Activity
import android.content.Intent
import com.facebook.react.bridge.ActivityEventListener
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

import com.blsvisaappoinmentbook.R

import com.ozforensics.liveness.sdk.core.OzLivenessSDK
import com.ozforensics.liveness.sdk.security.LicenseSource
import com.ozforensics.liveness.sdk.core.OzLivenessResultCode
import com.ozforensics.liveness.sdk.core.model.OzAbstractMedia
import com.ozforensics.liveness.sdk.analysis.AnalysisRequest
import com.ozforensics.liveness.sdk.analysis.entity.Analysis
import com.ozforensics.liveness.sdk.analysis.entity.RequestResult
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
     * Start liveness flow (NO LOGIN)
     */
    @ReactMethod
    fun startLiveness(promise: Promise) {
        val activity = reactContext.currentActivity
        if (activity == null) {
            promise.reject("NO_ACTIVITY", "Current activity is null")
            return
        }

        // ✅ Init SDK ONCE (no login)
        if (!isSdkInitialized) {
            OzLivenessSDK.init(
                reactContext,
                listOf(LicenseSource.LicenseAssetId(R.raw.forensics))
            )
            isSdkInitialized = true
        }

        if (pendingPromise != null) {
            promise.reject("ALREADY_RUNNING", "Liveness already running")
            return
        }

        pendingPromise = promise

        val actions = listOf(OzAction.EyeBlink)
        val intent = OzLivenessSDK.createStartIntent(actions)
        activity.startActivityForResult(intent, REQUEST_CODE_SDK)
    }

    /**
     * Handle SDK result
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
                val mediaList: List<OzAbstractMedia>? =
                    OzLivenessSDK.getResultFromIntent(data)

                if (mediaList.isNullOrEmpty()) {
                    promise.reject("NO_MEDIA", "No media returned")
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
                        { requestResult: RequestResult ->
                            // ✅ Send FULL result to JS
                            promise.resolve(requestResult.toString())
                        },
                        { error ->
                            promise.reject(
                                "ANALYSIS_ERROR",
                                error.message ?: "Analysis failed",
                                error
                            )
                        },
                        { _ -> }
                    )
            }

            OzLivenessResultCode.USER_CLOSED_LIVENESS -> {
                promise.reject("USER_CANCELLED", "User closed liveness")
            }

            else -> {
                val error = OzLivenessSDK.getErrorFromIntent(data)
                promise.reject("SDK_ERROR", error ?: "Unknown SDK error")
            }
        }
    }

    override fun onNewIntent(intent: Intent) {}
}
