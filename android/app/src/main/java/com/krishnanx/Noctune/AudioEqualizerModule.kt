package com.krishnanx.Noctune

import android.media.audiofx.Equalizer
import android.util.Log
import com.facebook.react.bridge.*

class AudioEqualizerModule(
    reactContext: ReactApplicationContext
) : ReactContextBaseJavaModule(reactContext) {

    private var equalizer: Equalizer? = null
    private val TAG = "AudioEQ"

    override fun getName(): String = "AudioEqualizer"

    @ReactMethod
    fun init(sessionId: Int) {
        release()
        try {
            equalizer = Equalizer(0, sessionId).apply {
                enabled = true
            }
            Log.d(TAG, "EQ initialized with sessionId=$sessionId, bands=${equalizer?.numberOfBands}")
        } catch (e: Exception) {
            Log.e(TAG, "EQ init failed: ${e.message}")
        }
    }

    @ReactMethod
    fun getBandCount(promise: Promise) {
        val count = equalizer?.numberOfBands?.toInt() ?: 0
        Log.d(TAG, "getBandCount: $count")
        promise.resolve(count)
    }

    @ReactMethod
    fun getBandRange(promise: Promise) {
        val range = equalizer?.bandLevelRange
        if (range != null) {
            Log.d(TAG, "getBandRange: min=${range[0]} max=${range[1]}")
            val arr = Arguments.createArray()
            arr.pushInt(range[0].toInt())
            arr.pushInt(range[1].toInt())
            promise.resolve(arr)
        } else {
            Log.e(TAG, "getBandRange failed: EQ not initialized")
            promise.reject("EQ_NOT_READY", "Equalizer not initialized")
        }
    }

    @ReactMethod
    fun setBandLevel(band: Int, level: Int) {
        equalizer?.setBandLevel(band.toShort(), level.toShort())
        Log.d(TAG, "setBandLevel: band=$band, level=$level")
    }

    @ReactMethod
    fun reset() {
        equalizer?.let {
            for (i in 0 until it.numberOfBands) {
                it.setBandLevel(i.toShort(), 0)
                Log.d(TAG, "reset band $i to 0")
            }
        }
    }

    @ReactMethod
    fun release() {
        equalizer?.release()
        Log.d(TAG, "EQ released")
        equalizer = null
    }
}
