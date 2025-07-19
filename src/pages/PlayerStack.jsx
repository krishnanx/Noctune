import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  Dimensions,
  Animated,
  TouchableWithoutFeedback,
  Button,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import { SkipBack, SkipForward } from "react-native-feather";
import Icon from "react-native-vector-icons/FontAwesome";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import {
  changePos,
  progress,
  setIsPlaying,
  load,
  isLoadedFromAsyncStorage,
  isplaying,
  setSearchedMusic
} from "../../Store/MusicSlice";
import { loadAudio, playRef, soundRef } from "../functions/MusicLoaders/music.js";
// import { addMusicinPlaylist } from "../../Store/PlaylistSlice";
// import MarqueeText from "react-native-marquee";
// import TextTicker from "react-native-text-ticker";
import Marquee from "../Components/Marquee";
import SleepTimerModal from "../Components/SleepTimerModal";
import TimerIcon from "../Components/Icons/TimerIcon.jsx";
import ThreeDots from "../Components/Icons/ThreeDots.jsx";
import ChevronForward from "../Components/Icons/ChevronForward";
import Replay from "../Components/Icons/Replay";
const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

import MediaNotificationManager from "../functions/MediaNotification";
import { showNotification } from "../functions/MediaNotification";
import { setPlaylistplaying } from "../../Store/PlaylistSlice";
import WaveformVisualizer from "../Components/WaveformVisualizer";

