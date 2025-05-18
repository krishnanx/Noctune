package com.krishnanx.Noctune.medianotification;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Build;
import android.os.Bundle;
import android.support.v4.media.MediaMetadataCompat;
import android.support.v4.media.session.MediaSessionCompat;
import android.support.v4.media.session.PlaybackStateCompat;
import android.util.Log;

import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;
import androidx.localbroadcastmanager.content.LocalBroadcastManager;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import android.os.Handler;
import android.os.Looper;

public class MediaNotificationModule extends ReactContextBaseJavaModule {
    private static final String MODULE_NAME = "MediaNotification";
    private static final String TAG = "MediaNotificationModule";
    
    // Action constants for notification controls
    public static final String ACTION_PLAY = "com.krishnanx.Noctune.medianotification.PLAY";
    public static final String ACTION_PAUSE = "com.krishnanx.Noctune.medianotification.PAUSE";
    public static final String ACTION_NEXT = "com.krishnanx.Noctune.medianotification.NEXT";
    public static final String ACTION_PREV = "com.krishnanx.Noctune.medianotification.PREV";
    public static final String ACTION_STOP = "com.krishnanx.Noctune.medianotification.STOP";

    // Event names to send to JavaScript
    private static final String EVENT_PLAY = "onPlayEvent";
    private static final String EVENT_PAUSE = "onPauseEvent";
    private static final String EVENT_NEXT = "onNextEvent";
    private static final String EVENT_PREV = "onPrevEvent";
    private static final String EVENT_STOP = "onStopEvent";

    // Channel ID for notifications on Android 8.0+
    private static final String CHANNEL_ID = "media_playback_channel";
    private static final int NOTIFICATION_ID = 1;
    
    // Media session fields
    private MediaSessionCompat mediaSession;
    private PlaybackStateCompat.Builder stateBuilder;
    
    private NotificationManagerCompat notificationManager;
    private BroadcastReceiver notificationReceiver;
    private boolean isPlaying = false;
    private boolean isNotificationActive = false;

    // Track information
    private String currentTitle = "";
    private String currentArtist = "";
    private String currentAlbum = "";
    private String currentArtwork = "";

    public MediaNotificationModule(ReactApplicationContext reactContext) {
        super(reactContext);
        notificationManager = NotificationManagerCompat.from(reactContext);
        
        // Create notification channel for Android 8.0+
        createNotificationChannel();
        
        // Set up media session
        initializeMediaSession();
        
        // Register broadcast receiver for notification actions
        registerNotificationReceiver();
    }

