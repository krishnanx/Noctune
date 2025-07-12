// src/components/ToastContainer.js
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Animated, Text, StyleSheet, Dimensions } from 'react-native';
import { hideToast } from "../../Store/ToastSlice";

const { width } = Dimensions.get('window');

const ToastContainer = () => {
  const { visible, message } = useSelector((state) => state.toast);
  const dispatch = useDispatch();

  const opacity = new Animated.Value(0);

  useEffect(() => {
    if (visible) {
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setTimeout(() => {
          Animated.timing(opacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }).start(() => {
            dispatch(hideToast());
          });
        }, 2000); // Display duration
      });
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.toastContainer, { opacity }]}>
      <Text style={styles.toastText}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    top: 60,
    left: width * 0.1,
    right: width * 0.1,
    backgroundColor: '#357266',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
  },
  toastText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default ToastContainer;
