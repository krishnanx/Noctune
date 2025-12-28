import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Animated, Text } from 'react-native';
import { useProgress, useActiveTrack } from 'react-native-track-player';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const SingleProgressBar = ({ duration: trackDuration }) => {
  const progress = useProgress(100);
  const position = progress.position;

  const activeTrack = useActiveTrack();
  const duration = trackDuration || activeTrack?.duration || 1;

  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const target = Math.min(position / duration, 1);
    Animated.timing(progressAnim, {
      toValue: target,
      duration: 100,
      useNativeDriver: false,
    }).start();
  }, [position, duration]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, SCREEN_WIDTH - 40],
  });

  const circleTranslateX = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, SCREEN_WIDTH - 40],
  });

  const formatTime = (seconds) => {
    if (!seconds || !isFinite(seconds)) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' + s : s}`;
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.timeRow}>
        <Text style={styles.timeText}>{formatTime(position)}</Text>
        <Text style={styles.timeText}>{formatTime(duration)}</Text>
      </View>

      <View style={styles.lineContainer}>
        <View style={styles.backgroundLine} />
        <Animated.View style={[styles.progressLine, { width: progressWidth }]} />
        <Animated.View
          style={[
            styles.playhead,
            { transform: [{ translateX: circleTranslateX }] },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    top: '77%',
    width: '100%',
    alignItems: 'center',
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: SCREEN_WIDTH - 40,
    marginBottom: 6,
  },
  timeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: "600",
  },
  lineContainer: {
    width: SCREEN_WIDTH - 40,
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  backgroundLine: {
    position: 'absolute',
    width: '100%',
    height: 4,
    backgroundColor: '#AAA',
    top: 2,
  },
  progressLine: {
    position: 'absolute',
    height: 4,
    backgroundColor: '#2A2A2A',
    top: 2,
  },
  playhead: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFF',
    top: -2,
    //borderWidth: 1,
    //borderColor: '#2A2A2A',
  },
});

export default SingleProgressBar;
