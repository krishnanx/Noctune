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
    private long currentDuration = 0; // Store duration in milliseconds

    private long currentPosition = 0;

    // Thread safety and builder management
    private NotificationCompat.Builder builder;
    private final Object builderLock = new Object();
    private volatile boolean isNotificationBuilt = false;
    private Handler mainHandler;

    public MediaNotificationModule(ReactApplicationContext reactContext) {
        super(reactContext);
        notificationManager = NotificationManagerCompat.from(reactContext);
        mainHandler = new Handler(Looper.getMainLooper());
        
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
                PlaybackStateCompat.ACTION_STOP |
                PlaybackStateCompat.ACTION_SEEK_TO
            );
            
        mediaSession.setPlaybackState(stateBuilder.build());
        
        mainHandler.post(() -> {
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
    public void showNotification(ReadableMap trackData, int position, Promise promise) {
        try {
            Log.d(TAG, "showNotification called");
            
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
            
            // Create notification immediately without artwork to ensure builder is ready
            createAndShowNotification(isPlaying, null);
            
            // Load artwork asynchronously if available
            if (currentArtwork != null && !currentArtwork.isEmpty()) {
                new Thread(() -> {
                    try {
                        Bitmap artwork = getBitmapFromURL(currentArtwork);
                        if (artwork != null) {
                            Log.d(TAG, "Artwork loaded, updating notification");
                            updateNotificationWithArtwork(artwork);
                        }
                    } catch (Exception e) {
                        Log.e(TAG, "Error loading artwork", e);
                    }
                }).start();
            }
            
            isNotificationActive = true;
            promise.resolve(true);
        } catch (Exception e) {
            Log.e(TAG, "Failed to show notification", e);
            promise.reject("ERROR", "Failed to show notification: " + e.getMessage());
        }
    }

    // @ReactMethod
    // public void updatePlaybackStatus(boolean isPlaying, int position,Promise promise) {
    //     try {
    //         Log.d(TAG, "updatePlaybackStatus: " + isPlaying);
    //         this.isPlaying = isPlaying;
    //         if (isNotificationActive) {
    //             updateNotificationPlaybackState();
    //         }
    //         promise.resolve(true);
    //     } catch (Exception e) {
    //         promise.reject("ERROR", "Failed to update notification: " + e.getMessage());
    //     }
    // }

    @ReactMethod
    public void updateProgress(int position, int duration, Promise promise) {
        try {
            Log.d(TAG, "updateProgress called: " + position + "ms / " + duration + "ms");
            
            this.currentPosition = position;

            // Store duration for metadata
            if (duration > 0) {
                currentDuration = duration;
            }

            updateMediaSessionPlaybackState();

            // // Update MediaSession with position and playback state
            // // This is what actually drives the progress bar in MediaStyle notifications
            // PlaybackStateCompat playbackState = new PlaybackStateCompat.Builder()
            //     .setState(
            //         isPlaying ? PlaybackStateCompat.STATE_PLAYING : PlaybackStateCompat.STATE_PAUSED,
            //         position, // position in milliseconds - THIS drives the progress bar
            //         1.0f // playback speed
            //     )
            //     .setActions(
            //         PlaybackStateCompat.ACTION_PLAY |
            //         PlaybackStateCompat.ACTION_PAUSE |
            //         PlaybackStateCompat.ACTION_SKIP_TO_NEXT |
            //         PlaybackStateCompat.ACTION_SKIP_TO_PREVIOUS |
            //         PlaybackStateCompat.ACTION_STOP |
            //         PlaybackStateCompat.ACTION_SEEK_TO
            //     )
            //     .build();
            
            // mediaSession.setPlaybackState(playbackState);
            
            // Update MediaSession metadata with duration
            // Both position (from playback state) and duration (from metadata) are needed for progress bar
            if (currentDuration > 0) {
                MediaMetadataCompat.Builder metadataBuilder = new MediaMetadataCompat.Builder()
                    .putString(MediaMetadataCompat.METADATA_KEY_TITLE, currentTitle)
                    .putString(MediaMetadataCompat.METADATA_KEY_ARTIST, currentArtist)
                    .putString(MediaMetadataCompat.METADATA_KEY_ALBUM, currentAlbum)
                    .putLong(MediaMetadataCompat.METADATA_KEY_DURATION, currentDuration); // Duration in milliseconds
                
                // Add artwork if we have it loaded
                if (currentArtwork != null && !currentArtwork.isEmpty()) {
                    // Load artwork in background and update metadata
                    new Thread(() -> {
                        try {
                            Bitmap artwork = getBitmapFromURL(currentArtwork);
                            if (artwork != null) {
                                metadataBuilder.putBitmap(MediaMetadataCompat.METADATA_KEY_ALBUM_ART, artwork);
                            }
                            mediaSession.setMetadata(metadataBuilder.build());
                        } catch (Exception e) {
                            Log.e(TAG, "Error loading artwork for metadata", e);
                            mediaSession.setMetadata(metadataBuilder.build());
                        }
                    }).start();
                } else {
                    mediaSession.setMetadata(metadataBuilder.build());
                }
            }
            
            Log.d(TAG, "MediaSession updated with position: " + position + "ms, duration: " + currentDuration + "ms");
            
            promise.resolve(true);
        } catch (Exception e) {
            Log.e(TAG, "updateProgress failed", e);
            promise.reject("UPDATE_PROGRESS_FAILED", e.getMessage());
        }
    }

    @ReactMethod
    public void updateTrackData(ReadableMap trackData, Promise promise) {
        try {
            Log.d(TAG, "updateTrackData called");
            
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

            if (isNotificationActive) {
                updateNotification(isPlaying,0);
            }
            
            promise.resolve(true);
        } catch (Exception e) {
            promise.reject("UPDATE_FAILED", e.getMessage());
        }
    }

    @ReactMethod
    public void updatePlaybackStatus(boolean isPlaying, int position, Promise promise) {
        try {
            Log.d(TAG, "updatePlaybackStatus: " + isPlaying + ", position: " + position);
            this.isPlaying = isPlaying;
            this.currentPosition = position; // Store the position HERE
            
            if (isNotificationActive) {
                updateNotificationPlaybackState();
            }
            
            // MOST IMPORTANT: Update the MediaSession state with the correct position
            updateMediaSessionPlaybackState();
            
            promise.resolve(true);
        } catch (Exception e) {
            promise.reject("ERROR", "Failed to update notification: " + e.getMessage());
        }
    }

    @ReactMethod
    public void hideNotification(Promise promise) {
        try {
            Log.d(TAG, "hideNotification called");
            
            synchronized (builderLock) {
                builder = null;
                isNotificationBuilt = false;
            }
            
            notificationManager.cancel(NOTIFICATION_ID);
            isNotificationActive = false;
            promise.resolve(true);
        } catch (Exception e) {
            promise.reject("ERROR", "Failed to hide notification: " + e.getMessage());
        }
    }

    private void updateNotification(boolean isPlaying, int position) {
        Log.d(TAG, "updateNotification called, isPlaying: " + isPlaying);
        
        // Store the position
        this.currentPosition = position;
        
        // Set media session metadata
        MediaMetadataCompat.Builder metadataBuilder = new MediaMetadataCompat.Builder()
            .putString(MediaMetadataCompat.METADATA_KEY_TITLE, currentTitle)
            .putString(MediaMetadataCompat.METADATA_KEY_ARTIST, currentArtist)
            .putString(MediaMetadataCompat.METADATA_KEY_ALBUM, currentAlbum);
        
        // Add duration if we have it
        if (currentDuration > 0) {
            metadataBuilder.putLong(MediaMetadataCompat.METADATA_KEY_DURATION, currentDuration);
        }
        
        // Load artwork if available
        if (currentArtwork != null && !currentArtwork.isEmpty()) {
            new Thread(() -> {
                try {
                    Bitmap artwork = getBitmapFromURL(currentArtwork);
                    if (artwork != null) {
                        metadataBuilder.putBitmap(MediaMetadataCompat.METADATA_KEY_ALBUM_ART, artwork);
                        mediaSession.setMetadata(metadataBuilder.build());
                        
                        // Update notification with artwork
                        createAndShowNotification(isPlaying, artwork);
                    } else {
                        mediaSession.setMetadata(metadataBuilder.build());
                        createAndShowNotification(isPlaying, null);
                    }
                } catch (Exception e) {
                    Log.e(TAG, "Error loading artwork", e);
                    mediaSession.setMetadata(metadataBuilder.build());
                    createAndShowNotification(isPlaying, null);
                }
            }).start();
        } else {
            mediaSession.setMetadata(metadataBuilder.build());
            createAndShowNotification(isPlaying, null);
        }
        
        // Update playback state with stored position
        updateMediaSessionPlaybackState();
    }
    
    // private void updatePlaybackState(boolean isPlaying, int position) {
    //     int playbackState = isPlaying ? 
    //         PlaybackStateCompat.STATE_PLAYING : 
    //         PlaybackStateCompat.STATE_PAUSED;
            
    //     stateBuilder.setState(playbackState,position, 1.0f);
    //     mediaSession.setPlaybackState(stateBuilder.build());
    // }

    private void updateMediaSessionPlaybackState() {
            int state = isPlaying ? 
                PlaybackStateCompat.STATE_PLAYING : 
                PlaybackStateCompat.STATE_PAUSED;
                
            Log.d(TAG, "Setting MediaSession playback state - Playing: " + isPlaying + ", Position: " + currentPosition);
            
            // Create a NEW PlaybackStateCompat.Builder each time to ensure clean state
            PlaybackStateCompat playbackState = new PlaybackStateCompat.Builder()
                .setState(state, currentPosition, 1.0f)
                .setActions(
                    PlaybackStateCompat.ACTION_PLAY |
                    PlaybackStateCompat.ACTION_PAUSE |
                    PlaybackStateCompat.ACTION_SKIP_TO_NEXT |
                    PlaybackStateCompat.ACTION_SKIP_TO_PREVIOUS |
                    PlaybackStateCompat.ACTION_STOP |
                    PlaybackStateCompat.ACTION_SEEK_TO
                )
                .build();
                
            mediaSession.setPlaybackState(playbackState);
        }

    
    // Simplified method - no position parameter needed since we store it in the class
    private void updateNotificationPlaybackState() {
        synchronized (builderLock) {
            if (builder != null && isNotificationBuilt) {
                // Update play/pause button
                Context context = getReactApplicationContext();
                int playPauseIcon = isPlaying ? 
                    android.R.drawable.ic_media_pause : 
                    android.R.drawable.ic_media_play;
                
                Intent playPauseIntent = new Intent(isPlaying ? ACTION_PAUSE : ACTION_PLAY);
                PendingIntent playPausePendingIntent = PendingIntent.getBroadcast(
                    context, 
                    1, 
                    playPauseIntent, 
                    PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
                );
                
                // Clear existing actions and rebuild
                builder.clearActions();
                builder.addAction(android.R.drawable.ic_media_previous, "Previous", createPendingIntent(ACTION_PREV, 3));
                builder.addAction(playPauseIcon, isPlaying ? "Pause" : "Play", playPausePendingIntent);
                builder.addAction(android.R.drawable.ic_media_next, "Next", createPendingIntent(ACTION_NEXT, 2));
                
                builder.setOngoing(isPlaying);
                
                notificationManager.notify(NOTIFICATION_ID, builder.build());
                Log.d(TAG, "Updated playback state in notification");
            }
        }
    }

    private void updateNotificationWithArtwork(Bitmap artwork) {
        synchronized (builderLock) {
            if (builder != null && isNotificationBuilt) {
                builder.setLargeIcon(artwork);
                notificationManager.notify(NOTIFICATION_ID, builder.build());
                Log.d(TAG, "Updated notification with artwork");
            }
        }
    }

    private PendingIntent createPendingIntent(String action, int requestCode) {
        Intent intent = new Intent(action);
        return PendingIntent.getBroadcast(
            getReactApplicationContext(), 
            requestCode, 
            intent, 
            PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );
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
    
    private void createAndShowNotification(boolean isPlaying, Bitmap artwork) {
        Log.d(TAG, "createAndShowNotification called, isPlaying: " + isPlaying);
        
        Context context = getReactApplicationContext();
        
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
        
        // Thread-safe builder creation
        synchronized (builderLock) {
            // Build notification WITHOUT setProgress - MediaStyle handles progress automatically
            builder = new NotificationCompat.Builder(context, CHANNEL_ID)
                .setContentTitle(currentTitle)
                .setContentText(currentArtist)
                .setSubText(currentAlbum)
                .setSmallIcon(appIcon)
                .setPriority(NotificationCompat.PRIORITY_DEFAULT)
                .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
                .setOnlyAlertOnce(true)
                .setOngoing(isPlaying)
                // REMOVED setProgress - MediaStyle gets progress from MediaSession automatically
                // Add media style
                .setStyle(new androidx.media.app.NotificationCompat.MediaStyle()
                    .setMediaSession(mediaSession.getSessionToken())
                    .setShowActionsInCompactView(0, 1, 2))
                // Add actions
                .addAction(android.R.drawable.ic_media_previous, "Previous", createPendingIntent(ACTION_PREV, 3))
                .addAction(playPauseIcon, isPlaying ? "Pause" : "Play", createPendingIntent(isPlaying ? ACTION_PAUSE : ACTION_PLAY, 1))
                .addAction(android.R.drawable.ic_media_next, "Next", createPendingIntent(ACTION_NEXT, 2));
            
            // Set large icon (artwork) if available
            if (artwork != null) {
                builder.setLargeIcon(artwork);
            }
            
            isNotificationBuilt = true;
            Log.d(TAG, "Builder created and ready - MediaStyle will handle progress automatically");
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

        @Override
        public void onSeekTo(long position) {
            // Handle seek events from the progress bar
            Log.d(TAG, "onSeekTo called with position: " + position);
            
            // Update stored position when user seeks
            currentPosition = position;
            
            // Send to JavaScript
            WritableMap params = Arguments.createMap();
            params.putDouble("position", position);
            sendEvent(getReactApplicationContext(), "onSeekEvent", params);
        }
    }
}