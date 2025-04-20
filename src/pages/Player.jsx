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
import { changePos ,progress,setIsPlaying,load} from "../../Store/MusicSlice";
import { loadAudio, soundRef } from "../functions/music";

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

  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [isMinimized, setIsMinimized] = useState(false);
  const animatedHeight = useRef(new Animated.Value(windowHeight)).current;
  const animatedWidth = useRef(new Animated.Value(windowWidth)).current;
  const { data, pos, seek, isplaying } = useSelector((state) => state.data);
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

  useEffect(() => {
    console.log("sec:", seek);
    console.log("isPlaying?...:", isplaying);
  }, [seek, isplaying]);

  const togglePlayPause = async () => {
    if (!soundRef.current) return;

    if (isplaying) {
      await soundRef.current.pauseAsync();
      dispatch(progress(-1));
    } else {
      await soundRef.current.playAsync(); // resumes from last position
      dispatch(progress(-1));
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

  const togglePlayerSize = () => {
    // Toggle the minimized state
    setIsMinimized(!isMinimized);

    // Animate the height and width change
    Animated.parallel([
      Animated.timing(animatedHeight, {
        toValue: isMinimized ? windowHeight : 70,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(animatedWidth, {
        toValue: isMinimized ? windowWidth : windowWidth,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start(() => {
      // Animation completed
      setIsMinimized(!isMinimized);
    });
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
      top: "690",
      width: windowWidth,
      height: "9%",
      backgroundColor: colors.background,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
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
      flex: 1,
    },
    miniPlayerThumbnail: {
      width: 50,
      height: 50,
      borderRadius: 4,
      marginRight: 12,
      zIndex: 10,
      resizeMode: "cover", // this helps!
      backgroundColor: "red", // keep for debug, remove later
    },

    miniPlayerTextContainer: {
      flex: 1,
    },
    miniPlayerTitle: {
      color: "white",
      fontSize: 14,
      fontWeight: "bold",
      marginBottom: 2,
    },
    miniPlayerArtist: {
      color: "gray",
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
      top: 80,
      left: 0,
      right: 0,
      height: 2,
      zIndex: 10,
    },
    miniProgressBarFill: {
      height: 2,
      backgroundColor: "green",
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
      position: "absolute",
      top: 600,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    playPauseButton: {
      width: 70,
      position: "absolute",
      height: 70,
      top: 50,
      borderRadius: 35,
      backgroundColor: "white",
      justifyContent: "center",
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 4.65,
      elevation: 8,
    },
    miniPlayPauseButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: "white",
      justifyContent: "center",
      alignItems: "center",
      marginHorizontal: 8,
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
    skipButton: { top: 65, marginHorizontal: 65 },
    container: {
      position: "absolute",
      top: 490,
      left: 25,
      alignItems: "left",
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
      backgroundColor: "rgba(0,0,0,0.5)", // backdrop blur
    },
    modalContent: {
      height: "50%", // half the screen
      backgroundColor: "white",
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: 20,
      backgroundColor: "rgba(0,0,0,0.8)",
    },
    option: {
      fontSize: 18,
      marginVertical: 12,
      color: "white",
    },
    button: {
      padding: 6,
      position: "absolute",
      top: 35,
      left: 30,
      zIndex: 10,
    },
  });

  // Render the mini player if minimized
  if (isMinimized) {
    return (
      // Remove the TouchableWithoutFeedback wrapping the entire view
      <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
        <View
          style={{
            position: "static",
            bottom: "10%",
            width: "100%",
            zIndex: 0,
          }}
        >
          {/* Apply TouchableWithoutFeedback only to the mini player */}
          <TouchableWithoutFeedback onPress={togglePlayerSize}>
            <View style={styles.miniPlayer} activeOpacity={0.9}>
              <View style={styles.miniPlayerInfo}>
                <Image
                  source={{ uri: data ? data[pos]?.thumbnail : null }}
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
                      width: `${
                        TOTAL_DURATION ? (seek / TOTAL_DURATION) * 100 : 0
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
    <View style={styles.Main}>
      <TouchableOpacity style={styles.button} onPress={togglePlayerSize}>
        <View style={{ transform: [{ rotate: "90deg" }] }}>
          <Ionicons name="chevron-forward" size={24} color="white" />
        </View>
      </TouchableOpacity>

      <View style={{ position: "absolute", top: 30, right: 30 }}>
        <TouchableOpacity onPress={toggleModal}>
          <MaterialIcons name="more-vert" size={28} color="white" />
        </TouchableOpacity>
      </View>

      <Metadata
        data={
          data && data[pos]
            ? data[pos]
            : { title: "Unknown Song", uploader: "Unknown Artist" }
        }
        liked={liked}
        setLiked={setLiked}
        progressPercent={TOTAL_DURATION ? (seek / TOTAL_DURATION) * 100 : 0}
        seek={seek}
        TOTAL_DURATION={TOTAL_DURATION}
        formatTime={formatTime}
        styles={styles}
      />

      <TouchableOpacity onPress={replaySound}>
        <View style={[{ left: 150 }, { bottom: 50 }]}>
          <Ionicons name="refresh" size={24} color="white" />
        </View>
      </TouchableOpacity>

      <Controls
        togglePlayPause={togglePlayPause}
        isPlaying={isplaying}
        styles={styles}
        colors={colors}
        dispatch={dispatch}
        changePos={changePos}
        handlePress={handlePress}
      />
      <Custom_modal
        isModalVisible={isModalVisible}
        styles={styles}
        toggleModal={toggleModal}
      />
    </View>
  );
};

export default Player;

const Metadata = ({
  data,
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
        color={liked ? "white" : "gray"}
        style={styles.heartIcon}
      />
    </TouchableOpacity>

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

const Controls = ({ togglePlayPause, isPlaying, styles, colors,dispatch,changePos,handlePress }) => {
  return (
    <View style={styles.controlsContainer}>
      <TouchableOpacity style={styles.skipButton}  onPress={()=>{handlePress(-1)}}>
        <SkipBack width={35} height={35} stroke={colors.text} />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.playPauseButton}
        onPress={()=>togglePlayPause()}
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

      <TouchableOpacity style={styles.skipButton} onPress={()=>{
        handlePress(+1)
        }
        
        }>
        <SkipForward width={35} height={35} stroke={colors.text} />
      </TouchableOpacity>
    </View>
  );
};

const Custom_modal = ({ isModalVisible, styles, toggleModal }) => {
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
          <Text style={styles.option}>Add to Liked Songs</Text>
          <Text style={styles.option}>Add to playlist</Text>
          <Text style={styles.option}>Media Quality</Text>
          <Text style={styles.option}>Share</Text>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};
