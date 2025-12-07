package com.krishnanx.Noctune
import android.util.Log

import android.app.Service
import android.content.Intent
import android.os.Bundle
import android.net.Uri
import android.graphics.Bitmap
import androidx.media.MediaBrowserServiceCompat
import android.support.v4.media.session.MediaSessionCompat
import android.support.v4.media.session.PlaybackStateCompat
import android.support.v4.media.MediaMetadataCompat
import android.support.v4.media.MediaDescriptionCompat
import android.support.v4.media.MediaBrowserCompat.MediaItem
import androidx.media.MediaBrowserServiceCompat.BrowserRoot
import androidx.media.MediaBrowserServiceCompat.Result
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.modules.core.DeviceEventManagerModule
import java.util.ArrayList
import com.facebook.react.ReactInstanceManager
import com.facebook.react.bridge.ReactContext
class AutoMediaService : MediaBrowserServiceCompat() {
    private lateinit var session: MediaSessionCompat
    private lateinit var playbackStateBuilder: PlaybackStateCompat.Builder
    private lateinit var metadataBuilder: MediaMetadataCompat.Builder
    private val TAG = "AutoMediaService"

    // Store queue for browsing
    private var currentQueue: MutableList<MediaItem> = mutableListOf()
    private var currentTrack: MediaMetadataCompat? = null

    override fun onCreate() {
        super.onCreate()

        session = MediaSessionCompat(this, "AutoMediaService").apply {
            setCallback(MediaSessionCallback())
            setFlags(
                MediaSessionCompat.FLAG_HANDLES_MEDIA_BUTTONS or 
                MediaSessionCompat.FLAG_HANDLES_TRANSPORT_CONTROLS
            )
            
            // Set initial playback state with all actions
            playbackStateBuilder = PlaybackStateCompat.Builder()
                .setActions(
                    PlaybackStateCompat.ACTION_PLAY or 
                    PlaybackStateCompat.ACTION_PAUSE or
                    PlaybackStateCompat.ACTION_SKIP_TO_NEXT or
                    PlaybackStateCompat.ACTION_SKIP_TO_PREVIOUS or
                    PlaybackStateCompat.ACTION_SEEK_TO or
                    PlaybackStateCompat.ACTION_STOP or
                    PlaybackStateCompat.ACTION_PLAY_FROM_MEDIA_ID or
                    PlaybackStateCompat.ACTION_PLAY_FROM_SEARCH
                )
                .setState(PlaybackStateCompat.STATE_NONE, 0, 1.0f)
            
            setPlaybackState(playbackStateBuilder.build())
            
            // Initialize metadata builder
            metadataBuilder = MediaMetadataCompat.Builder()
            
            isActive = true
        }

        sessionToken = session.sessionToken
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        intent?.let { handleIntent(it) }
        return START_STICKY
    }

    private fun handleIntent(intent: Intent) {
        when (intent.getStringExtra("action")) {
            "UPDATE_METADATA" -> {
                val title = intent.getStringExtra("title") ?: ""
                val artist = intent.getStringExtra("artist") ?: ""
                val album = intent.getStringExtra("album") ?: ""
                val artwork = intent.getStringExtra("artwork")
                val duration = intent.getLongExtra("duration", 0)
                updateMetadata(title, artist, album, artwork, duration)
            }
            "UPDATE_PLAYBACK_STATE" -> {
                val isPlaying = intent.getBooleanExtra("isPlaying", false)
                val position = intent.getLongExtra("position", 0)
                updatePlaybackState(
                    if (isPlaying) PlaybackStateCompat.STATE_PLAYING 
                    else PlaybackStateCompat.STATE_PAUSED,
                    position
                )
            }
            "UPDATE_POSITION" -> {
                val position = intent.getLongExtra("position", 0)
                val duration = intent.getLongExtra("duration", 0)
                updatePosition(position, duration)
            }
            "SET_QUEUE" -> {
                val queueBundle = intent.getBundleExtra("queue")
                queueBundle?.let { updateQueue(it) }
            }
            "STOP_SERVICE" -> {
                stopSelf()
            }
        }
    }

