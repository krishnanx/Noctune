import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  KeyboardAvoidingView,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import { Entypo } from "@expo/vector-icons";
import { Searchbar } from "react-native-paper";
import Svg, { Path } from "react-native-svg";

import { useDispatch, useSelector } from "react-redux";
import { changeState } from "../../../Store/KeyboardSlice.js";
//import ytdl from "react-native-ytdl";
//import YTSearch from "youtube-search-api";
import YoutubeMusicApi from "youtube-music-api";
import { DownloadMusic, PersistSearch, addSearchTextHistory, clearSearchTextHistory, setSearchTextHistory } from "../../../Store/MusicSlice.js";
import { ScrollView } from "react-native";
import { FetchMetadata } from "../../../Store/MusicSlice.js";
import {
  addMusic,
  load,
  setIsLoadedFromAsyncStorage,
  setSearchedMusic,
  setSearchedMusicHistory
} from "../../../Store/MusicSlice.js";
import { loadAudio, unloadAudio } from "../../functions/MusicLoaders/music.js";
import Audioloader from "../../functions/MusicLoaders/Audioloader.jsx";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import SearchModal from "../../Components/SearchModal.jsx";
import { changeLoad } from "../../../Store/Playdataslice.js";
import { YtMusicRef } from "../../functions/YtMusicRef.js";
import Constants from "expo-constants";

