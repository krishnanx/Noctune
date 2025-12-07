package com.krishnanx.Noctune

import com.facebook.react.bridge.*
import android.content.Intent
import com.google.android.exoplayer2.MediaItem

class AutoMediaModule(reactContext: ReactApplicationContext) : 
    ReactContextBaseJavaModule(reactContext) {
        
    override fun getName(): String = "AutoMedia"

    fun createPlayableMediaItem(
        id: String,
        title: String,
        artist: String,
        album: String,
        artwork: String?,
        duration: Long
    ): MediaItem {
        return MediaItem.Builder()
            .setMediaId(id)
            .setUri(artwork ?: "")
            .setTag(mapOf(
                "title" to title,
                "artist" to artist,
                "album" to album,
                "duration" to duration
            ))
            .build()
    }


    @ReactMethod
    fun sendBrowseResult(callbackId: String, resultData: ReadableMap) {
        // Convert resultData to MediaItems
        val itemsArray = resultData.getArray("items")
        val mediaItems = mutableListOf<MediaItem>()

        itemsArray?.toArrayList()?.forEach { item ->
            if (item is ReadableMap) {
                val id = item.getString("id") ?: return@forEach
                val title = item.getString("title") ?: "Unknown"
                val artist = item.getString("artist") ?: "Unknown Artist"
                val album = item.getString("album") ?: ""
                val artwork = item.getString("artwork")
                val duration = item.getDouble("duration").toLong()

                mediaItems.add(createPlayableMediaItem(id, title, artist, album, artwork, duration))
            }
        }

        // Now update the MediaSession queue
        session.setQueue(mediaItems.mapIndexed { index, item ->
            MediaSessionCompat.QueueItem(item.description, index.toLong())
        })
    }


    @ReactMethod
    fun updateNowPlaying(
        title: String, 
        artist: String, 
        artwork: String?,
        album: String?,
        duration: Double?  // Make nullable
    ) {
        val context = reactApplicationContext
        val intent = Intent(context, AutoMediaService::class.java).apply {
            putExtra("action", "UPDATE_METADATA")
            putExtra("title", title)
            putExtra("artist", artist)
            putExtra("album", album ?: "")
            putExtra("artwork", artwork)
            putExtra("duration", (duration ?: 0.0).toLong() * 1000) // Convert to milliseconds and handle null
        }
        context.startService(intent)
    }

    @ReactMethod
    fun updatePlaybackState(isPlaying: Boolean, position: Double?) {
        val context = reactApplicationContext
        val intent = Intent(context, AutoMediaService::class.java).apply {
            putExtra("action", "UPDATE_PLAYBACK_STATE")
            putExtra("isPlaying", isPlaying)
            putExtra("position", ((position ?: 0.0) * 1000).toLong()) // Handle null
        }
        context.startService(intent)
    }

    @ReactMethod
    fun updatePosition(position: Double?, duration: Double?) {
        val context = reactApplicationContext
        val intent = Intent(context, AutoMediaService::class.java).apply {
            putExtra("action", "UPDATE_POSITION")
            putExtra("position", ((position ?: 0.0) * 1000).toLong()) // Handle null
            putExtra("duration", ((duration ?: 0.0) * 1000).toLong()) // Handle null
        }
        context.startService(intent)
    }

    @ReactMethod
    fun setMediaQueue(queue: ReadableMap?) {
        if (queue == null) return // Guard against null
        
        val context = reactApplicationContext
        val intent = Intent(context, AutoMediaService::class.java).apply {
            putExtra("action", "SET_QUEUE")
            putExtra("queue", Arguments.toBundle(queue))
        }
        context.startService(intent)
    }

    @ReactMethod
    fun startService() {
        val context = reactApplicationContext
        val intent = Intent(context, AutoMediaService::class.java)
        context.startService(intent)
    }

    @ReactMethod
    fun stopService() {
        val context = reactApplicationContext
        val intent = Intent(context, AutoMediaService::class.java).apply {
            putExtra("action", "STOP_SERVICE")
        }
        context.startService(intent)
    }

    companion object {
        // Basic playback control events
        const val EVENT_PLAY = "ANDROID_AUTO_PLAY"
        const val EVENT_PAUSE = "ANDROID_AUTO_PAUSE"
        const val EVENT_STOP = "ANDROID_AUTO_STOP"
        const val EVENT_NEXT = "ANDROID_AUTO_NEXT"
        const val EVENT_PREVIOUS = "ANDROID_AUTO_PREVIOUS"
        
        // Advanced control events
        const val EVENT_SEEK_TO = "ANDROID_AUTO_SEEK_TO"
        const val EVENT_SKIP_TO_QUEUE_ITEM = "ANDROID_AUTO_SKIP_TO_QUEUE_ITEM"
        
        // Browse and search events
        const val EVENT_PLAY_FROM_ID = "ANDROID_AUTO_PLAY_FROM_ID"
        const val EVENT_PLAY_FROM_SEARCH = "ANDROID_AUTO_PLAY_FROM_SEARCH"
        const val EVENT_BROWSE_REQUEST = "ANDROID_AUTO_BROWSE_REQUEST"
    }
}