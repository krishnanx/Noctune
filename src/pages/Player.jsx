// THIS IS MINIPLAYER
import React, { useEffect, useRef,useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import {
  changePos,
  progress,
  setIsPlaying,
  load,
  setSearchedMusic,
} from "../../Store/MusicSlice";
import { playRef, soundRef } from "../../App.jsx";
// import { addMusicinPlaylist } from "../../Store/PlaylistSlice";
// import MarqueeText from "react-native-marquee";
// import TextTicker from "react-native-text-ticker";
import Marquee from "../Components/Marquee";
import eventBus from '../functions/eventBus.js';
import MediaNotificationManager from "../functions/MediaNotification";
import { showNotification } from "../functions/MediaNotification";
import { setPlaylistplaying } from "../../Store/PlaylistSlice";
import NotificationSync from "../functions/NotificationSync.js";
import TrackPlayer,{state,usePlaybackState} from "react-native-track-player";

const Player = () => {
  const { colors } = useTheme();
  const { data: array, id, playlistNo } = useSelector((state) => state.playlist);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const { data, pos, seek, isplaying, canLoad, isLoadedFromAsyncStorage, searchedMusic } =
    useSelector((state) => state.data);
  const { song, pos: position, seek: seekk, load } = useSelector(
    (state) => state.playlistload
  );
  
  const togglePlayPauseRef = useRef(null);
  const playbackState = usePlaybackState();
  const [currentTrack, setCurrentTrack] = useState(null);

  const getCurrentTrackInfo = async () => {
    try {
      const track = await TrackPlayer.getActiveTrack(); 
      if (track) {
        setCurrentTrack(track); // store track in state
      } else {
        setCurrentTrack(null);
      }
    } catch (error) {
      console.error("Error getting current track info:", error);
      setCurrentTrack(null);
    }
  };

  useEffect(() => {
    getCurrentTrackInfo();

    // optional: update when track changes
    const listener = TrackPlayer.addEventListener("playback-track-changed", async () => {
      await getCurrentTrackInfo();
    });

    return () => {
      listener.remove();
    };
  }, []);
  
  const changePlayPause = async () => {
    if (!soundRef.current) {
      //console.warn("sound ref is null")
      //console.warn(soundRef.current)
      if (playRef.current) {
        if (isplaying) {
          //console.error("secomd")
          await playRef.current.pauseAsync();
          dispatch(progress(-1));
        } else {
          await playRef.current.playAsync(); // resumes from last position
          dispatch(progress(-1));
          //console.error("second")
        }
        dispatch(setIsPlaying("toggle"));
        dispatch(setPlaylistplaying({ action: "toggle", id: playlistNo }));
      }
    }
    else if (isplaying) {
      //console.warn("paused")
      await soundRef.current.pauseAsync();
      dispatch(progress(-1));
      dispatch(setIsPlaying(false));
    } else {
      //console.warn("resumed")
      await soundRef.current.playAsync(); // resumes from last position
      dispatch(progress(-1));
      dispatch(setIsPlaying(true));
    }
    
  };

  const togglePlayerSize = () => {

    navigation.navigate('PlayerStack');
  };

  const TOTAL_DURATION = canLoad? data ? data[pos]?.duration : 0 : song ? song[position]?.duration : 0

  useEffect(() => {
    togglePlayPauseRef.current = changePlayPause;
    console.log("hola");
  }, [changePlayPause]);

  useEffect(() => {
    let mediaListenersInitialized = false;
    if (!mediaListenersInitialized) {
      console.log("Setting up media notification listeners");


      MediaNotificationManager.registerPlayPauseHandler(() => {
        console.log("Play/Pause triggered from notification");
        if (togglePlayPauseRef.current) {
          togglePlayPauseRef.current();
        } else {
          //console.warn("togglePlayPauseRef is not available");
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
    MediaNotificationManager.updatePlaybackStatus(isplaying,seek);
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
      height:50,
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
      color: "white",
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
      backgroundColor: "black",
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
      backgroundColor: "white",
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
      backgroundColor: colors.background,
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
      backgroundColor: "rgba(98, 92, 92, 0.5)", // backdrop blur
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
  return (
    // Remove the TouchableWithoutFeedback wrapping the entire view
    <View
      style={[
        StyleSheet.absoluteFill,
        {
          justifyContent: "flex-end",
          marginBottom: 55,
          alignItems: "center",
        },
      ]}
      pointerEvents="box-none"
    >
      <View
        style={{
          position: "static",
          // /top: "10%",
          justifyContent: "flex-end",
          backgroundColor: "pink",
          width: "100%",
          zIndex: 0,
        }}
      >
        <NotificationSync/>
        {/* Apply TouchableWithoutFeedback only to the mini player */}
        <TouchableWithoutFeedback onPress={togglePlayerSize}>
          <View style={styles.miniPlayer} activeOpacity={0.9}>
            <View style={styles.miniPlayerInfo}>
              <Image
                source={{ uri: currentTrack?.artwork || null }}
                style={styles.miniPlayerThumbnail}
              />
              <View style={styles.miniPlayerTextContainer}>
                <Marquee
                  text={
                    (currentTrack?.title || "Unknown Title") + "             "
                  }
                />

                <Text style={styles.miniPlayerArtist} numberOfLines={1}>
                  {currentTrack?.uploader || currentTrack?.artist || "Unknown Artist"}
                </Text>
              </View>
            </View>

            <View style={styles.miniPlayerControls}>
              <TouchableOpacity
                onPress={changePlayPause}
                style={styles.miniPlayPauseButton}
              >
                {isplaying ? (
                  <View style={styles.pauseLinesContainer}>
                    <View style={styles.miniPauseLine} />
                    <View style={styles.miniPauseLine} />
                  </View>
                ) : (
                  <View style={styles.miniTriangle} />
                )}
              </TouchableOpacity>
            </View>

            {/* Mini progress bar */}
            <View style={styles.miniProgressBar}>
              <View
                style={[
                  styles.miniProgressBarFill,
                  {
                    width: `${TOTAL_DURATION ? (seek / TOTAL_DURATION) * 100 : 0
                      }%`,
                  },
                ]}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
};

export default Player;