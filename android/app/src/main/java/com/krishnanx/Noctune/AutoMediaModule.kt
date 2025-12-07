package com.krishnanx.Noctune
import android.util.Log
import com.facebook.react.bridge.*
import android.content.Intent
import com.google.android.exoplayer2.MediaItem


class AutoMediaModule(reactContext: ReactApplicationContext) : 

    ReactContextBaseJavaModule(reactContext) {
        
    override fun getName(): String = "AutoMedia"
    private val TAG = "AutoMediaService"
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
    fun sendBrowseResult(callbackId: String?, resultData: ReadableMap?) {
        if (callbackId == null || resultData == null) {
            // Just ignore the call
            return
        }
        Log.d(TAG, "onLoadChildren called with callbackId: $callbackId")
        // Now safe to use both non-null
        val itemsArray = resultData.getArray("items")
        val mediaItems = mutableListOf<MediaItem>()
        Log.d(TAG, "Received resultData: $resultData")
        if (itemsArray == null) {
            Log.d(TAG, "itemsArray is null!")
        } else {
            Log.d(TAG, "itemsArray has ${itemsArray.size()} elements")
        }

        itemsArray?.toArrayList()?.forEach { item ->
            if (item is ReadableMap) {
                val id = item.getString("id") ?: return@forEach
                val title = item.getString("title") ?: "Untitled"
                val artist = item.getString("artist") ?: "Various Artists"
                val album = item.getString("album") ?: "Album"
                val duration = item.getDouble("duration").toLong().takeIf { it > 0 } ?: 1000L
                val artwork = item.getString("artwork") ?: "https://placeholder.com/cover.jpg"
                Log.d(TAG, "Received item -> id: $id, title: $title, artist: $artist, album: $album, duration: $duration, artwork: $artwork")

                mediaItems.add(createPlayableMediaItem(id, title, artist, album, artwork, duration))
            }
        }

        val context = reactApplicationContext
        val intent = Intent(context, AutoMediaService::class.java).apply {
            putExtra("action", "SET_QUEUE_NATIVE")
            putExtra("queue", Arguments.toBundle(resultData))
        }
        context.startService(intent)
    }

    @ReactMethod
    fun addListener(eventName: String?) {
        // Required for RN NativeEventEmitter; can be empty
    }

    @ReactMethod
    fun removeListeners(count: Int) {
        // Required for RN NativeEventEmitter; can be empty
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