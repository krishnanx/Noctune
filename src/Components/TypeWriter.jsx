
import React, { useEffect, useRef, useState } from "react";
import { Animated, Easing } from "react-native";
import { MMKV } from "react-native-mmkv";

const storage = new MMKV();
const STORAGE_KEY = "LAST_QUOTE_INDEX";

const TypewriterText = ({ quotes = [], style }) => {
  const [quote, setQuote] = useState("");

  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;
  const scale = useRef(new Animated.Value(0.8)).current;

  const hasRunRef = useRef(false);

  useEffect(() => {
    if (hasRunRef.current || !quotes || quotes.length === 0) return;

    hasRunRef.current = true;

    const currentIndex = storage.getNumber(STORAGE_KEY) ?? 0;
    const currentQuote = quotes[currentIndex];
    const nextIndex = (currentIndex + 1) % quotes.length;
    storage.set(STORAGE_KEY, nextIndex);

    // Reset values --try animation
    opacity.setValue(0);
    translateY.setValue(20);
    scale.setValue(0.8);
    setQuote(currentQuote);

    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 1500, // try changing value here 
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 1500,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 6,
        useNativeDriver: true,
      }),
    ]).start();
  }, [quotes]);

  return (
    <Animated.Text
      style={[
        style,
        {
          opacity,
          transform: [{ translateY }, { scale }],
        },
      ]}
    >
      {quote}
    </Animated.Text>
  );
};

export default TypewriterText;


