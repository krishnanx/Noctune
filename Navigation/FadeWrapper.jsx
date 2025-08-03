// components/FadeWrapper.js
import React, { useRef } from "react";
import { Animated } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

const FadeWrapper = ({ children }) => {
  const opacity = useRef(new Animated.Value(0)).current;

  useFocusEffect(
    React.useCallback(() => {
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
