
import { Audio } from "expo-av";
import { useSelector } from "react-redux";
import Constants from "expo-constants";
import {progress} from "../../Store/MusicSlice.js"
import { useDispatch } from "react-redux";
import { setIsPlaying } from "../../Store/MusicSlice.js";
export const soundRef = {
  current: null,
};

export const loadAudio = async (data,pos,dispatch,getSeek) => {
  console.log(data[pos].url);
 
  try {
    if (!data[pos]) {
      throw new Error("Data at the given position is undefined or invalid.");
    }
  
    const audioUri = `${Constants.expoConfig.extra.SERVER}/api/stream?url=${encodeURIComponent(data[pos].url)}`;
    console.log("Audio URI:", audioUri);  // Check if the URL is correct
  
    if (soundRef.current) {
      await soundRef.current.unloadAsync();
      soundRef.current = null;
    }
    console.log("i am here before dispatch");
    dispatch(progress(0));
    console.log("i am here after dispatch");
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });
    } catch (audioModeError) {
      console.error("Error setting audio mode:", audioModeError);
      throw audioModeError;  // Rethrow if necessary
    }
  
    const { sound } = await Audio.Sound.createAsync(
      { uri: audioUri },
      { shouldPlay: false, progressUpdateIntervalMillis: 1060 },
      onPlaybackStatusUpdate
    );
  
    soundRef.current = sound;
    sound.setOnPlaybackStatusUpdate((status) => {
      onPlaybackStatusUpdate(status, dispatch, getSeek);
          
    });

    console.log("Audio Loaded", soundRef.current);
     await soundRef.current.playAsync(); // ✅ Automatically starts playing
     dispatch(setIsPlaying(true));
        
  } catch (error) {
    console.error("Error loading audio:", error);
    // console.error("Stack trace:", error.stack);  // Log stack trace for more details
  }
};

export const unloadAudio = async () => {
  if (soundRef.current) {
    await soundRef.current.unloadAsync();
    soundRef.current = null;
  }
};
const onPlaybackStatusUpdate = (status,dispatch,getSeek) => {
  if (status.isLoaded) {
    console.log("hi?");
    console.log("positionMillis:", status.positionMillis / 1000);
    if (status.isPlaying) {
      dispatch(progress(+1));
    }

    if (status.didJustFinish) {
      const currentSeek = getSeek?.();
      if (currentSeek != data[pos]?.duration && currentSeek != 0) {
        console.log("finishing up!!");
        tailFill(data[pos]?.duration);
      }
    }
  } else if (status.error) {
    console.log(`Playback error: ${status.error}`);
  }
};
const tailFill = async (currentSec,dispatch) => {
  // for (let sec = currentSec + 1; sec <= data?.duration; sec++) {
  //   // wait 1 s
  //   await new Promise(res => setTimeout(res, 1000));
  //   setProgressSeconds(sec);
  // }
  // once done:
  dispatch(progress(currentSec));
  dispatch(setIsPlaying(false));
  unloadAudio();
  return; // if you want to free the sound
};