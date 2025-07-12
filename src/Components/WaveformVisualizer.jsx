
import React, { useEffect, useMemo, useState, useRef } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Constants from "expo-constants"
import Svg, { Rect } from 'react-native-svg';
import { useSelector } from 'react-redux';
import { ScrollView } from 'react-native';


const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BAR_WIDTH = 7;
const SPACING = 5;
const HEIGHT = 100;

const WaveformVisualizer = ({ ytUrl }) => {
  const [waveformData, setWaveformData] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollViewRef = useRef();
  
  // Smooth interpolation state
  const [smoothPosition, setSmoothPosition] = useState(0);
  const animationRef = useRef();
  const lastRealPositionRef = useRef(0);
  const lastUpdateTimeRef = useRef(performance.now());
  const targetPositionRef = useRef(0);

  const { data = [], pos = 0, seek = 0, isPlaying = false } = useSelector((state) => state.data || {});
  const currentSong = data[pos] || {};
  const duration = currentSong?.duration || 180;
  const waveWidth = (waveformData?.length || 0) * (BAR_WIDTH + SPACING);
  const leftPadding = SCREEN_WIDTH / 2;
  const paddedWidth = waveWidth + leftPadding * 2;

  const pixelsPerSecond = waveWidth / duration;

  useEffect(() => {
    if (!ytUrl) return;

    const fetchWaveform = async () => {
      try {
        setLoading(true);
        console.error("Request made");
        const res = await fetch(`${Constants.expoConfig.extra.SERVER}/yt/waveform`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: ytUrl }),
        });

        const text = await res.text();
        console.error("Raw response:", text);
        console.error("Status:", res.status);
        const json = JSON.parse(text);
        console.log(" Parsed waveform:", json.waveform);
        //const json = await res.json();
        console.error("Waveform JSON response:", json);
        setWaveformData(json?.waveform || []);
      } catch (err) {
        console.error("Waveform fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWaveform();
  }, [ytUrl]);

  // Ultra-smooth animation with interpolation
  useEffect(() => {
    const animate = (currentTime) => {
      const deltaTime = (currentTime - lastUpdateTimeRef.current) / 1000; // Convert to seconds
      
      if (isPlaying) {
        // When playing, continuously move forward at real-time speed
        setSmoothPosition(prev => {
          const increment = deltaTime * pixelsPerSecond;
          const newPos = prev + increment;
          
          // Don't go beyond the target position (actual seek position)
          const maxPos = targetPositionRef.current * pixelsPerSecond;
          return Math.min(newPos, Math.max(maxPos, newPos));
        });
      } else {
        // When paused, smoothly interpolate to the exact seek position
        setSmoothPosition(prev => {
          const targetPixels = seek * pixelsPerSecond;
          const diff = targetPixels - prev;
          
          // Smooth interpolation towards target (ease-out effect)
          if (Math.abs(diff) < 1) {
            return targetPixels; // Close enough, snap to exact position
          }
          return prev + (diff * 0.1); // 10% interpolation for smooth movement
        });
      }
      
      lastUpdateTimeRef.current = currentTime;
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, seek, pixelsPerSecond]);

  // Update target position when seek changes
  useEffect(() => {
    targetPositionRef.current = seek;
    lastRealPositionRef.current = seek;
    
    // If there's a big jump (scrubbing), immediately update smooth position
    if (Math.abs(seek - lastRealPositionRef.current) > 2) {
      setSmoothPosition(seek * pixelsPerSecond);
    }
  }, [seek, pixelsPerSecond]);

  // Smooth scroll - this runs at 60fps
  useEffect(() => {
    if (scrollViewRef.current && waveformData.length > 0) {
      scrollViewRef.current.scrollTo({
        x: Math.max(0, smoothPosition),
        animated: false, // Critical: no built-in animation
      });
    }
  }, [smoothPosition]);

  // Calculate progress for bar colors
  const bars = useMemo(() => {
    if (!Array.isArray(waveformData) || waveformData.length === 0) return [];
    
    const progress = smoothPosition / waveWidth;
    
    return waveformData.map((amp, i) => {
      const height = Math.max(4, (amp / 100) * HEIGHT);
      return {
        id: i,
        height,
        x: i * (BAR_WIDTH + SPACING),
        isPlayed: i < waveformData.length * progress,
      };
    });
  }, [waveformData, smoothPosition, waveWidth]);

  if (loading || bars.length === 0) {
    return null;
  }

  return (
    <View style={styles.wrapper}>
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
    top: '80%',
    zIndex: 0,
    opacity: 1,
  },
});

export default WaveformVisualizer;

