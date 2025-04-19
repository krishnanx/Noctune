import {
  StyleSheet,
  View,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
} from "react-native";
import React,{useState} from "react";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import UniversalNavi from "./Navigation/Universal";
import { darkTheme } from "./Theme/darkTheme";
import { lightTheme } from "./Theme/lightTheme";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import Websocket from "./src/Websocket/Websocket";
import { FetchMetadata } from "./Store/MusicSlice";
import {  useEffect, useRef } from "react";
import { Text, Animated,  } from "react-native";
import note from "./assets/note.png"

export default function App() {
  const { Mode } = useSelector((state) => state.theme);
  //const { data, status } = useSelector((state) => state.data);
  const [status, setStatus] = useState("loading");
  
  useEffect(() => {
    const fetchData = async () => {
      setInterval(()=>{setStatus("idle")},2000);
    };

    fetchData();
  }, []);

  if (status === "loading") {
    return (
      <>
        <View
          style={{
            backgroundColor: "#141414",
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <FadeInText />
        </View>
      </>
    );
  }

  if (status === "error") {
    return <Text>Something went wrong while fetching data.</Text>;
  }

  return (
    <SafeAreaProvider>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
          <StatusBar
            barStyle={Mode === "light" ? "dark-content" : "light-content"}
            backgroundColor={Mode === "light" ? "#ffffff" : "#141414"}
            translucent={false}
          />

          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={{ flex: 1 }}
          >
            <NavigationContainer
              theme={Mode === "light" ? lightTheme : darkTheme}
            >
              <UniversalNavi />
            </NavigationContainer>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
      <Websocket />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#141414",
    width: "100%",
  },
});

const NUMBER_OF_BARS = 20;

const WaveformLoader = () => {
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
      backgroundColor: "#141414", // for contrast
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

const FadeInText = () => {
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
      <Image
        source={note}
        style={{ width: 30, height: 40, alignSelf: "center" }} // center alignment in React Native
      />
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
        "𝚆𝚑𝚎𝚗  𝚠𝚘𝚛𝚍𝚜  𝚏𝚊𝚒𝚕,  𝚖𝚞𝚜𝚒𝚌  𝚏𝚒𝚗𝚍𝚜  𝚢𝚘𝚞... "
      </Text>
    </Animated.View>
  );
};


