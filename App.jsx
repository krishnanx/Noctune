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
import React, { useState } from "react";
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
import { Text, Animated } from "react-native";
import Waveform from "./src/components/Waveform";
import Audioloader from "./src/functions/Audioloader";

export default function App() {
  const { Mode } = useSelector((state) => state.theme);
  const { data, pos, seek, isplaying, canLoad } = useSelector(
    (state) => state.data
  );
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const fetchData = async () => {
      setInterval(() => {
        setStatus("idle");
      }, 2000);
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
          <Waveform />
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
      {canLoad && <Audioloader />}
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
