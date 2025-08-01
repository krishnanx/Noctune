package com.krishnanx.Noctune

import android.os.Build
import android.os.Bundle
import android.util.Log
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import com.krishnanx.Noctune.medianotification.MediaNotificationPackage
import com.facebook.react.modules.core.DeviceEventManagerModule
import android.content.Intent
import android.content.SharedPreferences

import expo.modules.ReactActivityDelegateWrapper

class MainActivity : ReactActivity() {
    
    private lateinit var prefs: SharedPreferences
    
    override fun onCreate(savedInstanceState: Bundle?) {
    setTheme(R.style.AppTheme)

    prefs = getSharedPreferences("app_state", MODE_PRIVATE)

    super.onCreate(null)  // MUST come before accessing ReactInstanceManager

    // Now safe to access React context
    val wasAppKilled = prefs.getBoolean("was_killed", false)
    if (wasAppKilled) {
        Log.d("Lifecycle", "App was previously killed, starting fresh")
        prefs.edit().putBoolean("was_killed", false).apply()

        val reactContext = getReactInstanceManager().currentReactContext
        reactContext?.runOnUiQueueThread {
            reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                .emit("AppStartedFresh", null)
        }
    }
}

    
    override fun onDestroy() {
        Log.d("Lifecycle", "onDestroy called - marking app as killed")
        
        // Mark that the app was killed
        prefs.edit().putBoolean("was_killed", true).apply()
        
        // Emit event to React Native
        val reactContext = getReactInstanceManager().currentReactContext
        reactContext?.runOnUiQueueThread {
            reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                .emit("AppWasKilled", null)
        }
        
        super.onDestroy()
    }
    
    override fun onResume() {
        super.onResume()
        // Clear the killed flag when app is actively being used
        prefs.edit().putBoolean("was_killed", false).apply()
    }

    /**
     * Returns the name of the main component registered from JavaScript. This is used to schedule
     * rendering of the component.
     */
    override fun getMainComponentName(): String = "main"

    /**
     * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
     * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
     */
    override fun createReactActivityDelegate(): ReactActivityDelegate {
        return ReactActivityDelegateWrapper(
            this,
            BuildConfig.IS_NEW_ARCHITECTURE_ENABLED,
            object : DefaultReactActivityDelegate(
                this,
                mainComponentName,
                fabricEnabled
            ) {}
        )
    }

    /**
     * Align the back button behavior with Android S
     * where moving root activities to background instead of finishing activities.
     * @see <a href="https://developer.android.com/reference/android/app/Activity#onBackPressed()">onBackPressed</a>
     */
    override fun invokeDefaultOnBackPressed() {
        if (Build.VERSION.SDK_INT <= Build.VERSION_CODES.R) {
            if (!moveTaskToBack(false)) {
                // For non-root activities, use the default implementation to finish them.
                super.invokeDefaultOnBackPressed()
            }
            return
        }

        // Use the default back button implementation on Android S
        // because it's doing more than [Activity.moveTaskToBack] in fact.
        super.invokeDefaultOnBackPressed()
    }
}