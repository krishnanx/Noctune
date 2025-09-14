import React, { useEffect, useMemo, useState, useRef } from 'react';
import { View, StyleSheet, Dimensions, Text, ScrollView } from 'react-native';
import Constants from "expo-constants";
import Svg, { Rect } from 'react-native-svg';
import TrackPlayer, { State, usePlaybackState, useProgress, useActiveTrack } from 'react-native-track-player';
import { useDispatch,useSelector } from 'react-redux';
import { updateWaveformPosition } from '../../Store/waveform';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BAR_WIDTH = 7;
const SPACING = 5;
const HEIGHT = 100;

const WaveformVisualizer = ({ ytUrl }) => {
  const [waveformData, setWaveformData] = useState([]);
  const scrollViewRef = useRef();
  const [tick, setTick] = useState(0);

  const smoothPositionRef = useRef(0);  
  const smoothFillsRef = useRef([]); // smooth fill per bar
  const animationRef = useRef();
  const lastUpdateTimeRef = useRef(performance.now());

  const progress = useProgress(100);
  const position = progress.position;

  const activeTrack = useActiveTrack();
  const duration = activeTrack?.duration && activeTrack.duration > 0 
    ? activeTrack.duration 
    : progress.duration || 1; 

  const pixelsPerSecond = (waveformData?.length || 0) * (BAR_WIDTH + SPACING) / duration;
  const playbackState = usePlaybackState();
  const isPlaying = playbackState === State.Playing;

  const scrollXRef = useRef(0);

  const waveWidth = (waveformData?.length || 0) * (BAR_WIDTH + SPACING);
  const leftPadding = SCREEN_WIDTH / 2;
  const paddedWidth = waveWidth + leftPadding * 2;

  const lastScrollX = useSelector(state => state.waveform.lastScrollX);
  const lastSmoothPosition = useSelector(state => state.waveform.lastSmoothPosition);
  const dispatch = useDispatch();

  useEffect(() => {
    smoothPositionRef.current = lastSmoothPosition;
    scrollXRef.current = lastScrollX;
  }, []);

  // Save position on unmount
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(updateWaveformPosition({
        lastScrollX: scrollXRef.current,
        lastSmoothPosition: smoothPositionRef.current
      }));
    }, 1000); // every 1 second
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!ytUrl) return;

    const fetchWaveform = async () => {
      try {
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
      }
    };

    fetchWaveform();
  }, [ytUrl]);

// **Initialize smoothFillsRef when waveformData changes**
  useEffect(() => {
    if (waveformData && waveformData.length > 0) {
      smoothFillsRef.current = waveformData.map(() => 0);
    }
  }, [waveformData]);


  // Animate smooth position + per-bar fills
  useEffect(() => {
  const animate = (currentTime) => {
    const deltaTime = (currentTime - lastUpdateTimeRef.current) / 1000;
    lastUpdateTimeRef.current = currentTime;

    setTick(t => t + 1); // triggers useMemo to re-render bars

    const targetPixels = position * pixelsPerSecond;

    // Smooth waveform position
    if (isPlaying) {
      smoothPositionRef.current += deltaTime * pixelsPerSecond;
    } else {
      smoothPositionRef.current += (targetPixels - smoothPositionRef.current) * 0.05; // small catch-up
    }

    // Smooth scroll
    if (scrollViewRef.current) {
      const diff = Math.max(0, smoothPositionRef.current) - scrollXRef.current;
      scrollXRef.current += diff * (1 - Math.exp(-deltaTime * 8));
      scrollViewRef.current.scrollTo({ x: scrollXRef.current, animated: false });
    }

    // Smooth fill per bar using frame-rate-independent exponential smoothing
    waveformData.forEach((_, i) => {
      const barStart = (i / waveformData.length) * duration;
      const barEnd = ((i + 1) / waveformData.length) * duration;

      let targetFill = 0;
      const currentTimeSec = smoothPositionRef.current / pixelsPerSecond;
      if (currentTimeSec >= barEnd) targetFill = 1;
      else if (currentTimeSec > barStart) targetFill = (currentTimeSec - barStart) / (barEnd - barStart);

      // Exponential smoothing
      const smoothFactor = 8; // higher = faster catch-up
      smoothFillsRef.current[i] += (targetFill - smoothFillsRef.current[i]) * (1 - Math.exp(-deltaTime * smoothFactor));
      
      // Clamp between 0 and 1
      smoothFillsRef.current[i] = Math.min(1, Math.max(0, smoothFillsRef.current[i]));
    });

    animationRef.current = requestAnimationFrame(animate);
  };

  animationRef.current = requestAnimationFrame(animate);
  return () => cancelAnimationFrame(animationRef.current);
}, [isPlaying, position, waveformData, pixelsPerSecond, duration]);


  // Render bars
  const bars = useMemo(() => {
    if (!waveformData || waveformData.length === 0) return [];

    return waveformData.map((amp, i) => {
      const height = Math.max(4, (amp / 100) * HEIGHT);
      return {
        id: i,
        height,
        x: i * (BAR_WIDTH + SPACING),
        fillRatio: smoothFillsRef.current[i] ?? 0,
      };
    });
  }, [waveformData,tick]);

  const formatTime = (seconds) => {
    if (!seconds || !isFinite(seconds)) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' + s : s}`;
  };

  return (
    <View style={styles.wrapper}>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 5 }}>
        <Text style={styles.timeText}>{formatTime(smoothPositionRef.current / pixelsPerSecond)}</Text>
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
