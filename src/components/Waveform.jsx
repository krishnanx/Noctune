import React, { useRef, useEffect } from "react";
import { Text, Animated } from "react-native";
import { StyleSheet, View } from "react-native";


const WaveformLoader = () => {
  const NUMBER_OF_BARS = 20;
  const animations = useRef(
    [...Array(NUMBER_OF_BARS)].map(() => new Animated.Value(20))
  ).current;

  useEffect(() => {
    animations.forEach((anim, i) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 60,
            duration: 1000,
            delay: i * 100,
            useNativeDriver: false,
          }),
          Animated.timing(anim, {
            toValue: 20,
            duration: 400,
            useNativeDriver: false,
          }),
        ])
      ).start();
    });
  }, []);

  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "flex-end",
      justifyContent: "center",
      height: 100,
      paddingHorizontal: 10,
    },
    bar: {
      width: 6,
      marginHorizontal: 3,
      backgroundColor: "beige", // wave color
      borderRadius: 3,
    },
  });

  return (
    <View style={styles.container}>
      {animations.map((anim, index) => (
        <Animated.View
          key={index}
          style={[
            styles.bar,
            {
              height: anim,
            },
          ]}
        />
      ))}
    </View>
  );
};

const Waveform = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      <Text
        style={{
          color: "wheat",
          paddingBottom: 30,
          fontSize: 50,
          textAlign: "center",
        }}
      >
        𝙉𝙤𝙘𝙩𝙪𝙣𝙚
      </Text>
      <Text
        style={{
          color: "beige",
          paddingHorizontal: 20,
          fontSize: 28,
          textAlign: "center",
        }}
      >
        𝙂𝙚𝙩𝙩𝙞𝙣𝙜 𝙇𝙤𝙨𝙩 𝙞𝙣 𝙀𝙫𝙚𝙧𝙮 𝙉𝙤𝙩𝙚
      </Text>
      <Text
        style={{ textAlign: "center", alignItems: "center", paddingTop: 160 }}
      >
        <WaveformLoader />
      </Text>
      <Text
        style={{
          color: "beige",
          padding: 20,
          fontSize: 18,
          textAlign: "center",
        }}
      >
        "𝚆𝚑𝚎𝚗 𝚠𝚘𝚛𝚍𝚜 𝚏𝚊𝚒𝚕, 𝚖𝚞𝚜𝚒𝚌 𝚏𝚒𝚗𝚍𝚜 𝚢𝚘𝚞... "
      </Text>
    </Animated.View>
  );
};

export default Waveform;