const PlayerStack = () => {
  const { colors } = useTheme();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [liked, setLiked] = useState(false);
  const [lastPress, setLastPress] = useState(0);
  const DOUBLE_PRESS_DELAY = 800;
  const [sleepTimerVisible, setSleepTimerVisible] = useState(false);
  const { isTimerActive } = useSelector((state) => state.sleepTimer);
  const { data: array, id, playlistNo } = useSelector((state) => state.playlist);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const lastPressRef = useRef(0);
  const singlePressTimeoutRef = useRef(null);
   const { data, pos, seek, isplaying, canLoad, isLoadedFromAsyncStorage, searchedMusic } =
      useSelector((state) => state.data);
  const { song, pos: position, seek: seekk, load: newLoad } = useSelector(
    (state) => state.playlistload
  );
  const currentTrack = canLoad ? data && pos >= 0 && pos < data.length ? data[pos] : null : newLoad? song && position >= 0 && position < song.length ? song[position] : null :
      !canLoad? data && pos >= 0 && pos < data.length ? data[pos] : null : song && position >= 0 && position < song.length ? song[position] : null

  //const mediaListenersInitialized = useRef(false);

  // useEffect(() => {
  //   if (currentTrack) {
  //     console.warn("Track changed, resetting notification state");
  //     // First hide any existing notification
  //     MediaNotificationManager.hideNotification().then(() => {
  //       // Short delay to ensure complete reset
  //       setTimeout(() => {
  //         MediaNotificationManager.showNotification(
  //           {
  //             title: currentTrack.title || "Unknown Title",
  //             artist:
  //               currentTrack.artist ||
  //               currentTrack.uploader ||
  //               "Unknown Artist",
  //             album: currentTrack.album || "",
  //             artwork: currentTrack.image || "",
  //           },
  //           {
  //             showNextPrev: data.length > 1, // Only show next/prev if we have multiple tracks
  //             showStop: true,
  //           }
  //         ).then(() => {
  //           MediaNotificationManager.updatePlaybackStatus(isplaying);
  //         });
  //       }, 100);
  //     });
  //   }
  // }, [currentTrack]);

  
  {
    /**If you ever want it even safer (rare), you can do [pos, data[pos]?.url]
    (so it depends on the exact song url changing).
    But in 99% cases, [pos, data.length] is enough for you. */
    //(pos, data.length), soundRef.current
  }
  useEffect(() => {
    console.log("sec:", seek);
    console.log("isPlaying?...:", isplaying);
  }, [seek, isplaying]);

  const togglePlayPauseRef = useRef(null);

  const togglePlayPause = async () => {
    if (!soundRef.current) {
      if (playRef.current) {
        if (isplaying) {
          console.warn("true->false")
          await playRef.current.pauseAsync();
          dispatch(progress(-1));
          dispatch(setIsPlaying(false));
          dispatch(setPlaylistplaying({ action: false, id: playlistNo }));
        } else {
          console.warn("false->true")
          await playRef.current.playAsync(); // resumes from last position
          dispatch(progress(-1));
          dispatch(setIsPlaying(true));
          dispatch(setPlaylistplaying({ action: true, id: playlistNo }));
        }
        
        
      }
    }
    else if (isplaying) {
      await soundRef.current.pauseAsync();
      dispatch(progress(-1));
      dispatch(setIsPlaying(false));
    } else {
      await soundRef.current.playAsync(); // resumes from last position
      dispatch(progress(-1));
      dispatch(setIsPlaying(true));
    }
    
  };

  const replaySound = async () => {
    
      if (soundRef.current) {
        await soundRef.current.setPositionAsync(0);
        dispatch(setIsPlaying(true))
        await soundRef.current.playAsync();
        
      }
      else if (playRef.current) {
        await playRef.current.setPositionAsync(0);
        dispatch(setPlaylistplaying({ action:true, id: playlistNo }))
        await playRef.current.playAsync();
        
      }
      dispatch(progress(0));
    
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const toggleModal = () => {
    setIsModalVisible((prev) => !prev);
  };


  const togglePlayerSize = () => {

    navigation.goBack();

  };


  let singlePressTimeout = null;

  const handlePress = async (value) => {
    const timeNow = Date.now();

    if (timeNow - lastPressRef.current < DOUBLE_PRESS_DELAY) {
      // Double press detected
      if (singlePressTimeoutRef.current) {
        clearTimeout(singlePressTimeoutRef.current);
        singlePressTimeoutRef.current = null;
      }
      console.warn("Double press detected!");
      if (soundRef.previous) {
        console.error("prev ref exsists")
        await soundRef.previous.playAsync()
      }
      else {
        
        dispatch(changePos(value));
        dispatch(setSearchedMusic(true))
        dispatch(load(false));
        dispatch(load(true));
        
      }
    } else {
      // Set timeout for single press
      singlePressTimeoutRef.current = setTimeout(async () => {
        console.warn("Single press detected");
        if(value == 1){
          dispatch(changePos(value));
          dispatch(setSearchedMusic(true))
          dispatch(load(false));
          dispatch(load(true));
        }
        else{
          dispatch(progress(0));
          if(soundRef.current){
            await soundRef.current.playFromPositionAsync(0);
          }
          else{
            await playRef.current.playFromPositionAsync(0)
          }
        }
        
      }, DOUBLE_PRESS_DELAY);
    }

    lastPressRef.current = timeNow;
  };

  const TOTAL_DURATION = data ? data[pos]?.duration : 0;

  useEffect(() => {
    togglePlayPauseRef.current = togglePlayPause;
    console.log("hola");
  }, [togglePlayPause]);

  useEffect(() => {
    let mediaListenersInitialized = false;
    if (!mediaListenersInitialized) {
      console.log("Setting up media notification listeners");


      MediaNotificationManager.registerPlayPauseHandler(() => {
        console.log("Play/Pause triggered from notification");
        if (togglePlayPauseRef.current) {
          togglePlayPauseRef.current();
        } else {
          console.warn("togglePlayPauseRef is not available");
        }
      });

      mediaListenersInitialized = true;
      return () => {
        console.log("Cleaning up media notification listeners");
        MediaNotificationManager.removeAllListeners();
        MediaNotificationManager.hideNotification();
      };
    }
  }, []);

  //Update notification when playback state changes
  useEffect(() => {
    MediaNotificationManager.updatePlaybackStatus(isplaying);
  }, [isplaying]);


  const styles = StyleSheet.create({
    Main: {
      backgroundColor: colors.background,
      width: "100%",
      alignItems: "center",
      justifyContent: "space-between",
      paddingBottom: 80,
      height: "100%",
    },
    miniPlayer: {
      flex: 1,
      position: "absolute",
      // bottom: 100,
      width: "95%",
      height: "7%",
      backgroundColor: "gray",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 7, // Inner space
      margin: 10, // Outer space
      borderRadius: 7,
      borderTopWidth: 1,
      borderTopColor: "rgba(255,255,255,0.1)",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 5,
      zIndex: 100,
    },
    miniPlayerInfo: {
      flexDirection: "row",
      alignItems: "center",
    },
    miniPlayerThumbnail: {
      width: 43,
      height: 43,
      borderRadius: 4,
      marginRight: 12,
      backgroundColor: "black", // keep for debug, remove later
    },

    miniPlayerTextContainer: {
      flex: 1,
    },
    miniPlayerTitle: {
      color: colors.text,
      fontSize: 14,
      fontWeight: "bold",
      marginBottom: 2,
      width: 180,
    },
    miniPlayerArtist: {
      color: colors.text,
      fontSize: 12,
    },
    miniPlayerControls: {
      flexDirection: "row",
      alignItems: "center",
    },
    progressBarContainer: {
      position: "absolute",
      bottom: 200,
      width: "90%",
      alignSelf: "center",
    },
    progressBarBackground: {
      width: "100%",
      height: 3,
      backgroundColor: colors.text,
      borderRadius: 2.5,
      overflow: "hidden",
    },
    progressBarFill: {
      height: 3,
      backgroundColor: colors.text ?? colors.primary,
    },
    miniProgressBar: {
      position: "absolute",
      top: 54,
      left: 7,
      right: 3,
      height: 3,
      zIndex: 10,
    },
    miniProgressBarFill: {
      height: 2,
      backgroundColor: colors.text,
      borderRadius: 3,
    },
    timeContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 5,
    },
    timeText: {
      fontSize: 12,
      color: colors.text,
    },
    controlsContainer: {
      width: "100%",
      height: 100,
      flexDirection: "row",
      alignItems: "center",
    },
    controls: {
      width: "100%",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-around",
      paddingHorizontal: 10,
    },
    playPauseButton: {
      width: 70,
      // position: "absolute",
      height: 70,
      // top: 50,
      borderRadius: 35,
      backgroundColor: colors.text,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 4.65,
      elevation: 8,
    },
    playpause: {
      flexDirection: "row",
      alignItems: "center",
    },
    miniPlayPauseButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.text,
      justifyContent: "center",
      alignItems: "center",
      marginHorizontal: 8,
      position: "absolute",
      right: 0,
    },
    triangle: {
      width: 0,
      height: 0,
      backgroundColor: "transparent",
      borderStyle: "solid",
      borderLeftWidth: 18,
      borderRightWidth: 0,
      borderBottomWidth: 12,
      borderTopWidth: 12,
      borderLeftColor: "black",
      borderTopColor: "transparent",
      borderBottomColor: "transparent",
      borderRightColor: "transparent",
      marginLeft: 4,
    },
    miniTriangle: {
      width: 0,
      height: 0,

      backgroundColor: "transparent",
      borderStyle: "solid",
      borderLeftWidth: 10,
      borderRightWidth: 0,
      borderBottomWidth: 7,
      borderTopWidth: 7,
      borderLeftColor: "black",
      borderTopColor: "transparent",
      borderBottomColor: "transparent",
      borderRightColor: "transparent",
      marginLeft: 2,
    },
    pauseLinesContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },
    pauseLine: {
      width: 4,
      height: 20,
      backgroundColor: "black",
      marginHorizontal: 4,
      borderRadius: 2,
    },
    miniPauseLine: {
      width: 3,
      height: 12,
      backgroundColor: "black",
      marginHorizontal: 2,
      borderRadius: 1,
    },
    skipButton: { /*top: 65,*/ marginHorizontal: 20 },
    container: {
      position: "absolute",
      top: 490,
      left: 25,
      alignItems: "left",
      flexDirection: "row",
      height: 90,
      alignItems: "center",
    },
    songName: {
      fontSize: 18,
      top: 20,
      fontWeight: "bold",
      color: "white",
    },
    progressBarTouchArea: {
      height: 30, // Increased height for better touch target
      justifyContent: "flex-end",
    },
    singerName: {
      position: "relative",
      top: 20,
      fontSize: 18,
      fontWeight: "300",
      color: "gray",
      marginTop: 2,
    },
    albumArt: {
      position: "absolute",
      top: 120,
      width: 340,
      height: 340,
      borderRadius: 20,
      marginBottom: 20,
      backgroundColor: "gray",
    },
    heartIcon: {
      position: "absolute",
      top: 510,
      left: 140,
    },
    modalOverlay: {
      flex: 1,
      justifyContent: "flex-end",
      //backgroundColor: "rgba(98, 92, 92, 0.5)", // backdrop blur
    },
    modalContent: {
      height: "60%", // half the screen
      backgroundColor: colors.text,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: 25,
      backgroundColor: "rgba(0,0,0,0.8)",
      gap: 15,
    },
    option: {
      fontSize: 18,
      marginVertical: 10,
      color: colors.text,
    },
    optionTouch: {
      width: "100%",
    },
    optionTouch: {
      width: "100%",
    },
    button: {
      padding: 6,
      // position: "absolute",
      // top: 35,
      // left: 30,
      // zIndex: 10,
    },
    sleepTimerButton: {
      flexDirection: "row",
      alignItems: "center",
      padding: 10,
    },
    sleepTimerText: {
      marginLeft: 8,
      fontSize: 16,
      color: "#888",
    },
    activeTimerText: {
      color: "#4f8ef7",
      fontWeight: "500",
    },
  });

  // Render the full player
  return (
    <Animated.View
      style={{
        position: "absolute",
        bottom: 0,
        width: "100%",
        height: windowHeight,
        // transform: [{ translateY: slideY }],
        backgroundColor: "white", // or your styling
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        overflow: "hidden",
      }}
    >
      <View style={styles.Main}>
        <View
          style={{
            paddingHorizontal: 20,
            paddingTop: 20,
            width: "100%",
            flexDirection: "row",
            height: 60,
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            style={[
              styles.button,
              {
                transform: [{ rotate: "90deg" }],
                justifyContent: "center",
                alignItems: "center",
              },
            ]}
            onPress={togglePlayerSize}
          >
            <ChevronForward width={28} height={28} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => toggleModal()}>
            <ThreeDots height={28} width={28} />
          </TouchableOpacity>
        </View>

        <WaveformVisualizer ytUrl={currentTrack?.url}/>

        <Metadata
          data={
            canLoad ? data && data[pos]
              ? data[pos]
              : { title: "Unknown Song", uploader: "Unknown Artist" } : song && song[position] ? song[position] : { title: "Unknown Song", uploader: "Unknown Artist" }
          }
          colors={colors}
          liked={liked}
          setLiked={setLiked}
          seek={seek}
          TOTAL_DURATION={TOTAL_DURATION}
          formatTime={formatTime}
          styles={styles}
          dispatch={dispatch}
        />

        <SleepTimerModal
          visible={sleepTimerVisible}
          onClose={() => setSleepTimerVisible(false)}
          soundRef={soundRef}
        />

        <Controls
          togglePlayPause={togglePlayPause}
          isPlaying={isplaying}
          styles={styles}
          colors={colors}
          dispatch={dispatch}
          changePos={changePos}
          handlePress={handlePress}
          Replay={Replay}
          TimerIcon={TimerIcon}
          replaySound={replaySound}
          setSleepTimerVisible={setSleepTimerVisible}
          isTimerActive={isTimerActive}
        />

        <Custom_modal
          data={
            canLoad ? data && data[pos]
              ? data[pos]
              : { title: "Unknown Song", uploader: "Unknown Artist" } : song && song[position] ? song[position] : { title: "Unknown Song", uploader: "Unknown Artist" }
          }
          isModalVisible={isModalVisible}
          styles={styles}
          toggleModal={toggleModal}
          navigation={navigation}
        />
      </View>
    </Animated.View>
  );
};

