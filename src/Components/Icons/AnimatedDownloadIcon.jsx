import React, { useEffect, useRef } from 'react';
import { Animated, Easing, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const AnimatedDownloadBurstIcon = ({ height = 50, width = 50, fill = 'white' }) => {
    const translateY = useRef(new Animated.Value(0)).current;
    const opacity = useRef(new Animated.Value(1)).current;
    const scale = useRef(new Animated.Value(1)).current;

    const animate = () => {
        translateY.setValue(-10);
        opacity.setValue(1);
        scale.setValue(1);

        Animated.sequence([
            Animated.timing(translateY, {
                toValue: 5,
                duration: 600,
                easing: Easing.inOut(Easing.quad),
                useNativeDriver: true,
            }),
            Animated.parallel([
                Animated.timing(opacity, {
                    toValue: 0,
                    duration: 200,
                    easing: Easing.out(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(scale, {
                    toValue: 1.2,
                    duration: 200,
                    easing: Easing.out(Easing.ease),
                    useNativeDriver: true,
                }),
            ]),
            Animated.delay(200),
        ]).start(() => {
            animate(); // Repeat loop
        });
    };

    useEffect(() => {
        animate();
    }, []);

    return (
        <Animated.View
            style={{
                transform: [
                    { translateY },
                    { scale },
                ],
                opacity,
            }}
        >
            <Svg
                xmlns="http://www.w3.org/2000/svg"
                height={height}
                width={width}
                viewBox="0 -960 960 960"
                fill={fill}
            >
                <Path d="M160-80v-80h640v80H160Zm320-160L200-600h160v-280h240v280h160L480-240Zm0-130 116-150h-76v-280h-80v280h-76l116 150Zm0-150Z" />
            </Svg>
        </Animated.View>
    );
};

export default AnimatedDownloadBurstIcon;
