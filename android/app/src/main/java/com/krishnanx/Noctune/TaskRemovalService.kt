package com.krishnanx.Noctune

import android.app.Service
import android.content.Intent
import android.os.IBinder
import android.util.Log
import com.facebook.react.ReactApplication
import com.facebook.react.ReactInstanceManager
import com.facebook.react.modules.core.DeviceEventManagerModule

class TaskRemovalService : Service() {

    override fun onBind(intent: Intent?): IBinder? {
        return null
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        Log.d("TaskRemovalService", "Service started")
        return START_STICKY
    }

    override fun onTaskRemoved(rootIntent: Intent?) {
        Log.d("TaskRemovalService", "App removed from recent apps")
        
        try {
            val application = applicationContext as ReactApplication
            val reactInstanceManager: ReactInstanceManager = application.reactNativeHost.reactInstanceManager
            val reactContext = reactInstanceManager.currentReactContext
            
            reactContext?.runOnUiQueueThread {
                reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                    .emit("AppWasKilled", null)
            }
        } catch (e: Exception) {
            Log.e("TaskRemovalService", "Error sending event: ${e.message}")
        }

        // Stop the service
        stopSelf()
        
        super.onTaskRemoved(rootIntent)
    }
}