export default PlayerStack;

const Metadata = ({
  data,
  colors,
  liked,
  setLiked,
  seek,
  TOTAL_DURATION,
  formatTime,
  styles,
  dispatch,
}) => {
  // Add state for tracking drag operation
  const [isDragging, setIsDragging] = useState(false);
  const [userSeek, setUserSeek] = useState(seek);
  const [userSetPosition, setUserSetPosition] = useState(false);

  useEffect(() => {
    if (!isDragging && (!userSetPosition || Math.abs(seek - userSeek) > 5)) {
      setUserSeek(seek);
    }
  }, [seek, isDragging, userSetPosition]);


  return (
    <>
      <Image source={{ uri: data?.image }} style={styles.albumArt} />

      <View style={styles.container}>
        <View style={{ height: "100%" }}>
          <View style={{ width: 300 }}>
            <Text style={styles.songName}>{data?.title || "Unknown Song"}</Text>
          </View>
          <Text style={styles.singerName}>
            {data?.uploader || data?.artist || "Unknown Artist"}
          </Text>
        </View>
        <TouchableOpacity onPress={() => setLiked(!liked)}>
          <Icon
            name={liked ? "heart" : "heart-o"}
            size={28}
            color={liked ? colors.text : "gray"}
          />
        </TouchableOpacity>
      </View>
    </>
  );
};