    @Override
    public String getName() {
        return MODULE_NAME;
    }

    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                CHANNEL_ID,
                "Media Playback",
                NotificationManager.IMPORTANCE_LOW
            );
            channel.setDescription("Used for media playback controls");
            channel.setShowBadge(false);
            
            NotificationManager notificationManager = getReactApplicationContext()
                .getSystemService(NotificationManager.class);
            if (notificationManager != null) {
                notificationManager.createNotificationChannel(channel);
            }
        }
    }

    private void initializeMediaSession() {
        mediaSession = new MediaSessionCompat(getReactApplicationContext(), "MediaNotificationSession");
        
        stateBuilder = new PlaybackStateCompat.Builder()
            .setActions(
                PlaybackStateCompat.ACTION_PLAY |
                PlaybackStateCompat.ACTION_PAUSE |
                PlaybackStateCompat.ACTION_SKIP_TO_NEXT |
                PlaybackStateCompat.ACTION_SKIP_TO_PREVIOUS |
                PlaybackStateCompat.ACTION_STOP
            );
            
        mediaSession.setPlaybackState(stateBuilder.build());
        // Ensure this is being called on a background thread, if necessary:
Handler mainHandler = new Handler(Looper.getMainLooper());
mainHandler.post(() -> {
    // This will run on the main thread
    mediaSession.setCallback(new MediaSessionCallback());
});

       
        mediaSession.setActive(true);
    }

    private void registerNotificationReceiver() {
        notificationReceiver = new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, Intent intent) {
                String action = intent.getAction();
                if (action != null) {
                    switch (action) {
                        case ACTION_PLAY:
                            sendEvent(getReactApplicationContext(), EVENT_PLAY, null);
                            break;
                        case ACTION_PAUSE:
                            sendEvent(getReactApplicationContext(), EVENT_PAUSE, null);
                            break;
                        case ACTION_NEXT:
                            sendEvent(getReactApplicationContext(), EVENT_NEXT, null);
                            break;
                        case ACTION_PREV:
                            sendEvent(getReactApplicationContext(), EVENT_PREV, null);
                            break;
                        case ACTION_STOP:
                            sendEvent(getReactApplicationContext(), EVENT_STOP, null);
                            break;
                    }
                }
            }
        };
        
        IntentFilter filter = new IntentFilter();
        filter.addAction(ACTION_PLAY);
        filter.addAction(ACTION_PAUSE);
        filter.addAction(ACTION_NEXT);
        filter.addAction(ACTION_PREV);
        filter.addAction(ACTION_STOP);
        
        LocalBroadcastManager.getInstance(getReactApplicationContext())
            .registerReceiver(notificationReceiver, filter);
    }

    @ReactMethod
    public void showNotification(ReadableMap trackData, Promise promise) {
        try {
            if (trackData.hasKey("title")) {
                currentTitle = trackData.getString("title");
            }
            if (trackData.hasKey("artist")) {
                currentArtist = trackData.getString("artist");
            }
            if (trackData.hasKey("album")) {
                currentAlbum = trackData.getString("album");
            }
            if (trackData.hasKey("artwork")) {
                currentArtwork = trackData.getString("artwork");
            }
            
            updateNotification(true);
            isNotificationActive = true;
            promise.resolve(true);
        } catch (Exception e) {
            promise.reject("ERROR", "Failed to show notification: " + e.getMessage());
        }
    }

    @ReactMethod
    public void updatePlaybackStatus(boolean isPlaying, Promise promise) {
        try {
            this.isPlaying = isPlaying;
            if (isNotificationActive) {
                updateNotification(isPlaying);
            }
            promise.resolve(true);
        } catch (Exception e) {
            promise.reject("ERROR", "Failed to update notification: " + e.getMessage());
        }
    }

    @ReactMethod
    public void hideNotification(Promise promise) {
        try {
            notificationManager.cancel(NOTIFICATION_ID);
            isNotificationActive = false;
            promise.resolve(true);
        } catch (Exception e) {
            promise.reject("ERROR", "Failed to hide notification: " + e.getMessage());
        }
    }

    private void updateNotification(boolean isPlaying) {
        // Set media session metadata
        MediaMetadataCompat.Builder metadataBuilder = new MediaMetadataCompat.Builder()
            .putString(MediaMetadataCompat.METADATA_KEY_TITLE, currentTitle)
            .putString(MediaMetadataCompat.METADATA_KEY_ARTIST, currentArtist)
            .putString(MediaMetadataCompat.METADATA_KEY_ALBUM, currentAlbum);
        
        // Load artwork if available
        if (currentArtwork != null && !currentArtwork.isEmpty()) {
            new Thread(() -> {
                try {
                    Bitmap artwork = getBitmapFromURL(currentArtwork);
                    if (artwork != null) {
                        metadataBuilder.putBitmap(MediaMetadataCompat.METADATA_KEY_ALBUM_ART, artwork);
                        mediaSession.setMetadata(metadataBuilder.build());
                        
                        // Update notification with artwork
                        updateNotificationWithArtwork(isPlaying, artwork);
                    } else {
                        mediaSession.setMetadata(metadataBuilder.build());
                        updateNotificationWithoutArtwork(isPlaying);
                    }
                } catch (Exception e) {
                    Log.e(TAG, "Error loading artwork", e);
                    mediaSession.setMetadata(metadataBuilder.build());
                    updateNotificationWithoutArtwork(isPlaying);
                }
            }).start();
        } else {
            mediaSession.setMetadata(metadataBuilder.build());
            updateNotificationWithoutArtwork(isPlaying);
        }
        
        // Update playback state
        int playbackState = isPlaying ? 
            PlaybackStateCompat.STATE_PLAYING : 
            PlaybackStateCompat.STATE_PAUSED;
            
        stateBuilder.setState(playbackState, PlaybackStateCompat.PLAYBACK_POSITION_UNKNOWN, 1.0f);
        mediaSession.setPlaybackState(stateBuilder.build());
    }
    
    @ReactMethod
