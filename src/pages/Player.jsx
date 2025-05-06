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
} from "react-native";
import { useTheme } from "@react-navigation/native";
import { SkipBack, SkipForward } from "react-native-feather";
import Icon from "react-native-vector-icons/FontAwesome";
import { MaterialIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import {
  changePos,
  progress,
  setIsPlaying,
  load, setAnimationTargetY,
  toggleMinimized,
} from "../../Store/MusicSlice";
import { loadAudio, soundRef } from "../functions/music";
import { addMusicinPlaylist } from "../../Store/PlaylistSlice";
import MarqueeText from "react-native-marquee";
import TextTicker from "react-native-text-ticker";
import Marquee from "../Components/Marquee";
import SleepTimerModal from "../Components/SleepTimerModal";
import TimerIcon from "../Components/TimerIcon";
import ThreeDots from "../Components/ThreeDots";
import ChevronForward from "../Components/Icons/ChevronForward";
import Replay from "../Components/Icons/Replay";
const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

const Player = () => {
  const { colors } = useTheme();

  //const [isPlaying, setIsPlaying] = useState(false);
  const [progressSeconds, setProgressSeconds] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [liked, setLiked] = useState(false);
  const [lastPress, setLastPress] = useState(0);
  const DOUBLE_PRESS_DELAY = 800;
  // const [audioUrl, setAudioUrl] = useState("");

  const slideY = useRef(new Animated.Value(windowHeight)).current; // initially hidden (off-screen)
  const [sleepTimerVisible, setSleepTimerVisible] = useState(false);
  const { isTimerActive } = useSelector((state) => state.sleepTimer);

  const dispatch = useDispatch();
  const navigation = useNavigation();
  const animatedHeight = useRef(new Animated.Value(windowHeight)).current;
  const animatedWidth = useRef(new Animated.Value(windowWidth)).current;
  const { data, pos, seek, isplaying, isMinimized, animationTargetY } =
    useSelector((state) => state.data);
  // const audioUrl = useSelector((state) => state.data.Url);
  // console.log("Current URL state:", audioUrl);

  // useEffect(() => {
  //   if (data) {
  //     setAudioUrl(data.url); // Assuming the data object contains a field `url` with the audio URL
  //   }
  // }, [data]);

  // const streamUrl =
  //   typeof Constants.expoConfig.extra.SERVER !== "undefined"
  //     ? `${
  //         Constants.expoConfig.extra.SERVER
  //       }/api/stream?url=${encodeURIComponent(audioUrl)}`
  //     : audioUrl; // fallback to direct URL if SERVER is undefined

  // useEffect(() => {
  //   if (data[pos]) {
  //     console.log("data:", data[pos]);
  //     loadAudio();
  //   }

  //   return () => {
  //     console.log("Cleanup");
  //     unloadAudio()
  //   };
  // }, [pos]);

  //-------------------------------
  //added
  // useEffect(() => {
  //   // Set up music control when component mounts
  //   try {
  //     setupMusicControl();
  //   } catch (error) {
  //     console.error("Error setting up music control:", error);
  //   }

  //   return () => {
  //     try {
  //       // Clean up on unmount
  //       MusicControl.stopControl();
  //     } catch (error) {
  //       console.error("Error stopping music control:", error);
  //     }
  //   };
  // }, []);
  //----------------------------------------
  useEffect(() => {
    const autoPlayIfUserSearched = async () => {
      if (!soundRef.current) return;

      if (!isLoadedFromAsyncStorage && data[pos]) {
        try {
          await soundRef.current.playAsync();
          dispatch(setIsPlaying(true));
        } catch (error) {
          console.error("Error auto-playing after search", error);
        }
      } else {
        console.log(
          "Song loaded from AsyncStorage or no valid song, skipping auto-play"
        );
      }
    };

    autoPlayIfUserSearched();
    {
      /**If you ever want it even safer (rare), you can do [pos, data[pos]?.url]
      (so it depends on the exact song url changing).
      But in 99% cases, [pos, data.length] is enough for you. */
    }
  }, [(pos, data.length)]);

  useEffect(() => {
    console.log("sec:", seek);
    console.log("isPlaying?...:", isplaying);
  }, [seek, isplaying]);

  //---------------------------------------------------------
  // useEffect to update notification metadata when track changes
  // useEffect(() => {
  //   if (data && data[pos]) {
  //     updateNotificationMetaData(data[pos]);
  //   }
  // }, [data, pos]);

  // //useEffect to update playback state
  // useEffect(() => {
  //   if (data && data[pos]) {
  //     updatePlaybackState(isplaying, seek);
  //   }
  // }, [isplaying, seek]);

  //------------------------------------------------------

  const togglePlayPause = async () => {
    if (!soundRef.current) return;

    if (isplaying) {
      await soundRef.current.pauseAsync();
      dispatch(progress(-1));
      //updatePlaybackState(false, seek); //added
    } else {
      await soundRef.current.playAsync(); // resumes from last position
      dispatch(progress(-1));
      //updatePlaybackState(true, seek); //added
    }
    dispatch(setIsPlaying("toggle"));
  };

  const replaySound = async () => {
    if (isplaying) {
      await soundRef.current.setPositionAsync(0);
      await soundRef.current.playAsync();
      dispatch(progress(0));
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const toggleModal = () => {
    setIsModalVisible((prev) => !prev);
  };

  // Respond to changes in animationTargetY
  useEffect(() => {
    Animated.timing(slideY, {
      toValue: animationTargetY,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      // Optionally dispatch after animation
      if (animationTargetY === windowHeight) {
        dispatch(toggleMinimized()); // Set state to minimized after hiding
      }
    });
  }, [animationTargetY]);

  const togglePlayerSize = () => {
    if (isMinimized) {
      dispatch(toggleMinimized()); // First expand the component
      dispatch(setAnimationTargetY(0)); // Animate to visible
    } else {
      dispatch(setAnimationTargetY(windowHeight)); // Animate to bottom
    }
  };

  const handlePress = async (value) => {
    const timeNow = Date.now();
    if (timeNow - lastPress < DOUBLE_PRESS_DELAY) {
      // Double press detected
      console.log("Double press detected!");
      dispatch(setIsPlaying(false));
      dispatch(changePos(value));
      dispatch(load(false));
      dispatch(load(true));
      // Action for double press
    } else {
      // Regular single press action
      console.log("Single press detected");
      console.log("hi");
      dispatch(progress(0));
      await soundRef.current.playFromPositionAsync(0);
      // Action for single press
    }
    setLastPress(timeNow);
  };
  const TOTAL_DURATION = data ? data[pos]?.duration : 0;

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
      borderRadius: 1.5,
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
      paddingHorizontal: 10
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
      alignItems: "center"
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
      alignItems: "center"
    },
    songName: {
      fontSize: 18,
      top: 20,
      fontWeight: "bold",
      color: "white",
    },
    singerName: {
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
    }, //added
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

  // Render the mini player if minimized
  if (isMinimized) {
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
          {/* Apply TouchableWithoutFeedback only to the mini player */}
          <TouchableWithoutFeedback onPress={togglePlayerSize}>
            <View style={styles.miniPlayer} activeOpacity={0.9}>
              <View style={styles.miniPlayerInfo}>
                <Image
                  source={{ uri: data ? data[pos]?.image : null }}
                  style={styles.miniPlayerThumbnail}
                />
                <View style={styles.miniPlayerTextContainer}>
                  <Marquee
                    text={
                      data
                        ? data[pos]?.title + "             "
                        : "Unknown Title"
                    }
                  />
                  <Text style={styles.miniPlayerArtist} numberOfLines={1}>
                    {data ? data[pos]?.uploader : "Unknown Artist"}
                  </Text>
                </View>
              </View>

              <View style={styles.miniPlayerControls}>
                <TouchableOpacity
                  onPress={togglePlayPause}
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
  }

  // Render the full player
  return (
    <Animated.View
      style={{
        position: "absolute",
        bottom: 0,
        width: "100%",
        height: windowHeight,
        transform: [{ translateY: slideY }],
        backgroundColor: "white", // or your styling
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        overflow: "hidden",
      }}
    >
      <View style={styles.Main}>
        <View
          style={{ paddingHorizontal: 20, paddingTop: 20, width: "100%", flexDirection: "row", height: 60, justifyContent: "space-between", alignItems: "center" }}
        >
          <TouchableOpacity style={[styles.button, { transform: [{ rotate: "90deg" }], justifyContent: "center", alignItems: "center" }]} onPress={togglePlayerSize}>
            <ChevronForward width={28} height={28} />
          </TouchableOpacity>
          <TouchableWithoutFeedback onPress={toggleModal}>
            <ThreeDots height={28} width={28} />
          </TouchableWithoutFeedback>
        </View>



        <Metadata
          data={
            data && data[pos]
              ? data[pos]
              : { title: "Unknown Song", uploader: "Unknown Artist" }
          }
          colors={colors}
          liked={liked}
          setLiked={setLiked}
          progressPercent={TOTAL_DURATION ? (seek / TOTAL_DURATION) * 100 : 0}
          seek={seek}
          TOTAL_DURATION={TOTAL_DURATION}
          formatTime={formatTime}
          styles={styles}
        />
        {/* <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            bottom: 50,
            width: "100%",
            gap: 300,
          }}
        >
          <TouchableOpacity onPress={() => setSleepTimerVisible(true)}>
            <TimerIcon
              name="timer"
              color={isTimerActive ? "#F5DEB3" : colors.text}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={replaySound}>
            <Replay height={24} width={24} />
          </TouchableOpacity>
        </View> */}

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
          isModalVisible={isModalVisible}
          styles={styles}
          toggleModal={toggleModal}
          navigation={navigation}
        />
      </View>
    </Animated.View>
  );
};

export default Player;

const Metadata = ({
  data,
  colors,
  liked,
  setLiked,
  progressPercent,
  seek,
  TOTAL_DURATION,
  formatTime,
  styles,
}) => (
  <>
    <Image source={{ uri: data?.image }} style={styles.albumArt} />

    <View style={styles.container}>
      <View
        style={{ height: "100%" }}
      >
        <View style={{ width: 300 }}>
          <Text style={styles.songName}>{data?.title || "Unknown Song"}</Text>
        </View>
        <Text style={styles.singerName}>
          {data?.uploader || "Unknown Artist"}
        </Text>
      </View>
      <TouchableOpacity onPress={() => setLiked(!liked)}>
        <Icon
          name={liked ? "heart" : "heart-o"}
          size={28}
          color={liked ? colors.text : "gray"}
        //style={styles.heartIcon}
        />
      </TouchableOpacity>
    </View>



    <View style={styles.progressBarContainer}>
      <View style={styles.progressBarBackground}>
        <View
          style={[
            styles.progressBarFill,
            { width: `${progressPercent}%`, backgroundColor: "green" },
          ]}
        />
      </View>
      <View style={styles.timeContainer}>
        <Text style={styles.timeText}>{formatTime(seek)}</Text>
        <Text style={styles.timeText}>{formatTime(TOTAL_DURATION)}</Text>
      </View>
    </View>
  </>
);

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
  isTimerActive
}) => {
  return (
    <View style={styles.controlsContainer}>
      <View
        style={styles.controls}
      >
        <View>
          <TouchableOpacity onPress={() => setSleepTimerVisible(true)}>
            <TimerIcon
              name="timer"
              color={isTimerActive ? "#F5DEB3" : colors.text}
            />
          </TouchableOpacity>
        </View>
        <View
          style={styles.playpause}
        >
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
  isModalVisible,
  styles,
  toggleModal,
  dispatch,
  navigation,
}) => {
  const { data, pos } = useSelector((state) => state.data);

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
              source={{ uri: data ? data[pos]?.image : null }}
              style={styles.miniPlayerThumbnail}
            />
            <View style={styles.miniPlayerTextContainer}>
              <Text style={styles.miniPlayerTitle} numberOfLines={1}>
                {data ? data[pos]?.title : "Unknown Title"}
              </Text>
              <Text style={styles.miniPlayerArtist} numberOfLines={1}>
                {data ? data[pos]?.uploader : "Unknown Artist"}
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
              navigation.navigate("Playchoose", { index: pos });
              // dispatch(addMusicinPlaylist({ id: 0, music: data[pos] }));
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
        </View>
      </TouchableOpacity>
    </Modal>
  );
};