const Search = () => {
  const { colors } = useTheme(); // Get theme colors
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [songs, setSongs] = useState({});
  const [query, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { data, pos, seek, isplaying, canLoad, isLoadedFromAsyncStorage, searchTextHistory } = useSelector((state) => state.data);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedSong, setSelectedSong] = useState(null);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const status = useSelector((state) => state.key.status)
  
  // Add user selector to get userId
  const user = useSelector((state) => state.user || {});
  const userId = useSelector((state) => state.user?.user?.id);

  const searchMusic = async (searchText) => {
    if (!searchText || !searchText.trim()) return;

    const api = YtMusicRef.current;
    if (!api) {
      setError("Api not initialized");
      return
    }
    setIsLoading(true);
    setError(null);

    try {
      const results = await api.search(searchText, "song");
      ////console.error("Search results:", results);

      if (results && results.content && results.content.length > 0) {
        //Process top5 results only
        const topResults = results.content.slice(0, 5).map((item) => ({
          id: item.videoId,
          title: item.name,
          artist: item.artist ? item.artist.name : "Unknown Artist",
          image: item.thumbnails ? item.thumbnails[0].url : null,
          url: `https://www.youtube.com/watch?v=${item.videoId}`,
          duration: item.duration / 1000
        }));

        setSongs(topResults);
      } else {
        setSongs({});
        setError("No songs found");
      }
    } catch (err) {
      //console.error("Search error:", err);
      setError("Failed to search for music. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCardPress = async (song) => {
    unloadAudio();
    console.log("Card pressed with URL:", song.url);
    dispatch(setSearchedMusic(true))
    dispatch(PersistSearch(song))
    // dispatch(FetchMetadata({ text: song.url }));
    console.log(song);
    dispatch(addMusic(song));
    dispatch(setIsLoadedFromAsyncStorage(false));
    
    //console.warn("canLoad", canLoad)
    if (canLoad) {
      dispatch(load(false))
      //dispatch(load(true))
      setTimeout(() => {
        dispatch(load(true))
         // musics queue
      }, 1)
    }
    else {
      
      dispatch(load(true))
      
    }
    dispatch(changeLoad(false)) //playlist
    //console.warn(isLoadedFromAsyncStorage)
    
    console.log("Dispatches complete");
    //dispatch(toggleMinimized());
    // Add this line to save the song metadata to AsyncStorage
    saveLastPlayedSong(song);
   
    
    // Save search history when playing a song
    if (userId) {
      await saveSearchHistory(userId, searchTextHistory);
      await loadSearchHistory(userId, dispatch);
    }
    
    navigation.navigate('PlayerStack');
  };

  const saveLastPlayedSong = async (song) => {
    try {
      const jsonValue = JSON.stringify(song);
      await AsyncStorage.setItem("lastPlayedSong", jsonValue);
    } catch (e) {
      //console.error("Error saving song metadata", e);
    }
  };

  // Add the search history persistence functions
  const saveSearchHistory = async (userId, searchTextHistory) => {
    try {
      console.warn("1111111111111111111111111111")
      console.warn("USERID ", userId)
      await AsyncStorage.setItem(`searchHistory_${userId}`, JSON.stringify(searchTextHistory));
      console.warn('Search history saved for user:', userId, searchTextHistory);
    } catch (e) {
      console.error("Error saving search history", e);
    }
  };

  const loadSearchHistory = async (userId, dispatch) => {
    try {
      const stored = await AsyncStorage.getItem(`searchHistory_${userId}`);
      if (stored) {
        const historyArray = JSON.parse(stored);
        dispatch(setSearchTextHistory(historyArray));
        console.warn('Search history loaded for user:', userId, historyArray);
      }
    } catch (e) {
      console.error("Error loading search history", e);
    } finally {
      setHistoryLoaded(true);
    }
  };

  // Add useEffect to load search history when component mounts
  useEffect(() => {
    const loadHistory = async () => {
      if (userId) {
        await loadSearchHistory(userId, dispatch);
      } else {
        setHistoryLoaded(true);
      }
    };
    loadHistory();
  }, [userId, dispatch]);

  const toggleModal = (song) => {
    setSelectedSong(song);
    setModalVisible(true);
  };


  const fetchRecent = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/music/recent?user=${user}`);
      if (response.data.success) setRecentSearches(response.data.searched);
    } catch (e) {
      //console.error(e);
    }
  };

  useEffect(() => {
    fetchRecent();
  }, []);

  const handleSearch = async () => {
    if (!searched.trim()) return;
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/music/search?query=${searched}&user=${user}`);
      if (response.data.success) setSongs(response.data.songs);
    } catch (error) {
      //console.error(error);
    }
    setLoading(false);
  };

  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.Main}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.SearchBar}>
            <Searchbar
              style={{ padding: 0, margin: 0, width: 350 }}
              placeholder="Search for music..."
              onSubmitEditing={() => {
                //dispatch(DownloadMusic({ text }));
                //setFetchSong(sampleSongs);
                if (query.trim()) {
                  dispatch(addSearchTextHistory(query)); 
                  searchMusic(query);
                }
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
          {/* Updated condition to check historyLoaded and handle both array and object cases */}
          {historyLoaded && !isLoading && (Array.isArray(songs) ? songs.length === 0 : Object.keys(songs).length === 0) && searchTextHistory.length > 0 && (
            <View style={{ paddingHorizontal: 10, marginTop: 0 }}>

                {/* <Text style={{ color: 'white', fontSize: 20, marginBottom: 20 }}>
                Recent Searches
              </Text> */}
              <View style={{ width: '100%', alignItems: 'flex-end', marginVertical: 10 }}>
              <TouchableOpacity
                onPress={async () => {
                  dispatch(clearSearchTextHistory());
                  if (userId) {
                    await AsyncStorage.removeItem(`searchHistory_${userId}`);
                  }
                }}
              >
                <Text style={{color:'white', marginLeft: 10  }}>Clear History</Text>
              </TouchableOpacity>
              </View>

              {searchTextHistory.map((text, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: 12,
                    borderBottomColor: 'rgba(255,255,255,0.1)',
                    borderBottomWidth: 1,
                  }}
                  onPress={() => {
                    setText(text);
                    dispatch(addSearchTextHistory(text));
                    searchMusic(text);
                  }}
                >
                  
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: 'rgba(255,255,255,0.08)',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginRight: 12,
                    }}
                  >
                    <Entypo name="magnifying-glass" size={20} color="white" />
                  </View>

                  <Text
                    style={{
                      flex: 1,
                      color: 'white',
                      fontSize: 16,
                    }}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {text}
                  </Text>

                  <Entypo
                    name="chevron-left"
                    size={20}
                    color="white"
                    style={{ marginLeft: 10 }}
                  />
                </TouchableOpacity>
              ))}
            </View>
          )}
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
                <TouchableOpacity
                  style={styles.card}
                  activeOpacity={0.7}
                  onPress={() => handleCardPress(item)}
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


                    <TouchableOpacity
                      onPress={() => toggleModal(item)}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                      <Entypo
                        name="dots-three-vertical"
                        size={20}
                        color="white"
                      />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              )}
              // contentContainerStyle={{ paddingBottom: 100 }}
              keyboardShouldPersistTaps="handled"
            />
          )}
          <Text style={{ color: "white" }}></Text>
       
        <SearchModal
          isModalVisible={isModalVisible}
          toggleModal={() => setModalVisible(false)}
          dispatch={dispatch}
          navigation={navigation}
          song={selectedSong}
        />
         

        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default Search;

const styles = StyleSheet.create({
  Main: {
    flexGrow: 1,
    paddingTop: Constants.statusBarHeight,
    paddingHorizontal: 16,
    //backgroundColor: "#000"
  },
  SearchBar: {
    flexDirection: "row",
    alignItems: "center",
    //backgroundColor: "#1e1e1e",
    borderRadius: 8,
    padding: 8,
    marginBottom: 12
  },
  SearchInput: {
    flex: 1,
    color: "#fff",
    paddingHorizontal: 8
  },
  SearchIcon: {
    padding: 6
  },
  SongsList: {
    marginTop: 12
  },
  SongItem: {
    color: "#fff",
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderColor: "#333"
  },
  RecentContainer: {
    marginTop: 20
  },
  RecentTitle: {
    color: "#aaa",
    fontSize: 16,
    marginBottom: 8
  },
  RecentItem: {
    color: "#fff",
    paddingVertical: 6,
    borderBottomWidth: 0.3,
    borderColor: "#444"
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