public void updateTrackData(ReadableMap trackData, Promise promise) {
    try {
        if (trackData.hasKey("title")) {
            currentTitle = trackData.getString("title");
        }
        if (trackData.hasKey("artist")) {
            currentArtist = trackData.getString("artist");
        }
        if (trackData.hasKey("album")) {
            currentAlbum = trackData.getString("album");
        }
        if (trackData.hasKey("artwork")) {
            currentArtwork = trackData.getString("artwork");
        }

        updateNotification(true); // or pass `isPlaying` dynamically
        promise.resolve(true);
    } catch (Exception e) {
        promise.reject("UPDATE_FAILED", e.getMessage());
    }
}


    private Bitmap getBitmapFromURL(String src) {
        try {
            URL url = new URL(src);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setDoInput(true);
            connection.connect();
            InputStream input = connection.getInputStream();
            return BitmapFactory.decodeStream(input);
        } catch (IOException e) {
            Log.e(TAG, "Error loading image from URL", e);
            return null;
        }
    }
    
    private void updateNotificationWithoutArtwork(boolean isPlaying) {
        createAndShowNotification(isPlaying, null);
    }
    
    private void updateNotificationWithArtwork(boolean isPlaying, Bitmap artwork) {
        createAndShowNotification(isPlaying, artwork);
    }
    
    private void createAndShowNotification(boolean isPlaying, Bitmap artwork) {
        Context context = getReactApplicationContext();
        
        // Create intents for notification actions
        Intent playPauseIntent = new Intent(isPlaying ? ACTION_PAUSE : ACTION_PLAY);
        Intent nextIntent = new Intent(ACTION_NEXT);
        Intent prevIntent = new Intent(ACTION_PREV);
        Intent stopIntent = new Intent(ACTION_STOP);
        
        // Create pending intents for notification actions
        PendingIntent playPausePendingIntent = PendingIntent.getBroadcast(
            context, 
            0, 
            playPauseIntent, 
            PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );
        
        PendingIntent nextPendingIntent = PendingIntent.getBroadcast(
            context, 
            0, 
            nextIntent, 
            PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );
        
        PendingIntent prevPendingIntent = PendingIntent.getBroadcast(
            context, 
            0, 
            prevIntent, 
            PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );
        
        PendingIntent stopPendingIntent = PendingIntent.getBroadcast(
            context, 
            0, 
            stopIntent, 
            PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );
        
        // Get app icon
        int appIcon = context.getResources().getIdentifier(
            "ic_notification", 
            "drawable", 
            context.getPackageName()
        );
        
        if (appIcon == 0) {
            appIcon = android.R.drawable.ic_media_play; // Default icon
        }
        
        // Get play/pause icon based on current state
        int playPauseIcon = isPlaying ? 
            android.R.drawable.ic_media_pause : 
            android.R.drawable.ic_media_play;
        
        // Build notification
        NotificationCompat.Builder builder = new NotificationCompat.Builder(context, CHANNEL_ID)
            .setContentTitle(currentTitle)
            .setContentText(currentArtist)
            .setSubText(currentAlbum)
            .setSmallIcon(appIcon)
            .setPriority(NotificationCompat.PRIORITY_DEFAULT)
            .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
            .setOnlyAlertOnce(true)
            .setOngoing(isPlaying)
            // Add media style
            .setStyle(new androidx.media.app.NotificationCompat.MediaStyle()
                .setMediaSession(mediaSession.getSessionToken())
                .setShowActionsInCompactView(0, 1, 2))
            // Add actions
            .addAction(android.R.drawable.ic_media_previous, "Previous", prevPendingIntent)
            .addAction(playPauseIcon, isPlaying ? "Pause" : "Play", playPausePendingIntent)
            .addAction(android.R.drawable.ic_media_next, "Next", nextPendingIntent);
        
        // Set large icon (artwork) if available
        if (artwork != null) {
            builder.setLargeIcon(artwork);
        }
        
        // Start foreground service to keep notification even when app is in background
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            context.startForegroundService(new Intent(context, MediaNotificationService.class));
        } else {
            context.startService(new Intent(context, MediaNotificationService.class));
        }
        
        notificationManager.notify(NOTIFICATION_ID, builder.build());
    }
    
    @ReactMethod
    public void addListener(String eventName) {
        // Keep track of listeners if needed
    }

    @ReactMethod
    public void removeListeners(Integer count) {
        // Remove listeners if needed
    }
    
    private void sendEvent(ReactContext reactContext, String eventName, WritableMap params) {
        reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
            .emit(eventName, params != null ? params : Arguments.createMap());
    }
    
    @Override
    public void onCatalystInstanceDestroy() {
        super.onCatalystInstanceDestroy();
        
        // Clean up resources
        if (mediaSession != null) {
            mediaSession.release();
            mediaSession = null;
        }
        
        if (notificationReceiver != null) {
            LocalBroadcastManager.getInstance(getReactApplicationContext())
                .unregisterReceiver(notificationReceiver);
            notificationReceiver = null;
        }
        
        // Hide notification
        notificationManager.cancel(NOTIFICATION_ID);
    }
    
    // MediaSession callback to handle events from the media session
    private class MediaSessionCallback extends MediaSessionCompat.Callback {
        @Override
        public void onPlay() {
            sendEvent(getReactApplicationContext(), EVENT_PLAY, null);
        }

        @Override
        public void onPause() {
            sendEvent(getReactApplicationContext(), EVENT_PAUSE, null);
        }

        @Override
        public void onSkipToNext() {
            sendEvent(getReactApplicationContext(), EVENT_NEXT, null);
        }

        @Override
        public void onSkipToPrevious() {
            sendEvent(getReactApplicationContext(), EVENT_PREV, null);
        }

        @Override
        public void onStop() {
            sendEvent(getReactApplicationContext(), EVENT_STOP, null);
        }
    }
}