import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import { Audio } from "expo-av";
import { SkipBack, SkipForward } from "react-native-feather";
import Constants from "expo-constants";
import Icon from "react-native-vector-icons/FontAwesome";
import Chevron from "react-native-vector-icons/Feather";
import { MaterialIcons } from "@expo/vector-icons"; 

const TOTAL_DURATION = 225;

const Player = () => {
  const { colors } = useTheme();
  const soundRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progressSeconds, setProgressSeconds] = useState(0);
  const [liked, setLiked] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);


  const audioUrl = "https://www.youtube.com/watch?v=ql9VWZ3KfQg";
  //const SERVER = "http://192.168.1.48:80/api/stream";
  //`${SERVER}?url=${encodeURIComponent(audioUrl)}`
  const streamUrl =
    typeof Constants.expoConfig.extra.SERVER !== "undefined"
      ? `${Constants.expoConfig.extra.SERVER}?url=${encodeURIComponent(
          audioUrl
        )}`
      : audioUrl; // fallback to direct URL if SERVER is undefined

  useEffect(() => {
    loadAudio();

    return () => {
      unloadAudio();
    };
  }, []);

  const loadAudio = async () => {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });

      const { sound } = await Audio.Sound.createAsync(
        { uri: streamUrl },
        { shouldPlay: false },
        onPlaybackStatusUpdate
      );
      soundRef.current = sound;
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

  const onPlaybackStatusUpdate = (status) => {
    if (status.isLoaded && typeof status.positionMillis === "number") {
      setProgressSeconds(Math.floor(status.positionMillis / 1000));
    }
  };

  const togglePlayPause = async () => {
    if (!soundRef.current) return;

    if (isPlaying) {
      await soundRef.current.pauseAsync();
    } else {
      await soundRef.current.playAsync();
    }

    setIsPlaying((prev) => !prev);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const toggleMinimize = () => {
    setIsMinimized((prev) => !prev);
  };

  const toggleModal = () => {
    setIsModalVisible((prev) => !prev);
  };

  const progressPercent = (progressSeconds / TOTAL_DURATION) * 100;

  const styles = StyleSheet.create({
    Main: {
      backgroundColor: colors.background,
      width: "100%",
      alignItems: "center",
      justifyContent: "space-between",
      paddingBottom: 80,
      height: "100%",
    },
    progressBarContainer: {
      position: "absolute",
      top: 560,
      width: "90%",
      alignSelf: "center",
    },
    progressBarBackground: {
      width: "100%",
      height: 3,
      backgroundColor: "#ccc",
      borderRadius: 1.5,
      overflow: "hidden",
    },
    progressBarFill: {
      height: 3,
      backgroundColor: colors.primary ?? "dodgerblue",
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
      height: 70,
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
    skipButton: {
      marginHorizontal: 20,
    },
    container: {
      position: "absolute",
      top: 470,
      left: 25,
      alignItems: "left",
    },
    songName: {
      fontSize: 24,
      fontWeight: "bold",
      color: "white",
    },
    singerName: {
      fontSize: 18,
      fontWeight: "300",
      color: "gray",
      marginTop: 2,
    },
    albumArt: {
      position: "absolute",
      top: 100,
      width: 340,
      height: 340,
      borderRadius: 20,
      marginBottom: 20,
      backgroundColor: "gray",
    },
    heartIcon: {
      position: "absolute",
      top: 480,
      left: 140,
    },
    chevronButton: {
      alignSelf: "left",
      marginTop: 20,
      marginBottom: 10,
      padding: 8,
      position: "absolute",
      left: 20,
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
  });

  return (
    <View style={styles.Main}>
      <TouchableOpacity onPress={toggleMinimize} style={styles.chevronButton}>
        <Chevron
          name={isMinimized ? "chevron-up" : "chevron-down"}
          size={28}
          color={colors.text}
        />
      </TouchableOpacity>

      <View style={{ position: "absolute", top: 30, right: 30 }}>
        <TouchableOpacity onPress={toggleModal}>
          <MaterialIcons name="more-vert" size={28} color="white" />
        </TouchableOpacity>
      </View>

      <Image
        source={require("../../assets/icon.png")}
        style={styles.albumArt}
      />

      <View style={styles.container}>
        <Text style={styles.songName}>Shape of You</Text>
        <Text style={styles.singerName}>Ed Sheeran</Text>
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
            style={[styles.progressBarFill, { width: `${progressPercent}%` }]}
          />
        </View>
        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>{formatTime(progressSeconds)}</Text>
          <Text style={styles.timeText}>{formatTime(TOTAL_DURATION)}</Text>
        </View>
      </View>

      <View style={styles.controlsContainer}>
        <TouchableOpacity style={styles.skipButton}>
          <SkipBack width={40} height={40} stroke={colors.text} />
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
          <SkipForward width={40} height={40} stroke={colors.text} />
        </TouchableOpacity>
      </View>

      <Modal
        transparent
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)} // Android back button
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setIsModalVisible(false)} // tap outside closes
        >
          <View style={styles.modalContent}>
            <Text style={styles.option}>Add to Liked Songs</Text>
            <Text style={styles.option}>Add to playlist</Text>
            <Text style={styles.option}>Media Quality</Text>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default Player;
