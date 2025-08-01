import { Audio } from "expo-av";
import { useSelector } from "react-redux";
import Constants from "expo-constants";
import { progress } from "../../../Store/MusicSlice.js";
import { useDispatch } from "react-redux";
import { setIsPlaying, load, changePos,seek } from "../../../Store/MusicSlice.js";
import { setPlaylistplaying } from "../../../Store/PlaylistSlice.js";
import { current } from "@reduxjs/toolkit";
import eventBus from '../eventBus.js';
import { changeLoad, changePlaylistPos } from "../../../Store/Playdataslice.js";
import { sendSongFinishedNotification } from "../../functions/LocalNotification.js"
let currentLoadToken = null;
export const soundRef = {
  previous: null,
  current: null,
  next: null
};
export const playRef = {
  current: null
}
export const loadAudio = async (
  data,
  pos,
  dispatch,
  getSeek,
  isLoadedFromAsyncStorage,
  queueLoad,
  playLoad,
  playlistNo = -1
) => {
  //console.warn("song url", data[pos].url);

  try {
    const thisToken = Symbol("loadToken");
    currentLoadToken = thisToken;
    if (!data[pos]) {
      throw new Error("Data at the given position is undefined or invalid.");
    }
    //http://192.168.1.44
    //Constants.expoConfig.extra.SERVER

    //const audioUri = `http://192.168.1.7:8000/api/stream?url=${encodeURIComponent(data[pos].url)}`;

    // const audioUri = `${Constants.expoConfig.extra.SERVER}/api/stream?url=${encodeURIComponent(data[pos].url)}`
    const audioUri = `http://192.168.1.107:3000/api/stream?url=${encodeURIComponent(data[pos].url)}`
    console.warn("Audio URI:", audioUri); // Check if the URL is correct
    dispatch(progress(0));
    if (soundRef.current) {
      // soundRef.previous = soundRef.current;
      //console.error("newwwwww")
      //console.warn("...")
      await soundRef.current.pauseAsync();
      await soundRef.current.unloadAsync();
      soundRef.current = null;
    }
    if (playRef.current) {
      await playRef.current.pauseAsync()
      await playRef.current.unloadAsync();
      playRef.current = null;
    }
    //console.warn("i am here before dispatch");
    dispatch(progress(0));
    //console.warn("i am here after dispatch");
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
    if (currentLoadToken !== thisToken) {
      console.warn("Stale load, cancelling...");
      await sound.unloadAsync();
      return;
    }

    //console.warn(queueLoad, playLoad)
    if (queueLoad) {
      soundRef.current = sound;
      playRef.current = null
      //console.warn("Audio Loaded");
      // Wherever you set the sound
      eventBus.emit("soundChanged", soundRef.current);

    }
    if (playLoad) {
      playRef.current = sound
      soundRef.current = null
      //console.warn("Audio Loaded from playref")
      playRef.current.playAsync()
    }
    sound.setOnPlaybackStatusUpdate((status) => {
      onPlaybackStatusUpdate(status, dispatch, getSeek, data, pos, playlistNo,queueLoad,playLoad);
    });



    // if (!isLoadedFromAsyncStorage) {
    //   await soundRef.current.playAsync();
    //   dispatch(setIsPlaying(true));
    // }
  } catch (error) {
    console.error("Error loading audio:", error);

  }
};

export const unloadAudio = async () => {
  if (soundRef.current) {
    await soundRef.current.unloadAsync();
    soundRef.current = null;
  }
  if (playRef.current) {
    await playRef.current.unloadAsync();
    playRef.current = null;
  }
};
const onPlaybackStatusUpdate = (status, dispatch, getSeek, data, pos, playlistNo,queueLoad,playLoad) => {
  ////console.error("STATUS:",status)
  if (status.didJustFinish) {
    const currentSeek = getSeek?.();
    //console.warn("finished......")
    //console.warn("Sned");
    sendSongFinishedNotification("Lover - Taylor Swift");
    
    if(currentSeek != data[pos]?.duration && currentSeek != 0) {
    //console.warn("finishing up!!");
    dispatch(progress(data[pos]?.duration))
  }
      
    tailFill(data,pos,data[pos]?.duration, dispatch, true,queueLoad,playLoad,currentSeek,playlistNo);
      
    
  }
  if (status.isLoaded) {
    ////console.warn("hi?");
    ////console.warn("positionMillis:", status.positionMillis / 1000);
    if (status.isPlaying) {
      dispatch(progress(+1));
    }
    if(status.durationMillis == status.positionMillis){

    }


  } else if (status.error) {
    //console.warn(`Playback error:" ${status.error}`);
  }
};

const tailFill = async (data,pos,currentSec, dispatch, skipToNext,queueLoad,playLoad,currentSeek,playlistNo) => {
  //console.error("came inside")
  //console.error("0",skipToNext)
  
  //console.error("1:",skipToNext)
  const stop = await checkNext(pos, data, dispatch, playlistNo)
  if(stop){
    //console.error("byeee")
    return
  }
  //console.error(":",skipToNext)
  
  if (skipToNext) {
    //console.error("skip next is true")
    if (queueLoad) {
      //console.error("NEXT queue")
      dispatch(changePos(1));
      dispatch(load(false));
      setTimeout(() => {
        dispatch(load(true))
      }, 1)
    }
    if (playLoad) {
      //console.error("NEXT playlist song")
       dispatch(changePlaylistPos({value:1,jump:-1}));
      dispatch(changeLoad(false))
      setTimeout(() => {
        dispatch(changeLoad(true))
      }, 1)
      
    }
    unloadAudio();
  }

  return;
};

const checkNext = async(pos, data, dispatch, playlistNo) => {
  //console.warn("pos:", pos)
  //console.warn("data length", data.length)
  if (pos + 1 >= data.length) {
    if (soundRef.current) {
      //console.warn("pausing player")
      // await soundRef.current.pauseAsync();
      // await soundRef.current.unloadAsync();
      //soundRef.current = null;
      dispatch(setIsPlaying(false))
      await soundRef.current.setStatusAsync({ shouldPlay: false });
      await soundRef.current.setPositionAsync(0)
    }
    if (playRef.current && playlistNo != -1) {
      //console.warn("pausing playlist")
      // await playRef.current.pauseAsync();
      // await playRef.current.unloadAsync();
      // playRef.current = null;
      dispatch(setPlaylistplaying({ action: false, id: playlistNo }));
      dispatch(setIsPlaying(false))
      await playRef.current.setStatusAsync({ shouldPlay: false });
      await playRef.current.setPositionAsync(0)
    }
    dispatch(progress(0))
    return true
  }
  else{
    return false
  }
}