package com.krishnanx.Noctune

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager

class AudioEqualizerPackage : ReactPackage {
    override fun createNativeModules(
        reactContext: ReactApplicationContext
    ) = listOf(AudioEqualizerModule(reactContext))

    override fun createViewManagers(
        reactContext: ReactApplicationContext
    ): List<ViewManager<*, *>> = emptyList()
}
