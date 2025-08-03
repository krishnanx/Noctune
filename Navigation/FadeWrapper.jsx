// components/FadeWrapper.js
import React, { useRef, useState } from "react";
import { Animated } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

const FadeWrapper = ({ children }) => {
  const opacity = useRef(new Animated.Value(1)).current; // Start fully visible
  const isFirstFocus = useRef(true); // Track first time screen is focused

  useFocusEffect(
    React.useCallback(() => {
      if (isFirstFocus.current) {
        // Skip animation on first focus
        isFirstFocus.current = false;
        return;
      }

      opacity.setValue(0);
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }, [])
  );

  return <Animated.View style={{ flex: 1, opacity }}>{children}</Animated.View>;
};

export default FadeWrapper;
