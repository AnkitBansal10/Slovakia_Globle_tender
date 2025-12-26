package com.blsvisaappoinmentbook

import android.app.Activity
import android.content.Intent
import android.net.Uri
import com.facebook.react.bridge.*
import com.ozforensics.liveness.sdk.core.OzLivenessSDK
import com.ozforensics.liveness.sdk.core.OzLivenessResultCode
import com.ozforensics.liveness.sdk.core.model.OzAction
import com.ozforensics.liveness.sdk.core.model.OzAbstractMedia
import com.ozforensics.liveness.sdk.security.LicenseSource
import com.blsvisaappoinmentbook.R

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
     * Start OZ Liveness
     * ❌ No login
     * ❌ No token
     * ✅ License only
     */
    @ReactMethod
    fun startLiveness(promise: Promise) {
        val activity = reactContext.currentActivity
        if (activity == null) {
            promise.reject("NO_ACTIVITY", "Current activity is null")
            return
        }

        // Init SDK once (LICENSE ONLY)
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
     * Handle result
     * ✅ Returns image & video URIs
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
                val result = Arguments.createMap()
                result.putBoolean("success", true)
                result.putInt("mediaCount", mediaList?.size ?: 0)

                // Collect media types only
                val types = mediaList
                    ?.joinToString(",") { it.javaClass.simpleName }
                    ?: ""

                result.putString("mediaTypes", types)
                // Raw SDK response
                result.putString("rawResult", mediaList?.toString() ?: "")
                promise.resolve(result)
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