    private fun updateMetadata(
        title: String, 
        artist: String, 
        album: String, 
        artwork: String?, 
        duration: Long
    ) {
        val metadata = metadataBuilder
            .putString(MediaMetadataCompat.METADATA_KEY_TITLE, title)
            .putString(MediaMetadataCompat.METADATA_KEY_ARTIST, artist)
            .putString(MediaMetadataCompat.METADATA_KEY_ALBUM, album)
            .putString(MediaMetadataCompat.METADATA_KEY_DISPLAY_TITLE, title)
            .putString(MediaMetadataCompat.METADATA_KEY_DISPLAY_SUBTITLE, artist)
            .putString(MediaMetadataCompat.METADATA_KEY_DISPLAY_DESCRIPTION, album)
            .putLong(MediaMetadataCompat.METADATA_KEY_DURATION, duration)

        // Set artwork URL
        artwork?.let {
            metadata.putString(MediaMetadataCompat.METADATA_KEY_ALBUM_ART_URI, it)
            metadata.putString(MediaMetadataCompat.METADATA_KEY_DISPLAY_ICON_URI, it)
        }

        currentTrack = metadata.build()
        session.setMetadata(currentTrack)
    }

    private fun updatePlaybackState(state: Int, position: Long = 0) {
        val currentPosition = if (position > 0) position else 
            session.controller.playbackState?.position ?: 0
            
        val playbackState = playbackStateBuilder
            .setState(state, currentPosition, 1.0f)
            .build()
        session.setPlaybackState(playbackState)
    }

    private fun updatePosition(position: Long, duration: Long) {
        val currentState = session.controller.playbackState?.state 
            ?: PlaybackStateCompat.STATE_NONE
            
        val playbackState = playbackStateBuilder
            .setState(currentState, position, 1.0f)
            .build()
        session.setPlaybackState(playbackState)

        // Update duration in metadata if changed
        currentTrack?.let { current ->
            val currentDuration = current.getLong(MediaMetadataCompat.METADATA_KEY_DURATION)
            if (currentDuration != duration) {
                val updatedMetadata = MediaMetadataCompat.Builder(current)
                    .putLong(MediaMetadataCompat.METADATA_KEY_DURATION, duration)
                    .build()
                session.setMetadata(updatedMetadata)
                currentTrack = updatedMetadata
            }
        }
    }

