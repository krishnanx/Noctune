import React, { useEffect, useMemo, useState, useRef } from 'react';
import { View, StyleSheet, Dimensions, Text, ScrollView } from 'react-native';
import Constants from "expo-constants";
import Svg, { Rect } from 'react-native-svg';
import TrackPlayer, { State, usePlaybackState, useProgress, useActiveTrack } from 'react-native-track-player';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BAR_WIDTH = 7;
const SPACING = 5;
const HEIGHT = 100;

const WaveformVisualizer = ({ ytUrl,duration="0:00" }) => {
  const [waveformData, setWaveformData] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollViewRef = useRef();

  const [smoothPosition, setSmoothPosition] = useState(0);
  const animationRef = useRef();
  const lastUpdateTimeRef = useRef(performance.now());
  const targetPositionRef = useRef(0);

  const waveWidth = (waveformData?.length || 0) * (BAR_WIDTH + SPACING);
  const leftPadding = SCREEN_WIDTH / 2;
  const paddedWidth = waveWidth + leftPadding * 2;

  const progress = useProgress(250);
  const position = progress.position;

  const activeTrack = useActiveTrack();
  //const duration = duration || "0:00" // fallback so never 0

  const pixelsPerSecond = waveWidth / duration;
  const playbackState = usePlaybackState();
  const isPlaying = playbackState === State.Playing;

  // Fetch waveform data
  useEffect(() => {
    if (!ytUrl) return;

    const fetchWaveform = async () => {
      try {
        setLoading(true);
        const placeholderData = Array(100).fill(0);
        setWaveformData(placeholderData);

        const res = await fetch(`${Constants.expoConfig.extra.SERVER}/yt/waveform`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: ytUrl }),
        });

        const json = await res.json();
        setWaveformData(json?.waveform || []);
      } catch (err) {
        console.error("Waveform fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWaveform();
  }, [ytUrl]);

// Animate smooth position
useEffect(() => {
  const animate = (currentTime) => {
    const deltaTime = (currentTime - lastUpdateTimeRef.current) / 1000;

    setSmoothPosition(prev => {
      const targetPixels = position * pixelsPerSecond;

      if (isPlaying) {
        // Move forward at real-time speed
        return prev + deltaTime * pixelsPerSecond;
      } else {
        // Ease towards the target
        const diff = targetPixels - prev;
        if (Math.abs(diff) < 1) return targetPixels;
        return prev + diff * 0.1;
      }
    });

    lastUpdateTimeRef.current = currentTime;
    animationRef.current = requestAnimationFrame(animate);
  };

  animationRef.current = requestAnimationFrame(animate);
  return () => cancelAnimationFrame(animationRef.current);
}, [isPlaying, position, pixelsPerSecond]);

// Update target only (don’t snap smoothPosition)
useEffect(() => {
  targetPositionRef.current = position;
}, [position]);

  // Auto scroll
  useEffect(() => {
    if (
      scrollViewRef.current &&
      waveformData.length > 0 &&
      Number.isFinite(smoothPosition)
    ) {
      scrollViewRef.current.scrollTo({
        x: Math.max(0, smoothPosition),
        animated: false,
      });
    }
  }, [smoothPosition, waveformData]);

  // Calculate bars
  const bars = useMemo(() => {
    if (!Array.isArray(waveformData) || waveformData.length === 0) return [];
    const progressRatio = smoothPosition / waveWidth;

    return waveformData.map((amp, i) => {
      const height = Math.max(4, (amp / 100) * HEIGHT);
      return {
        id: i,
        height,
        x: i * (BAR_WIDTH + SPACING),
        isPlayed: i < waveformData.length * progressRatio,
      };
    });
  }, [waveformData, smoothPosition, waveWidth]);

  // if (loading || bars.length === 0) {
  //   return null;
  // }

  const formatTime = (seconds) => {
    if (!seconds || !isFinite(seconds)) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' + s : s}`;
  };

  return (
    <View style={styles.wrapper}>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 5 }}>
        <Text style={styles.timeText}>{formatTime(smoothPosition / pixelsPerSecond)}</Text>
        <Text style={styles.timeText}>{formatTime(duration)}</Text>
        {console.error("DURATION:",duration)}
      </View>

      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ width: paddedWidth }}
        scrollEnabled={false}
      >
        <Svg width={waveWidth} height={HEIGHT * 2}>
          {bars.map((bar) => (
            <React.Fragment key={bar.id}>
              <Rect
                x={leftPadding + bar.x}
                y={HEIGHT - bar.height}
                width={BAR_WIDTH}
                height={bar.height}
                fill={bar.isPlayed ? '#2A2A2A' : '#AAA'}
                rx={2}
                opacity={bar.isPlayed ? 1 : 0.5}
              />
              <Rect
                x={leftPadding + bar.x}
                y={HEIGHT}
                width={BAR_WIDTH}
                height={bar.height}
                fill={bar.isPlayed ? '#2A2A2A' : '#AAA'}
                rx={2}
                opacity={bar.isPlayed ? 1 : 0.5}
              />
            </React.Fragment>
          ))}
        </Svg>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    color: "white",
    position: 'absolute',
    alignSelf: 'center',
    top: '77%',
    zIndex: 0,
    opacity: 1,
  },
  timeText: {
    color: 'white',
    fontSize: 12,
    width: 50,
    textAlign: 'center',
    fontWeight: "600"
  },
});

export default WaveformVisualizer;
