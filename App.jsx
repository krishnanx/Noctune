import {
  StyleSheet,
  View,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  Text, Animated,AppState,DeviceEventEmitter
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider, SafeAreaView,useSafeAreaInsets } from "react-native-safe-area-context";
import UniversalNavi from "./Navigation/Universal";
import { darkTheme } from "./Theme/darkTheme";
import { lightTheme } from "./Theme/lightTheme";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import Websocket from "./src/Websocket/Websocket";
import { FetchMetadata 
  ,setIsPlaying,
  setSearchedMusic,
  setIsLoadedFromAsyncStorage,
  addMusic,load
} from "./Store/MusicSlice";
import { checkAppVersion } from "./Store/VersionSlice.js";
import UpdateBanner from "./src/Components/UpdateBanner.jsx";
import Waveform from "./src/Components/Waveform";
import Audioloader from "./src/functions/MusicLoaders/Audioloader";
import { addEventListener, useNetInfo } from '@react-native-community/netinfo';
import { connection, type } from "./Store/NetworkSlice";
import PlaylistLoader from "./src/functions/MusicLoaders/PlaylistLoader"
import { YtMusicRef } from "./src/functions/YtMusicRef";
import YoutubeMusicApi from "youtube-music-api";
import ToastContainer from "./src/Components/ToastContainer";
import { AddNewPlaylist, updatemigrateSliceSucess } from "./Store/PlaylistSlice";
import { showToast } from "./Store/ToastSlice";
import eventBus from './src/functions/eventBus.js';
import AsyncStorage from "@react-native-async-storage/async-storage";
import store from "./Store/store.js";
import * as Notifications from 'expo-notifications';
import { playRef, soundRef } from "./src/functions/MusicLoaders/music.js";
import MediaNotificationManager from "./src/functions/MediaNotification.js";
import { isPending } from "@reduxjs/toolkit";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});


