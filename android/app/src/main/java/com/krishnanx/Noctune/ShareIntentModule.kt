package com.krishnanx.Noctune

import android.content.Intent
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule

class ShareIntentModule(reactContext: ReactApplicationContext)
  : ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String {
    return "ShareIntent"
  }

  @ReactMethod
  fun getText(promise: Promise) {
    try {
      val intent: Intent? = currentActivity?.intent
      val action = intent?.action
      val type = intent?.type

      if (Intent.ACTION_SEND == action && type == "text/plain") {
        val text = intent.getStringExtra(Intent.EXTRA_TEXT)
        // Clear the intent so it doesn't get processed again
        intent.replaceExtras(android.os.Bundle())
        promise.resolve(text)
      } else {
        promise.resolve(null)
      }
    } catch (e: Exception) {
      promise.reject("INTENT_ERR", e)
    }
  }

  @ReactMethod
  fun clearIntent() {
    try {
      currentActivity?.intent?.replaceExtras(android.os.Bundle())
    } catch (e: Exception) {
      // Ignore
    }
  }
}