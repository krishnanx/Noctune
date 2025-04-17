import {
  StyleSheet,
  View,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import UniversalNavi from "./Navigation/Universal";
import { darkTheme } from "./Theme/darkTheme";
import { lightTheme } from "./Theme/lightTheme";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import Websocket from "./src/Websocket/Websocket";
import { FetchMetadata } from "./Store/MusicSlice";
import { useEffect, useRef } from "react";
import { Text, Animated, Easing, ImageBackground } from "react-native";
import Svg, { Circle, G } from "react-native-svg";
import music from"./assets/music.png"

export default function App() {
  const { Mode } = useSelector((state) => state.theme);
  const { data, status } = useSelector((state) => state.data);
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Dispatch the action to fetch metadata
        await dispatch(
          FetchMetadata({ text: "https://www.youtube.com/watch?v=e1mOmdykmwI" })
        ).unwrap();
      } catch (error) {
        console.error("❌ Error occurred while fetching metadata:", error);
        // Handle error within the component (e.g., set an error state)
        // You can use local state or display a message in the UI
      }
    };

    fetchData();
  }, [dispatch]);

  if (status === "loading") {
    return (
      <>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ImageBackground
            source={music}
            style={{
              paddingVertical: 50,
              width: 40,
              height: 40,
            }}
          />
          <Text style={{ padding: 20, fontSize: 28, textAlign: "center" }}>
            𝙉𝙤𝙘𝙩𝙪𝙣𝙚 - 𝙂𝙚𝙩𝙩𝙞𝙣𝙜 𝙇𝙤𝙨𝙩 𝙞𝙣 𝙀𝙫𝙚𝙧𝙮 𝙉𝙤𝙩𝙚
          </Text>
          <Text style={{ fontSize: 18, paddingBottom: 80 }}>
            "𝘞𝘩𝘦𝘯 𝘸𝘰𝘳𝘥𝘴 𝘧𝘢𝘪𝘭, 𝘮𝘶𝘴𝘪𝘤 𝘧𝘪𝘯𝘥𝘴 𝘺𝘰𝘶."
          </Text>
          <CirclingLoader />
          <Text style={{ color: "gray" }}>Loading...</Text>
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

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const CirclingLoader = () => {
  const rotateClock = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateClock, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: false,
      })
    ).start();
  }, [rotateClock]);

  return (
    <View style={{ justifyContent: "center", alignItems: "center" }}>
      <Svg width="100" height="100" viewBox="0 0 100 100">
        <G transform="translate(50, 50)">
          {Array.from({ length: 12 }, (_, i) => {
            const angle = i * 30 * (Math.PI / 180);
            const radius = 35;
            const x = radius * Math.sin(angle);
            const y = -radius * Math.cos(angle);

            const inputStart = i / 12;
            const inputEnd = (i + 1) / 12;

            const opacity = rotateClock.interpolate({
              inputRange: [0, inputStart, inputEnd, 1],
              outputRange: [0.2, 1, 0.2, 0.2],
              extrapolate: "clamp",
            });

            return (
              <AnimatedCircle
                key={i}
                cx={x}
                cy={y}
                r="5"
                fill="black"
                opacity={opacity}
              />
            );
          })}
        </G>
      </Svg>
    </View>
  );
};