export default function App() {
    const insets = useSafeAreaInsets();

  useEffect(() => {
  Notifications.requestPermissionsAsync();
  }, []);

  useEffect(() => {
    dispatch(checkAppVersion());
    console.warn("222222222222222222222222222")
    console.warn("Version State:", version);
  }, []);

// Fixed DeviceEventEmitter listeners with proper cleanup
  useEffect(() => {
    const appKilledListener = DeviceEventEmitter.addListener('AppWasKilled', () => {
      // Save any critical state before app dies
      console.error('App is being killed');
      // Add your cleanup logic here
    });

    const appStartedFreshListener = DeviceEventEmitter.addListener('AppStartedFresh', () => {
      // Reset to initial state, clear navigation stack, etc.
      console.error('App started fresh after being killed');
      // Add your reset logic here
      // For example: dispatch actions to reset state, navigate to home screen, etc.
    });

    // Cleanup function
    return () => {
      appKilledListener.remove();
      appStartedFreshListener.remove();
    };
  }, []); // Empty dependency array to run only once

    useEffect(() => {
    if (Platform.OS === 'android') {
      // Make sure StatusBar is translucent
      StatusBar.setTranslucent(true);
      StatusBar.setBackgroundColor('transparent', true);
    }
  }, []);


  const { Mode } = useSelector((state) => state.theme);
  const { user, loading, waveload } = useSelector((state) => state.user || {});
  const { data: array, id, playlistNo, migrateSliceSucess, migratedPlaylist } = useSelector((state) => state.playlist);
  const dispatch = useDispatch();
  const [appState, setAppState] = useState(AppState.currentState);
  const { version, outdated, latest, forceUpdate } = useSelector((state) => state.version);
  const { data, pos, seek, isplaying, canLoad,isLoadedFromAsyncStorage,searchedMusic } = useSelector(
    (state) => state.data
  );
  const { song,pos:position ,load:playload } = useSelector(
    (state) => state.playlistload
  );

   const currentTrack = canLoad ? data && pos >= 0 && pos < data.length ? data[pos] : null : playload? song && position >= 0 && position < song.length ? song[position] : null :
      !canLoad? data && pos >= 0 && pos < data.length ? data[pos] : null : song && position >= 0 && position < song.length ? song[position] : null

    // console.warn("-----------------------------")
    // console.warn("current:",currentTrack);
    // console.warn("-------------------------------")
  //const [status, setStatus] = useState("loading");
  console.warn("canload:",canLoad);
  console.warn("playload:",playload);
  console.warn("currenttrack:",currentTrack);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      console.error('App State changed to:', nextAppState);
      setAppState(nextAppState);
      if(nextAppState == "active" && soundRef.current == null && playRef.current == null && pos>=0){
        console.error("ITSS ACTIVEE");
        dispatch(load(false))
        //dispatch(load(true))
        setTimeout(() => {
          dispatch(load(true))
            // musics queue
        }, 1)
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);
  useEffect(() => {
      const loadLastSong = async () => {
        try {
          const jsonValue = await AsyncStorage.getItem("lastPlayedSong");
  
          if (jsonValue != null) {
            const lastSong = JSON.parse(jsonValue);
            console.warn(lastSong)
            if (lastSong && lastSong.url) {
              // First, dispatch action to add song to store
              dispatch(addMusic(lastSong));
              dispatch(setIsLoadedFromAsyncStorage(true));
  
              // Then wait for state update
              setTimeout(() => {
                const currentState = store.getState();
                const { data, pos } = currentState.data;
  
                if (data && data.length > 0 && pos >= 0) {
                  console.log(
                    "Using Audioloader component for previously saved song"
                  );
                  // No need to directly call loadAudio - your Audioloader component
                  // should handle this since it watches for changes to pos
                  dispatch(load(true)); // This should trigger your Audioloader component
                } else {
                  // //console.warn(
                  //   "Data or position not valid after loading saved song"
                  // );
                }
              }, 100);
            } else {
              //console.warn("No valid song data found in AsyncStorage");
            }
          }
        } catch (e) {
          //console.error("Error loading last song", e);
        }
      };
  
      loadLastSong();
  }, []);


 
  useEffect(() => {
      const autoPlayIfUserSearched = async (sound) => {
        //console.warn("Sound changed event received", sound);
        //if (!sound) return;
        //console.error("hi: ")
        //console.warn(searchedMusic)
        if (searchedMusic && data[pos]) {
          try {
            dispatch(setSearchedMusic(false))
            //console.warn("auto play")
            await sound.playAsync();
            dispatch(setIsPlaying(true));
          } catch (error) {
            //console.error("Error auto-playing after search", error);
          }
        } else {
          console.log(
            "Song loaded from AsyncStorage or no valid song, skipping auto-play"
          );
        }
      };
  
  
      eventBus.on("soundChanged", autoPlayIfUserSearched);
      return () => eventBus.off("soundChanged", autoPlayIfUserSearched);
  
    }, [searchedMusic]);
  useEffect(() => {
    const unsubscribe = addEventListener(state => {
      //console.error('Connection type', state.type);
      //console.error('Is connected?', state.isConnected);
      dispatch(connection(state.isConnected))
      dispatch(type(state.type))
    });
    return () => {
      unsubscribe();
    };
    // Cleanup on unmount

  }, []);
  useEffect(() => {
    //console.error("queue loader", canLoad)
    //console.error("playlist loader", load)
  }, [canLoad, load])
  
  useEffect(() => {
    const handleMigrationOutput = async() => {
      if (migrateSliceSucess) {
        console.warn("pushing migrated playlist")
        console.warn(migratedPlaylist)
        dispatch(showToast({Title:"Migration Completed",message:""}));
        dispatch(AddNewPlaylist({ data: migratedPlaylist, userid: user?.id }))
        dispatch(updatemigrateSliceSucess(false))
        await AsyncStorage.setItem("migration","true")
        console.error("migration is now true")
        manuallyCloseWebSocket()
      }
  }
  handleMigrationOutput()
  }, [migrateSliceSucess])
  // useEffect(() => {
  //   const fetchData = async () => {

  //     setTimeout(() => {
  //       setStatus("idle");
  //     }, 1000); // Wait 1 second then go idle
  //   };

  //   fetchData();
  // }, []);



  useEffect(() => {
    const setup = async () => {
      try {
        const api = new YoutubeMusicApi();
        await api.initalize();
        YtMusicRef.current = api;
        //console.warn("YTMusic API initialized successfully");
      } catch (err) {
        //console.error("YTMusic API init failed:", err.message);
        if (err.response) {
          //console.error("Status:", err.response.status);
          //console.error("Data:", err.response.data);
        }
      }
    };
    setup();
  }, []);

  // console.warn("--------------------------")
  // console.warn("useEffect curr:",currentTrack);
  // console.warn("MediaNotificationManager", MediaNotificationManager);
  // console.warn("--------------------------")
  useEffect(() => {
    
    // console.warn("INSIDE useEffect curr:",currentTrack);
    // console.warn("MediaNotificationManager", MediaNotificationManager);

      if (currentTrack) {
        //console.warn("Track changed, resetting notification state");
        // First hide any existing notification
        MediaNotificationManager.hideNotification().then(() => {
          // Short delay to ensure complete reset
          setTimeout(() => {
            MediaNotificationManager.showNotification(
              {
                title: currentTrack.title || "Unknown Title",
                artist:
                  currentTrack.artist ||
                  currentTrack.uploader ||
                  "Unknown Artist",
                album: currentTrack.album || "",
                artwork: currentTrack.image || "",
              },
              {
                showNextPrev: data.length > 1, // Only show next/prev if we have multiple tracks
                showStop: true,
              }
            ).then(() => {
              MediaNotificationManager.updatePlaybackStatus(isplaying,seek);
            });
          }, 100);
        });
      }
    }, [currentTrack]);


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



  return (
    <SafeAreaProvider>
      <View
        style={{
          flex: 1,
          backgroundColor: Mode === "light" ? "#ffffff" : "#141414",
        }}
      >
        <StatusBar
          barStyle={Mode === "light" ? "dark-content" : "light-content"}
          backgroundColor="transparent"
          translucent={true}
        />

        <UpdateBanner />
        
        <View style={{ paddingTop: insets.top, flex: 1 }}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={{ flex: 1 }}
          >
            <View style={styles.container}>
              <NavigationContainer
                theme={Mode === "light" ? lightTheme : darkTheme}
              >
                <UniversalNavi />
              </NavigationContainer>
              <ToastContainer />
            </View>

            <Websocket />
            {canLoad && <Audioloader />}
            {playload && <PlaylistLoader />}
          </KeyboardAvoidingView>
        </View>
      </View>
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
