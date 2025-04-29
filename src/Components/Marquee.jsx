import React, { useRef, useEffect, useState } from "react";
import { Animated, Text, View, StyleSheet } from "react-native";

const Marquee = ({ text }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const [textWidth, setTextWidth] = useState(0);
  const [shouldAnimate, setShouldAnimate] = useState(false);

  const range = textWidth * 6.2;

  useEffect(() => {
    if (text) {
      // Method 1: Include all characters including trailing spaces
      const fullLength = text.length;

      // Method 2: Trim trailing spaces only
      const trimmedTrailing = text.replace(/\s+$/, "").length;

      // Method 3: Add extra space at the end (for better visual appearance)
      const withExtraTrailing = text.length + 10; // Add 10 character spaces

      // Choose which method you want to use
      setTextWidth(fullLength); // Using Method 1

      // Uncomment one of these if you prefer a different method:
      // setTextWidth(trimmedTrailing); // Using Method 2
      // setTextWidth(withExtraTrailing); // Using Method 3
    }
  }, [text]);

  useEffect(() => {
    if (range > 300) {
      setShouldAnimate(true);
      startAnimation();
    } else {
      setShouldAnimate(false);
    }
  }, [range]);

  const startAnimation = () => {
    animatedValue.setValue(0);

    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 5000,
          useNativeDriver: true,
        }),
        Animated.delay(2500),
      ])
    ).start();
  };

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -range], // scrolls from right to far left
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={{
          transform: shouldAnimate ? [{ translateX }] : [],
        }}
      >
        <Text
          style={styles.text}
          numberOfLines={1}
          onLayout={(e) => {
            // You can also use the actual measured width if you prefer
            // const measuredWidth = e.nativeEvent.layout.width;
            // setTextWidth(measuredWidth);
          }}
        >
          {shouldAnimate
            ? text + (text.endsWith(" ") ? text + "   " : text)
            : text}
        </Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    flexDirection: "row",
    width: "100%",
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    width: 1000, // Force a long width manually
  },
});

export default Marquee;