    private fun updateQueue(queueBundle: Bundle) {
        try {
            currentQueue.clear()
            
            val itemsArray = queueBundle.getParcelableArrayList<Bundle>("items")
            itemsArray?.forEach { itemBundle ->
                val id = itemBundle.getString("id") ?: return@forEach
                val title = itemBundle.getString("title") ?: "Unknown"
                val artist = itemBundle.getString("artist") ?: "Unknown Artist"
                val album = itemBundle.getString("album") ?: ""
                val artwork = itemBundle.getString("artwork")
                val duration = itemBundle.getLong("duration", 0)

                val mediaItem = createPlayableMediaItem(
                    id, title, artist, album, artwork, duration
                )
                currentQueue.add(mediaItem)
            }

            // Update session queue
            val queueItems = currentQueue.mapIndexed { index, item ->
                MediaSessionCompat.QueueItem(item.description, index.toLong())
            }
            session.setQueue(queueItems)
            
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    private inner class MediaSessionCallback : MediaSessionCompat.Callback() {
        override fun onPlay() {
            sendEventToReactNative(AutoMediaModule.EVENT_PLAY, null)
            updatePlaybackState(PlaybackStateCompat.STATE_PLAYING)
        }

        override fun onPause() {
            sendEventToReactNative(AutoMediaModule.EVENT_PAUSE, null)
            updatePlaybackState(PlaybackStateCompat.STATE_PAUSED)
        }

        override fun onStop() {
            sendEventToReactNative(AutoMediaModule.EVENT_STOP, null)
            updatePlaybackState(PlaybackStateCompat.STATE_STOPPED)
        }

        override fun onSkipToNext() {
            sendEventToReactNative(AutoMediaModule.EVENT_NEXT, null)
        }

        override fun onSkipToPrevious() {
            sendEventToReactNative(AutoMediaModule.EVENT_PREVIOUS, null)
        }

        override fun onPlayFromMediaId(mediaId: String?, extras: Bundle?) {
            val params = Arguments.createMap().apply {
                putString("mediaId", mediaId)
                extras?.let { bundle ->
                    // Add any extras if needed
                }
            }
            sendEventToReactNative(AutoMediaModule.EVENT_PLAY_FROM_ID, params)
        }

        override fun onPlayFromSearch(query: String?, extras: Bundle?) {
            val params = Arguments.createMap().apply {
                putString("query", query)
            }
            sendEventToReactNative(AutoMediaModule.EVENT_PLAY_FROM_SEARCH, params)
        }

        override fun onSeekTo(position: Long) {
            val params = Arguments.createMap().apply {
                putDouble("position", position.toDouble())
            }
            sendEventToReactNative(AutoMediaModule.EVENT_SEEK_TO, params)
            
            // Update state immediately
            val currentState = session.controller.playbackState?.state 
                ?: PlaybackStateCompat.STATE_NONE
            updatePlaybackState(currentState, position)
        }

        override fun onSkipToQueueItem(id: Long) {
            val params = Arguments.createMap().apply {
                putInt("index", id.toInt())
            }
            sendEventToReactNative(AutoMediaModule.EVENT_SKIP_TO_QUEUE_ITEM, params)
        }
    }

    private fun sendEventToReactNative(eventName: String, params: WritableMap?) {
    val reactInstanceManager = (application as MainApplication).reactNativeHost.reactInstanceManager
    val reactContext = reactInstanceManager.currentReactContext

    if (reactContext != null) {
        reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            ?.emit(eventName, params)
    } else {
        // Queue for later
        reactInstanceManager.addReactInstanceEventListener(object : ReactInstanceManager.ReactInstanceEventListener {
        override fun onReactContextInitialized(reactContext: ReactContext) {
            reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                ?.emit(eventName, params)
        }
    })

    }
}


    override fun onGetRoot(
        clientPackageName: String, 
        clientUid: Int, 
        rootHints: Bundle?
    ): BrowserRoot {
        // You can implement authentication here if needed
        return BrowserRoot("root", null)
    }
    private val pendingResults = mutableMapOf<String, Result<MutableList<MediaItem>>>() 

    override fun onLoadChildren(parentId: String, result: Result<MutableList<MediaItem>>) {
    when (parentId) {
        "root" -> {
            val mediaItems = mutableListOf<MediaItem>()
            mediaItems.add(createBrowsableMediaItem("queue", "Current Queue"))
            mediaItems.add(createBrowsableMediaItem("playlists", "Playlists"))
            mediaItems.add(createBrowsableMediaItem("artists", "Artists"))
            mediaItems.add(createBrowsableMediaItem("albums", "Albums"))
            mediaItems.add(createBrowsableMediaItem("songs", "All Songs"))
            mediaItems.add(createBrowsableMediaItem("recent", "Recently Played"))
            result.sendResult(mediaItems)
        }

        "playlists", "playlist_*" -> {
            // Detach result for async response
            result.detach()

            // Store result in map with parentId
            pendingResults[parentId] = result

            // Send event to JS
            sendBrowseRequest(parentId)
        }

        else -> {
            result.sendResult(mutableListOf())
        }
    }
}

private fun sendBrowseRequest(parentId: String) {
    val params = Arguments.createMap().apply { putString("parentId", parentId) }

    val reactInstanceManager = (application as MainApplication).reactNativeHost.reactInstanceManager
    val reactContext = reactInstanceManager.currentReactContext

    reactContext?.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
        ?.emit(AutoMediaModule.EVENT_BROWSE_REQUEST, params)
}

// JS sends results back here
fun onBrowseResult(parentId: String, items: List<ReadableMap>) {
    val result = pendingResults.remove(parentId) ?: return

    val mediaItems = items.map { item ->
        createBrowsableMediaItem(
            item.getString("id") ?: "",
            item.getString("title") ?: "Untitled"
        )
    }.toMutableList()

    result.sendResult(mediaItems)
}



    private fun createBrowsableMediaItem(
        mediaId: String, 
        title: String,
        subtitle: String = ""
    ): MediaItem {
        val description = MediaDescriptionCompat.Builder()
            .setMediaId(mediaId)
            .setTitle(title)
            .setSubtitle(subtitle)
            .build()
        
        return MediaItem(description, MediaItem.FLAG_BROWSABLE)
    }

    private fun createPlayableMediaItem(
        mediaId: String, 
        title: String, 
        artist: String,
        album: String,
        artworkUri: String?,
        duration: Long
    ): MediaItem {
        val descriptionBuilder = MediaDescriptionCompat.Builder()
            .setMediaId(mediaId)
            .setTitle(title)
            .setSubtitle(artist)
            .setDescription(album)
            
        artworkUri?.let { 
            descriptionBuilder.setIconUri(Uri.parse(it)) 
        }
        
        val extras = Bundle().apply {
            putLong("duration", duration)
            putString("album", album)
        }
        descriptionBuilder.setExtras(extras)
        
        return MediaItem(descriptionBuilder.build(), MediaItem.FLAG_PLAYABLE)
    }

    override fun onDestroy() {
        super.onDestroy()
        session.isActive = false
        session.release()
    }
}