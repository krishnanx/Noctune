import { Audio } from "expo-av";
import { useSelector } from "react-redux";
import Constants from "expo-constants";
import { progress } from "../../Store/MusicSlice.js";
import { useDispatch } from "react-redux";
import { setIsPlaying, load, changePos } from "../../Store/MusicSlice.js";
export const soundRef = {
  current: null,
};

export const loadAudio = async (
  data,
  pos,
  dispatch,
  getSeek,
  isLoadedFromAsyncStorage
) => {
  console.warn(data[pos].url);

  try {
    if (!data[pos]) {
      throw new Error("Data at the given position is undefined or invalid.");
    }
    //http://192.168.1.44
    //Constants.expoConfig.extra.SERVER
   

    const audioUri = `${
      Constants.expoConfig.extra.SERVER
    }/api/stream?url=${encodeURIComponent(data[pos].url)}`;
    console.warn("Audio URI:", audioUri); // Check if the URL is correct

    if (soundRef.current) {
      await soundRef.current.unloadAsync();
      soundRef.current = null;
    }
    console.warn("i am here before dispatch");
    dispatch(progress(0));
    console.warn("i am here after dispatch");
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
      throw audioModeError; // Rethrow if necessary
    }

    const { sound } = await Audio.Sound.createAsync(
      { uri: audioUri },
      { shouldPlay: false, progressUpdateIntervalMillis: 1060 },
      onPlaybackStatusUpdate
    );



    soundRef.current = sound;
    sound.setOnPlaybackStatusUpdate((status) => {
      onPlaybackStatusUpdate(status, dispatch, getSeek, data, pos);
    });

    console.warn("Audio Loaded", soundRef.current);
    if (!isLoadedFromAsyncStorage) {
      await soundRef.current.playAsync();
      dispatch(setIsPlaying(true));
    }
  } catch (error) {
    console.error("Error loading audio:", error);

  }
};

export const unloadAudio = async () => {
  if (soundRef.current) {
    await soundRef.current.unloadAsync();
    soundRef.current = null;
  }
};
const onPlaybackStatusUpdate = (status, dispatch, getSeek, data, pos) => {
  if (status.isLoaded) {
    console.warn("hi?");
    console.warn("positionMillis:", status.positionMillis / 1000);
    if (status.isPlaying) {
      dispatch(progress(+1));
    }

    if (status.didJustFinish) {
      const currentSeek = getSeek?.();
      if (currentSeek != data[pos]?.duration && currentSeek != 0) {
        console.warn("finishing up!!");
        tailFill(data[pos]?.duration, dispatch);

      }
    }
  } else if (status.error) {
    console.warn(`Playback error: ${status.error}`);
  }
};
const tailFill = async (currentSec, dispatch) => {
  // for (let sec = currentSec + 1; sec <= data?.duration; sec++) {
  //   // wait 1 s
  //   await new Promise(res => setTimeout(res, 1000));
  //   setProgressSeconds(sec);
  // }
  // once done:
  dispatch(progress(currentSec));
  //dispatch(setIsPlaying(false));
  dispatch(changePos(1));
  dispatch(load(false));
  dispatch(load(true));
  unloadAudio();
  return; // if you want to free the sound
};
