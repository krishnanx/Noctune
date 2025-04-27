import React, { useRef, useEffect, useState } from "react";
import { Animated, Text, View, StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";

const Marquee = ({ text }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const [textWidth, setTextWidth] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);


  useEffect(() => {
    if (textWidth && containerWidth) {
      startAnimation();
    }
  }, [textWidth, containerWidth, text]);

  const startAnimation = () => {
    animatedValue.setValue(0);

    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 8000, // How fast it scrolls across
          useNativeDriver: true,
        }),
        Animated.delay(3000), // <-- How long to halt (2000ms = 2 seconds)
      ])
    ).start();
  };

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -textWidth], // move whole text width
  });

  return (
    <View
      style={styles.container}
      onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
    >
      <Animated.View
        style={{
          flexDirection: "row",
          transform: [{ translateX }],
          alignItems: "center", // (optional for perfect vertical alignment)
        }}
      >
        <Text
          style={styles.text}
          onLayout={(e) => setTextWidth(e.nativeEvent.layout.width)}
          numberOfLines={1}
        >
          {text}
        </Text>

        <Text style={styles.text} numberOfLines={1}>
          {text}
        </Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
    
  container: {
    overflow: "hidden",
    width: "90%", // or fixed width if you prefer
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
});

export default Marquee;
