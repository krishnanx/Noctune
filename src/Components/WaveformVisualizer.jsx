import React, { useEffect, useMemo, useState, useRef } from 'react';
import { View, StyleSheet, Dimensions, Text, ScrollView } from 'react-native';
import Constants from "expo-constants";
import Svg, { Rect } from 'react-native-svg';
import TrackPlayer, { State, usePlaybackState, useProgress, useActiveTrack } from 'react-native-track-player';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BAR_WIDTH = 7;
const SPACING = 5;
const HEIGHT = 100;

const WaveformVisualizer = ({ ytUrl }) => {
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

  const progress = useProgress(100);
  const position = progress.position;

  const activeTrack = useActiveTrack();
  const duration = activeTrack?.duration && activeTrack.duration > 0 
    ? activeTrack.duration 
    : progress.duration || 1; // fallback so never 0

  const pixelsPerSecond = waveWidth / duration;
  const playbackState = usePlaybackState();
  const isPlaying = playbackState === State.Playing;

  

  const scrollXRef = useRef(0);

  useEffect(() => {
    if (!scrollViewRef.current) return;

    const targetX = Math.max(0, smoothPosition);
    const diff = targetX - scrollXRef.current;

    // Ease a bit toward target
    scrollXRef.current += diff * 0.15;

    scrollViewRef.current.scrollTo({
      x: scrollXRef.current,
      animated: false,
    });
  }, [smoothPosition]);



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
    const diff = Math.max(0, smoothPosition) - scrollXRef.current;
    scrollXRef.current += diff * 0.1; // keep smooth scrolling

    scrollViewRef.current.scrollTo({
      x: scrollXRef.current,
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
      
      // Time coverage of this bar
      const barStart = (i / waveformData.length) * duration;
      const barEnd = ((i + 1) / waveformData.length) * duration;

      // Current progress in seconds
      const currentTime = smoothPosition / pixelsPerSecond;

      // Fill ratio for this bar (0 → 1)
      let fillRatio = 0;
      if (currentTime >= barEnd) {
        fillRatio = 1; // fully filled
      } else if (currentTime > barStart) {
        fillRatio = (currentTime - barStart) / (barEnd - barStart);
      }

      return {
        id: i,
        height,
        x: i * (BAR_WIDTH + SPACING),
        fillRatio,
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
              {/* Played part */}
              <Rect
                x={leftPadding + bar.x}
                y={HEIGHT - bar.height}
                width={BAR_WIDTH * bar.fillRatio}
                height={bar.height}
                fill="#2A2A2A"
                rx={2}
              />
              <Rect
                x={leftPadding + bar.x}
                y={HEIGHT}
                width={BAR_WIDTH * bar.fillRatio}
                height={bar.height}
                fill="#2A2A2A"
                rx={2}
              />

              {/* Remaining part */}
              <Rect
                x={leftPadding + bar.x + BAR_WIDTH * bar.fillRatio}
                y={HEIGHT - bar.height}
                width={BAR_WIDTH * (1 - bar.fillRatio)}
                height={bar.height}
                fill="#AAA"
                opacity={0.5}
                rx={2}
              />
              <Rect
                x={leftPadding + bar.x + BAR_WIDTH * bar.fillRatio}
                y={HEIGHT}
                width={BAR_WIDTH * (1 - bar.fillRatio)}
                height={bar.height}
                fill="#AAA"
                opacity={0.5}
                rx={2}
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
