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
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import UniversalNavi from "./Navigation/Universal";
import { darkTheme } from "./Theme/darkTheme";
import { lightTheme } from "./Theme/lightTheme";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import Websocket from "./src/Websocket/Websocket";
import { FetchMetadata } from "./Store/MusicSlice";
import { useEffect, useRef } from "react";
import { Text, Animated } from "react-native";
import Waveform from "./src/Components/Waveform";
import Audioloader from "./src/functions/Audioloader";
import { loadUser } from "./Store/AuthThunk";

export default function App() {
  const { Mode } = useSelector((state) => state.theme);
  const dispatch = useDispatch();

  const { data, pos, seek, isplaying, canLoad } = useSelector(
    (state) => state.data
  );
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const fetchData = async () => {
      dispatch(loadUser());
      setTimeout(() => {
        setStatus("idle");
      }, 1000); // Wait 1 second then go idle
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
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: Mode === "light" ? "#ffffff" : "#141414",
        }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1 }}
        >
          <View style={styles.container}>
            <StatusBar
              barStyle={Mode === "light" ? "dark-content" : "light-content"}
              backgroundColor={Mode === "light" ? "#ffffff" : "#141414"}
              translucent={false}
            />


            <NavigationContainer
              theme={Mode === "light" ? lightTheme : darkTheme}
            >
              <UniversalNavi />
            </NavigationContainer>


          </View>

          <Websocket />
          {canLoad && <Audioloader />}
        </KeyboardAvoidingView>
      </SafeAreaView>
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
