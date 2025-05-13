package com.krishnanx.Noctune.medianotification;

import android.app.Notification;
import android.app.Service;
import android.content.Intent;
import android.os.IBinder;
import androidx.annotation.Nullable;
import androidx.core.app.NotificationCompat;
import android.util.Log;


import android.app.NotificationChannel;
import android.app.NotificationManager;

import android.content.Context;
import android.os.Build;

import androidx.core.app.NotificationCompat;

public class MediaNotificationService extends Service {
    private static final String TAG = "MediaNotificationService";
    private static final int NOTIFICATION_ID = 1;
    private static final String CHANNEL_ID = "media_playback_channel";

    @Override
    public void onCreate() {
        super.onCreate();
        Log.d(TAG, "Media Notification Service Created");
    }
    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                CHANNEL_ID,
                "Media Playback",
                NotificationManager.IMPORTANCE_LOW
            );
            NotificationManager manager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
            if (manager != null) {
                manager.createNotificationChannel(channel);
            }
        }
    }
    
    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        createNotificationChannel();
        // Create a simple notification to keep the service in foreground
        // The actual media notification will be managed by MediaNotificationModule
        Notification notification = new NotificationCompat.Builder(this, CHANNEL_ID)
                .setContentTitle("Music is playing")
                .setContentText("Media playback")
                .setSmallIcon(android.R.drawable.ic_media_play)
                .setPriority(NotificationCompat.PRIORITY_LOW)
                .build();

        startForeground(NOTIFICATION_ID, notification);
        
        return START_STICKY;
    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        Log.d(TAG, "Media Notification Service Destroyed");
    }
}