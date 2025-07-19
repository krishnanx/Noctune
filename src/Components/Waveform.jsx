import React, { useRef, useEffect, useState,use } from "react";

import { Text, Animated, StatusBar } from "react-native";
import { StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
import { connect, useSelector } from "react-redux";
import * as Device from "expo-device";
import { setClientID, setLoading, setWebsocket, setwaveLoad } from "../../Store/UserSlice"
import { useDispatch } from "react-redux";
import { initWebSocket, getWebSocket } from '../Websocket/websocketfunc';
import { pullPlaylists, updataID } from "../../Store/PlaylistSlice";
import { loadUser } from "../../Store/AuthThunk";
import Constants from "expo-constants";
import NetInfo from "@react-native-community/netinfo";
import TypewriterText from "../Components/TypeWriter";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setIsLoadedFromAsyncStorage } from "../../Store/MusicSlice";

const Waveform = () => {
  const { Mode } = useSelector((state) => state.theme)
  const { user } = useSelector((state) => state.user)
  const { isConnected, nettype, hasChecked } = useDispatch((state) => state.network)

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [deviceName, setDeviceName] = useState(null);
  const hasConnected = useRef(false);
  const dispatch = useDispatch();

  const musicQuotes = [
  "Where words fail, music finds you.",
  "Music is what feelings sound like.",
  "Life is better with music.",
  "Music is the voice of the soul.",
  "Feel the beat, live the moment."
];

  useEffect(() => {
    const fetchDeviceName = async () => {
      try {
        const name =
          Device.getDeviceNameAsync && typeof Device.getDeviceNameAsync === "function"
            ? await Device.getDeviceNameAsync()
            : null;
        setDeviceName(
          name || `${Device.manufacturer ?? "Unknown"} ${Device.modelName ?? "Device"}`
        );

      } catch (err) {
        console.error("Error fetching device name:", err);
        setDeviceName(`${Device.manufacturer ?? "Unknown"} ${Device.modelName ?? "Device"}`);
      }
    };
    fetchDeviceName();
  }, []);
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: true,
    }).start();
  }, []);
  useEffect(() => {
    if (!deviceName || hasConnected.current) return;

    hasConnected.current = true;

    NetInfo.fetch().then(state => {
      console.log("Is connected?", state.isConnected);
      console.log("Connection type:", state.type);
      if (state.isConnected) {
        const runAsyncLogic = async () => {
          const id = Math.random().toString(36).slice(2, 8);
          console.error("HI")
          try {
            const loadedUser = await dispatch(loadUser()).unwrap(); // Await loadUser thunk
            console.warn("data:", loadedUser === null);
            //let ws;
            loadedUser === null ? null : await dispatch(pullPlaylists({ user: loadedUser.id })).unwrap()
            dispatch(updataID())
            
            // 192.168.85.33 K
            // 192.168.1.44 krish
            // `${Constants.expoConfig.extra.WEBSOC}
            console.error("loader user over")
            console.error(isConnected)

            console.error("reached websocket connection")
            //const ws = initWebSocket(`ws://192.168.1.7:8000/download-progress`);

            const ws = initWebSocket(`${Constants.expoConfig.extra.WEBSOC}/download-progress`);
            //const ws = initWebSocket(`ws://192.168.1.107:3000/download-progress`);
            //const ws = getWebSocket();
            if (!ws) {
              console.error("WebSocket failed to initialize.");
              return;
            }

            ws.onopen = () => {
              console.error("Connected to WebSocket server");
              dispatch(setClientID({ id }));


              ws.send(JSON.stringify({
                type: "register",
                clientId: id,
                value: "hi"

              }));
              dispatch(setwaveLoad(false));    //set it to false
            };

//             ws.onerror = (e) => {
//   console.error("WebSocket error:", e.message);
//   Alert.alert(
//     "Connection Issue",
//     "Couldn't connect to server services. You'll be using offline mode.",
//     [{ text: "Continue" }]
//   );
//   dispatch(setwaveLoad(false));
// };

// // Also outside
// ws.onclose = () => {
//   console.warn("WebSocket closed");
//   dispatch(setwaveLoad(false));
// };
          } catch (error) {
            console.error("Failed to load user:", error);
          }

        }
        runAsyncLogic();
      } else {
        // Show no internet UI or alert
        dispatch(setwaveLoad(false));

      }
    });
  }, [deviceName]);

 
  
const styles = StyleSheet.create({
  container: {justifyContent: "center", alignItems: "center" },
  typewriter: { fontSize: 15, fontWeight: "bold", color: "wheat" },
});



  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      <StatusBar
        barStyle={Mode === "light" ? "dark-content" : "light-content"}
        backgroundColor={Mode === "light" ? "#ffffff" : "#141414"}
        translucent={false}
      />
      <MaskedView
        maskElement={
          <Text
            style={{
              fontSize: 50,
              fontWeight: "bold",
              textAlign: "center",
              color: "black", // This color won't show; it's just for masking
            }}
          >
            𝙉𝙤𝙘𝙩𝙪𝙣𝙚
          </Text>
        }
      >
        <LinearGradient
          colors={["wheat", "white", "purple"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            height: 60, // make sure it's tall enough to fully cover the text
            alignItems: "center",
            marginBottom: 30,
          }}
        />
      </MaskedView>
      <Text
        style={{
          color: "wheat",
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

      <View style={styles.container}>
        <TypewriterText quotes={musicQuotes} style={styles.typewriter} />
    </View>
    </Animated.View>
  );
};

export default Waveform;

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
      borderRadius: 3,
      backgroundColor: "transparent", // no solid color
    },
  

  });

  return (
    <View
      style={[
        styles.container,
        { transform: [{ rotate: "180deg" }, { scaleX: -1 }] },
      ]}
    >
      {animations.map((anim, index) => (
        <MaskedView
          key={index}
          maskElement={
            <Animated.View
              style={[
                styles.bar,
                {
                  height: anim,
                  backgroundColor: "black", // mask color (any solid)
                },
              ]}
            />
          }
        >
          <LinearGradient
            colors={["purple", "beige", "wheat"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={{
              height: 100,
              width: 6,
              marginHorizontal: 3,
              borderRadius: 3,
            }}
          />
        </MaskedView>
      ))}
    </View>
  );
};