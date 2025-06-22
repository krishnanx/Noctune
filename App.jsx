import {
  StyleSheet,
  View,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  Text, Animated
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import UniversalNavi from "./Navigation/Universal";
import { darkTheme } from "./Theme/darkTheme";
import { lightTheme } from "./Theme/lightTheme";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import Websocket from "./src/Websocket/Websocket";
import { FetchMetadata } from "./Store/MusicSlice";
import Waveform from "./src/Components/Waveform";
import Audioloader from "./src/functions/Audioloader";
import { addEventListener, useNetInfo } from '@react-native-community/netinfo';
import { connection, type } from "./Store/NetworkSlice";
import PlaylistLoader from "./src/functions/PlaylistLoader"
import { AddNewPlaylist, updatemigrateSliceSucess } from "./Store/PlaylistSlice";
export default function App() {
  const { Mode } = useSelector((state) => state.theme);
  // const { user, loading } = useSelector((state) => state.user);
  const { user, loading, waveload } = useSelector((state) => state.user || {});
  const { data: array, id, playlistNo, migrateSliceSucess, migratedPlaylist } = useSelector((state) => state.playlist);
  const dispatch = useDispatch();

  const { data, pos, seek, isplaying, canLoad } = useSelector(
    (state) => state.data
  );
  const { song, load } = useSelector(
    (state) => state.playlistload
  );
  const [status, setStatus] = useState("loading");
  useEffect(() => {
    const unsubscribe = addEventListener(state => {
      console.error('Connection type', state.type);
      console.error('Is connected?', state.isConnected);
      dispatch(connection(state.isConnected))
      dispatch(type(state.type))
    });
    return () => {
      unsubscribe();
    };
    // Cleanup on unmount

  }, []);
  useEffect(() => {
    console.error("queue loader", canLoad)
    console.error("playlist loader", load)
  }, [canLoad, load])
  useEffect(() => {
    if (migrateSliceSucess) {
      dispatch(AddNewPlaylist({ data: migratedPlaylist, userid: user?.id }))
      dispatch(updatemigrateSliceSucess(false))
    }

  }, [migrateSliceSucess])
  // useEffect(() => {
  //   const fetchData = async () => {

  //     setTimeout(() => {
  //       setStatus("idle");
  //     }, 1000); // Wait 1 second then go idle
  //   };

  //   fetchData();
  // }, []);
  if (waveload) {
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

          {load && <PlaylistLoader />}
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
