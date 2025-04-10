import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useTheme } from "@react-navigation/native";
import { SkipBack, SkipForward } from "react-native-feather";
import Icon from "react-native-vector-icons/FontAwesome";

const TOTAL_DURATION = 225; // in seconds (e.g., 3 min 45 sec)

const Player = () => {
  const { colors } = useTheme();
  const [isPlaying, setIsPlaying] = useState(false);
  const [progressSeconds, setProgressSeconds] = useState(0);
  const [liked, setLiked] = useState(false);

  const togglePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgressSeconds((prev) => (prev >= TOTAL_DURATION ? 0 : prev + 1));
      }, 1000); // Every 1 second
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
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
      top: 560, // 👈 exact pixels from top
      width: "90%",
      alignSelf: "center",
    },

    progressBarBackground: {
      width: "100%",
      height: 3, // thinner line
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
      top: 470, // Move down from top (you can adjust)
      left: 25, // Move from left (you can adjust)
      alignItems: "left",
    },
    songName: {
      fontSize: 24, // Bigger song name
      fontWeight: "bold",
      color: "white",
    },
    singerName: {
      fontSize: 18, // Smaller singer name
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
      position: "absolute", // allows free positioning
      top: 480, // move down from top
      left: 140, // move from right side
    },
  });

  return (
    <View style={styles.Main}>
      {/**Song Image */}
      <Image
        source={require("../../assets/icon.png")}
        style={styles.albumArt}
      />

      {/**Song Name and Singer */}
      <View style={styles.container}>
        <Text style={styles.songName}>Shape of You</Text>
        <Text style={styles.singerName}>Ed Sheeran</Text>
      </View>

      {/* <View style={{ alignItems: "center", marginTop: 16 }}>
        <Text style={{ fontSize: 20, fontWeight: "bold", color: "#000" }}>
          {songName}
        </Text>
        <Text
          style={{
            fontSize: 16,
            fontWeight: "300",
            color: "#555",
            marginTop: 4,
          }}
        >
          {singerName}
        </Text>
      </View> */}
      <TouchableOpacity onPress={() => setLiked(!liked)}>
        <Icon
          name={liked ? "heart" : "heart-o"}
          size={28}
          color={liked ? "white" : "gray"}
          style={styles.heartIcon}
        />
      </TouchableOpacity>

      {/* Progress Bar and Time */}
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
    </View>
  );
};

export default Player;
