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
import com.facebook.react.bridge.ReactContext
import android.content.Intent
import android.content.SharedPreferences
import android.os.Handler
import android.os.Looper

import expo.modules.ReactActivityDelegateWrapper

class MainActivity : ReactActivity() {
    
    private lateinit var prefs: SharedPreferences
    private val handler = Handler(Looper.getMainLooper())
    
    override fun onCreate(savedInstanceState: Bundle?) {
        setTheme(R.style.AppTheme)
        prefs = getSharedPreferences("app_state", MODE_PRIVATE)
        super.onCreate(null)  // MUST come before accessing ReactInstanceManager

        // Check if app was killed and emit event when React context is ready
        val wasAppKilled = prefs.getBoolean("was_killed", false)
        if (wasAppKilled) {
            Log.d("Lifecycle", "App was previously killed, starting fresh")
            prefs.edit().putBoolean("was_killed", false).apply()
            
            // Wait for React context to be ready before emitting event
            waitForReactContextAndEmit("AppStartedFresh")
        }
    }
    
    private fun waitForReactContextAndEmit(eventName: String) {
        handler.post(object : Runnable {
            override fun run() {
                try {
                    val reactInstanceManager = getReactInstanceManager()
                    val reactContext = reactInstanceManager?.currentReactContext
                    
                    if (reactContext != null) {
                        // React context is ready, emit the event
                        reactContext.runOnUiQueueThread {
                            try {
                                reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                                    ?.emit(eventName, null)
                            } catch (e: Exception) {
                                Log.e("Lifecycle", "Error emitting event $eventName", e)
                            }
                        }
                    } else {
                        // React context not ready yet, try again after a delay
                        handler.postDelayed(this, 100)
                    }
                } catch (e: Exception) {
                    Log.e("Lifecycle", "Error waiting for React context", e)
                }
            }
        })
    }
    
    private fun safeEmitEvent(eventName: String) {
        try {
            val reactInstanceManager = getReactInstanceManager()
            val reactContext = reactInstanceManager?.currentReactContext
            
            if (reactContext != null) {
                reactContext.runOnUiQueueThread {
                    try {
                        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                            ?.emit(eventName, null)
                    } catch (e: Exception) {
                        Log.e("Lifecycle", "Error emitting event $eventName", e)
                    }
                }
            } else {
                Log.w("Lifecycle", "React context not available for event: $eventName")
            }
        } catch (e: Exception) {
            Log.e("Lifecycle", "Error in safeEmitEvent", e)
        }
    }
    
    override fun onDestroy() {
        Log.d("Lifecycle", "onDestroy called - marking app as killed")
        
        // Mark that the app was killed
        try {
            prefs.edit().putBoolean("was_killed", true).apply()
        } catch (e: Exception) {
            Log.e("Lifecycle", "Error saving app state", e)
        }
        
        // Emit event to React Native safely
        safeEmitEvent("AppWasKilled")
        
        super.onDestroy()
    }
    
    override fun onResume() {
        super.onResume()
        // Clear the killed flag when app is actively being used
        try {
            prefs.edit().putBoolean("was_killed", false).apply()
        } catch (e: Exception) {
            Log.e("Lifecycle", "Error clearing killed flag", e)
        }
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