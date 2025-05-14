package com.krishnanx.Noctune.medianotification;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.util.Log;
import androidx.localbroadcastmanager.content.LocalBroadcastManager;

public class MediaNotificationReceiver extends BroadcastReceiver {
    private static final String TAG = "MediaNotificationReceiver";
    
    // Action constants for notification controls
    public static final String ACTION_PLAY = "com.krishnanx.Noctune.medianotification.PLAY";
    public static final String ACTION_PAUSE = "com.krishnanx.Noctune.medianotification.PAUSE";
    public static final String ACTION_NEXT = "com.krishnanx.Noctune.medianotification.NEXT";
    public static final String ACTION_PREVIOUS = "com.krishnanx.Noctune.medianotification.PREV";
    public static final String ACTION_STOP = "com.krishnanx.Noctune.medianotification.STOP";

    @Override
    public void onReceive(Context context, Intent intent) {
        if (context == null || intent == null) {
            Log.e(TAG, "Received null context or intent");
            return;
        }

        String action = intent.getAction();
        Log.d(TAG, "Received media action: " + action);
        
        if (action == null) return;
        
        // Create a new intent to forward to your service or activity
        Intent forwardIntent = new Intent(action);
        
        // Use LocalBroadcastManager to send the intent within your app
        LocalBroadcastManager.getInstance(context).sendBroadcast(forwardIntent);
    }
}