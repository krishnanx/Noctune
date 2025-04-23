import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  KeyboardAvoidingView,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import { Entypo } from "@expo/vector-icons";
import { Searchbar } from "react-native-paper";
import Svg, { Path } from "react-native-svg";
import { Keyboard } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { changeState } from "../../Store/KeyboardSlice";
//import ytdl from "react-native-ytdl";
//import YTSearch from "youtube-search-api";
import YoutubeMusicApi from "youtube-music-api";
import { DownloadMusic } from "../../Store/MusicSlice";
import { ScrollView } from "react-native";
import { FetchMetadata } from "../../Store/MusicSlice";
import { addMusic, load } from "../../Store/MusicSlice";
import { loadAudio, unloadAudio } from "../functions/music.js";
import Audioloader from "../functions/Audioloader.jsx";
import { useFocusEffect } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import store from "../../Store/store";

const Search = () => {
  const { colors } = useTheme(); // Get theme colors
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [songs, setSongs] = useState({});
  const [query, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isApiInitialized, setIsApiInitialized] = useState(false);
  const [ytmusicApi, setYtMusicApi] = useState(null);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { data, pos } = useSelector((state) => state.data);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const loadLastSong = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem("lastPlayedSong");

        if (jsonValue != null) {
          const lastSong = JSON.parse(jsonValue);

          if (lastSong && lastSong.url) {
            // First, dispatch action to add song to store
            dispatch(addMusic(lastSong));

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
                console.warn(
                  "Data or position not valid after loading saved song"
                );
              }
            }, 100);
          } else {
            console.warn("No valid song data found in AsyncStorage");
          }
        }
      } catch (e) {
        console.error("Error loading last song", e);
      }
    };

    loadLastSong();
  }, []);

  useEffect(() => {
    const initializeApi = async () => {
      try {
        const api = new YoutubeMusicApi();
        await api.initalize(); //initialize the api
        setYtMusicApi(api);
        setIsApiInitialized(true);
        console.log("YouTube Music API initialized successfully");
      } catch (err) {
        console.error("Failed to initialize YouTube Music API:", err);
        setError("Failed to initialize music search. Please try again later.");
      }
    };

    initializeApi();
    const keybaordDidShow = Keyboard.addListener("keyboardDidShow", () =>
      dispatch(changeState(true))
    );
    const keyboardDidHide = Keyboard.addListener("keyboardDidHide", () =>
      dispatch(changeState(false))
    );

    return () => {
      keybaordDidShow.remove();
      keyboardDidHide.remove();
    };
  }, []);
  useFocusEffect(
    React.useCallback(() => {
      // When screen is focused
      return () => {
        // When screen is unfocused (like going to another page)
        dispatch(load(false));
        console.log("it is false");
      };
    }, [])
  );
  const searchMusic = async (searchText) => {
    if (!searchText || !searchText.trim()) return;
    if (!isApiInitialized) {
      setError("Please try again.");
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      const results = await ytmusicApi.search(searchText, "song");
      console.log("Search results:", results);

      if (results && results.content && results.content.length > 0) {
        //Process top5 results only
        const topResults = results.content.slice(0, 5).map((item) => ({
          id: item.videoId,
          title: item.name,
          artist: item.artist ? item.artist.name : "Unknown Artist",
          image: item.thumbnails ? item.thumbnails[0].url : null,
          url: `https://www.youtube.com/watch?v=${item.videoId}`,
          duration: item.duration / 1000,
        }));

        setSongs(topResults);
      } else {
        setSongs({});
        setError("No songs found");
      }
    } catch (err) {
      console.error("Search error:", err);
      setError("Failed to search for music. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  const handleCardPress = (song) => {
    unloadAudio();
    console.log("Card pressed with URL:", song.url);
    // dispatch(FetchMetadata({ text: song.url }));
    console.log(song);
    dispatch(addMusic(song));
    dispatch(load(true));
    console.log("Dispatches complete");

    // Add this line to save the song metadata to AsyncStorage
    saveLastPlayedSong(song);
  };

  const saveLastPlayedSong = async (song) => {
    try {
      const jsonValue = JSON.stringify(song);
      await AsyncStorage.setItem("lastPlayedSong", jsonValue);
    } catch (e) {
      console.error("Error saving song metadata", e);
    }
  };

  const styles = StyleSheet.create({
    Main: {
      backgroundColor: colors.background,
      width: "100%",
      flex: 1, //added
      zIndex: 1000,
      //height: "100%", //had to comment this
    },
    input: {
      width: "70%",
      height: 40,
      borderWidth: 1,
      borderColor: "white",
      padding: 10,
      borderRadius: 20,
    },
    InputView: {
      width: "100%",
      justifyContent: "center",
      alignItems: "center",
      height: "15%",
      //paddingTop: 40,
      //marginBottom: 20,
    },
    card: {
      width: "98%", //95
      alignSelf: "center",
      borderRadius: 20,
      padding: 15,
      paddingLeft: 15,
      marginVertical: 10,
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      backgroundColor: "rgba(50,50,50,0.5)",
    },
    cardImage: {
      width: 50,
      height: 50,
      borderRadius: 8,
      marginRight: 15,
    },
    artistName: {
      color: "white",
      fontSize: 13,
    },
    songName: {
      color: "white",
      fontSize: 16,
      fontWeight: "bold",
    },
    textContainer: {
      flex: 1,
      paddingRight: 10,
    },
    dotsContainer: {
      marginLeft: "auto",
    },
  });

  return (
    <View style={styles.Main}>
      {/* <Input
          placeholder='Place your Text'
          value={""}
          onChangeText={nextValue => { }}
      />*/}

      <View style={styles.InputView}>
        <Searchbar
          style={{ padding: 0, margin: 0, width: 350 }}
          placeholder="Search for music..."
          onSubmitEditing={() => {
            //dispatch(DownloadMusic({ text }));
            //setFetchSong(sampleSongs);
            searchMusic(query);
          }}
          icon={() => (
            <View
              style={{
                width: 40,
                height: 40,
                backgroundColor: "black",
                borderRadius: 0,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Svg width={30} height={30} viewBox="0 -960 960 960">
                <Path
                  d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"
                  fill="white"
                />
              </Svg>
            </View>
          )}
          onClearIconPress={() => {
            setText("");
            setSongs([]);
          }}
          onChangeText={(value) => {
            setText(value);
            if (value === "") {
              setSongs([]);
            }
          }}
          //value={text}
          value={query}
        />
      </View>
      <View style={{ flexGrow: 1 }}>
        <KeyboardAvoidingView>
          {isLoading ? (
            <View style={{ padding: 20 }}>
              <ActivityIndicator size="large" color="white" />
            </View>
          ) : error ? (
            <View style={{ padding: 20, alignItems: "center" }}>
              <Text style={{ color: "red", textAlign: "center" }}>{error}</Text>
            </View>
          ) : (
            <FlatList
              data={songs}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View
                  style={styles.card}
                  onTouchEnd={() => handleCardPress(item)}
                >
                  <Image
                    source={{ uri: item.image }}
                    style={styles.cardImage}
                  />
                  <View style={styles.textContainer}>
                    <Text
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={styles.songName}
                    >
                      {item.title}
                    </Text>
                    <Text style={styles.artistName}>{item.artist}</Text>
                  </View>
                  <View style={styles.dotsContainer}>
                    <Entypo
                      name="dots-three-vertical"
                      size={20}
                      color="white"
                    />
                  </View>
                </View>
              )}
              contentContainerStyle={{
                paddingBottom: 100,
              }}
              keyboardShouldPersistTaps="handled"
            />
          )}
          <Text style={{ color: "white" }}></Text>
        </KeyboardAvoidingView>
      </View>
    
    </View>
  );
};

export default Search;
