import React, { useEffect, useRef } from 'react';
import { Animated, TouchableOpacity, View, Easing } from 'react-native';
import { useSelector } from 'react-redux';  // to access the status from Redux
import AnimatedDownloadIcon from "../Components/Icons/AnimatedDownloadIcon"; // Your animated download icon component
import { useNavigation } from '@react-navigation/native';

const DownloadButton = () => {
    // Accessing the download status from Redux store
    const status = useSelector((state) => state.download.status)
    const navigation = useNavigation()
    // Animation ref to slide the button in and out
    const translateX = useRef(new Animated.Value(300)).current;  // Start off-screen (slide from right)

    // Effect to animate when status is 'downloading'
    useEffect(() => {
        if (status === 'downloading') {
            // Slide in when downloading starts
            Animated.timing(translateX, {
                toValue: 0,
                duration: 400,
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: true,
            }).start();
        } else {
            // Slide out when not downloading
            Animated.timing(translateX, {
                toValue: 300,
                duration: 400,
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: true,
            }).start();
        }
    }, [status]);  // Re-run effect on status change

    return (
        <Animated.View style={{ transform: [{ translateX }] }}>
            <TouchableOpacity
                style={{
                    height: 50,
                    width: 50,
                    borderRadius: 25,
                    backgroundColor: 'transparent',
                    borderWidth: 1,
                    borderColor: 'white',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
                disabled={status !== 'downloading'}  // Only enable if downloading
                onPress={() => navigation.push("Download")}
            >
                <AnimatedDownloadIcon fill="white" width={24} height={24} />
            </TouchableOpacity>
        </Animated.View>
    );
};

export default DownloadButton;
