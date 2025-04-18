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
} from "react-native";
import { useTheme } from "@react-navigation/native";
import { Audio } from "expo-av";
import { SkipBack, SkipForward } from "react-native-feather";
import Constants from "expo-constants";
import Icon from "react-native-vector-icons/FontAwesome";
import { MaterialIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import Ionicons from "react-native-vector-icons/Ionicons";
import { FetchMetadata } from "../../Store/MusicSlice";
import { useNavigation } from "@react-navigation/native";

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

const Player = () => {
  const { colors } = useTheme();
  const soundRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progressSeconds, setProgressSeconds] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [liked, setLiked] = useState(false);
 // const [audioUrl, setAudioUrl] = useState("");


  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [isMinimized, setIsMinimized] = useState(false);
  const animatedHeight = useRef(new Animated.Value(windowHeight)).current;
  const animatedWidth = useRef(new Animated.Value(windowWidth)).current;
  const { data, status , url,error } = useSelector((state) => state.data);
const audioUrl = useSelector((state) => state.data.Url);
console.log("Current URL state:", audioUrl);

  // useEffect(() => {
  //   if (data) {
  //     setAudioUrl(data.url); // Assuming the data object contains a field `url` with the audio URL
  //   }
  // }, [data]);

  const streamUrl =
    typeof Constants.expoConfig.extra.SERVER !== "undefined"
      ? `${
          Constants.expoConfig.extra.SERVER
        }/api/stream?url=${encodeURIComponent(audioUrl)}`
      : audioUrl; // fallback to direct URL if SERVER is undefined

  useEffect(() => {
    if (data) {
      console.log("data:", data);
      loadAudio();
    }

    return () => {
      console.log("Cleanup");
    };
  }, [data]);

  useEffect(() => {
    console.log("sec:", progressSeconds);
    console.log("isPlaying?...:", isPlaying);
  }, [progressSeconds, isPlaying]);

  const loadAudio = async () => {
    try {
      if (data) {
        if (soundRef.current) {
          await soundRef.current.unloadAsync();
          soundRef.current = null;
        }
        setProgressSeconds(0);
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          staysActiveInBackground: true,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        });

        const { sound } = await Audio.Sound.createAsync(
          { uri: streamUrl },
          { shouldPlay: false, progressUpdateIntervalMillis: 1060 },
          onPlaybackStatusUpdate
        );
        soundRef.current = sound;
        sound.setOnPlaybackStatusUpdate((status) => {
          onPlaybackStatusUpdate(status);
        });
        console.log("Audio Loaded", soundRef.current);
      }
    } catch (error) {
      console.log("Error loading audio:", error);
    }
  };

  const unloadAudio = async () => {
    if (soundRef.current) {
      await soundRef.current.unloadAsync();
      soundRef.current = null;
    }
  };

  const tailFill = async (currentSec) => {
    // for (let sec = currentSec + 1; sec <= data?.duration; sec++) {
    //   // wait 1 s
    //   await new Promise(res => setTimeout(res, 1000));
    //   setProgressSeconds(sec);
    // }
    // once done:
    setProgressSeconds(currentSec);
    setIsPlaying(false);
    unloadAudio();
    return; // if you want to free the sound
  };

  const onPlaybackStatusUpdate = (status) => {
    if (status.isLoaded) {
      console.log("hi?");
      console.log("positionMillis:", status.positionMillis / 1000);
      if (status.isPlaying) {
        setProgressSeconds((prev) => prev + 1);
      }

      if (status.didJustFinish) {
        if (progressSeconds != data?.duration && progressSeconds != 0) {
          console.log("finishing up!!");
          tailFill(data?.duration);
        }
      }
    } else if (status.error) {
      console.log(`Playback error: ${status.error}`);
    }
  };

  const togglePlayPause = async () => {
    if (!soundRef.current) return;

    if (isPlaying) {
      await soundRef.current.pauseAsync();
      setProgressSeconds((prev) => prev - 1);
    } else {
      await soundRef.current.playAsync(); // resumes from last position
      setProgressSeconds((prev) => prev - 1);
    }

    setIsPlaying((prev) => !prev);
  };

  const replaySound = async () => {
    if (isPlaying) {
      await soundRef.current.setPositionAsync(0);
      await soundRef.current.playAsync();
      setProgressSeconds(0);
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

  const TOTAL_DURATION = data?.duration;

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
      position: "absolute",
      bottom: 0,
      width: windowWidth,
      height: 70,
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
      bottom: 140,
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
      bottom: 0,
      left: 0,
      right: 0,
      height: 2,
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
      top: 30,
      left: 30,
      zIndex: 10,
    },
  });

  // Render the mini player if minimized
  if (isMinimized) {
    return (
      <TouchableOpacity
        style={styles.miniPlayer}
        activeOpacity={0.9}
        onPress={togglePlayerSize}
      >
        <View style={styles.miniPlayerInfo}>
          <Image
            source={{ uri: data?.thumbnail }}
            style={styles.miniPlayerThumbnail}
          />
          <View style={styles.miniPlayerTextContainer}>
            <Text style={styles.miniPlayerTitle} numberOfLines={1}>
              {data?.title}
            </Text>
            <Text style={styles.miniPlayerArtist} numberOfLines={1}>
              {data?.uploader}
            </Text>
          </View>
        </View>

        <View style={styles.miniPlayerControls}>
          <TouchableOpacity
            onPress={togglePlayPause}
            style={styles.miniPlayPauseButton}
          >
            {isPlaying ? (
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
                  TOTAL_DURATION ? (progressSeconds / TOTAL_DURATION) * 100 : 0
                }%`,
              },
            ]}
          />
        </View>
      </TouchableOpacity>
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
        data={data}
        liked={liked}
        setLiked={setLiked}
        progressPercent={
          TOTAL_DURATION ? (progressSeconds / TOTAL_DURATION) * 100 : 0
        }
        progressSeconds={progressSeconds}
        TOTAL_DURATION={TOTAL_DURATION}
        formatTime={formatTime}
        styles={styles}
      />

      <TouchableOpacity onPress={replaySound}>
        <View style={{ left: 150 }}>
          <Ionicons name="refresh" size={24} color="white" />
        </View>
      </TouchableOpacity>

      <Controls
        togglePlayPause={togglePlayPause}
        isPlaying={isPlaying}
        styles={styles}
        colors={colors}
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
  progressSeconds,
  TOTAL_DURATION,
  formatTime,
  styles,
}) => (
  <>
    <Image source={{ uri: data?.thumbnail }} style={styles.albumArt} />

    <View style={styles.container}>
      <View style={{ width: 300 }}>
        <Text style={styles.songName}>{data?.title}</Text>
      </View>
      <Text style={styles.singerName}>{data?.uploader}</Text>
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
        <Text style={styles.timeText}>{formatTime(progressSeconds)}</Text>
        <Text style={styles.timeText}>{formatTime(TOTAL_DURATION)}</Text>
      </View>
    </View>
  </>
);

const Controls = ({ togglePlayPause, isPlaying, styles, colors }) => {
  return (
    <View style={styles.controlsContainer}>
      <TouchableOpacity style={styles.skipButton}>
        <SkipBack width={35} height={35} stroke={colors.text} />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.playPauseButton}
        onPress={togglePlayPause}
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

      <TouchableOpacity style={styles.skipButton}>
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
