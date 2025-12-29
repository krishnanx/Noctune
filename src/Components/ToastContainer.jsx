// src/components/ToastContainer.js
import React, { useEffect ,useRef} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Animated, Text, StyleSheet, Dimensions,TouchableOpacity } from 'react-native';
import { hideToast } from "../../Store/ToastSlice";
import RightArrow from "./Icons/RightArrow";

const { width } = Dimensions.get('window');

const ToastContainer = ({}) => {
  const { visible, message,Title,showArrow,callback } = useSelector((state) => state.toast);
  const dispatch = useDispatch();
  
 
 const opacity = useRef(new Animated.Value(0)).current;
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
      <Text style={styles.toastText}>{Title}</Text>
      {message!=""?<Text style={{color:"white",textAlign:"center"}}>{message}</Text>:<></>}
{showArrow && callback ? (
  <TouchableOpacity
    onPress={() => {
      dispatch(hideToast());
      callback(); 
    }}
  >
    <RightArrow width={20} height={20} />
  </TouchableOpacity>
) : null}

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