const Controls = ({
  togglePlayPause,
  isPlaying,
  styles,
  colors,
  dispatch,
  changePos,
  handlePress,
  replaySound,
  TimerIcon,
  Replay,
  setSleepTimerVisible,
  isTimerActive,
}) => {
  return (
    <View style={styles.controlsContainer}>
      <View style={styles.controls}>
        <View>
          <TouchableOpacity onPress={() => setSleepTimerVisible(true)}>
            <TimerIcon
              name="timer"
              color={isTimerActive ? "#F5DEB3" : colors.text}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.playpause}>
          <TouchableOpacity
            style={styles.skipButton}
            onPress={() => {
              handlePress(-1);
            }}
          >
            <SkipBack width={35} height={35} stroke={colors.text} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.playPauseButton}
            onPress={() => togglePlayPause()}
          >
            {isPlaying ? (
              <View style={styles.pauseLinesContainer}>
                <View style={styles.pauseLine} />
                <View style={styles.pauseLine} />
              </View>
            ) : (
              <View style={styles.triangle} />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.skipButton}
            onPress={() => {
              handlePress(+1);
            }}
          >
            <SkipForward width={35} height={35} stroke={colors.text} />
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity onPress={() => replaySound()}>
            <Replay height={24} width={24} fill={colors.text} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const Custom_modal = ({
  data,
  isModalVisible,
  styles,
  toggleModal,
  dispatch,
  navigation,
}) => {
  // The data prop already contains the correct current track data
  // that's being passed from PlayerStack, so we can use it directly

  return (
    <Modal
      transparent
      visible={isModalVisible}
      animationType="slide"
      onRequestClose={() => toggleModal()}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPressOut={() => toggleModal()}
      >
        <View style={styles.modalContent}>
          <View style={[styles.miniPlayerInfo, { marginBottom: 30 }]}>
            <Image
              source={{ uri: data?.image ?? null }}
              style={styles.miniPlayerThumbnail}
            />
            <View style={styles.miniPlayerTextContainer}>
              <Text style={styles.miniPlayerTitle} numberOfLines={1}>
                {data?.title || "Unknown Title"}
              </Text>
              <Text style={styles.miniPlayerArtist} numberOfLines={1}>
                {data?.uploader || data?.artist || "Unknown Artist"}
              </Text>
            </View>
          </View>

          <TouchableOpacity style={styles.optionTouch}>
            <Text style={styles.option}>Add to Liked Songs</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionTouch}
            onPress={() => {
              toggleModal();
              navigation.navigate("Playchoose", { index: data });
            }}
          >
            <Text style={styles.option}>Add to playlist</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionTouch}>
            <Text style={styles.option}>Media Quality</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionTouch}>
            <Text style={styles.option}>Share</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionTouch}
          // onPress={() => {
          //   toggleModal();
          //   dispatch({ type: "ADD_TO_QUEUE", payload: data });
          // }}
          >
            <Text style={styles.option}>Add to Queue</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};