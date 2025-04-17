import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  KeyboardAvoidingView,
  FlatList,
  ActivityIndicator
} from "react-native";
import { useTheme } from "@react-navigation/native";
import { Input } from "@ui-kitten/components";
import { Entypo } from "@expo/vector-icons";
import { Searchbar } from "react-native-paper";
import Svg, { Path } from "react-native-svg";
import { Keyboard } from "react-native";
import { useDispatch } from "react-redux";
import { changeState } from "../../Store/KeyboardSlice";
//import ytdl from "react-native-ytdl";
import YTSearch from "youtube-search-api";
//import { DownloadMusic } from "../../Store/MusicSlice";
import { ScrollView } from "react-native";

const Search = () => {
  const { colors } = useTheme(); // Get theme colors
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [fetchSong, setFetchSong] = useState([]);
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
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

  const searchYouTube = async(query) => {
    if(!query.trim()) return;

    setIsLoading(true);
    setError(null);

    try{
      const searchResults = await YTSearch.GetListByKeyword(query, false, 5);
      if (
        searchResults &&
        searchResults.items &&
        Array.isArray(searchResults.items)
      ) {
        const formattedresults = searchResults.items.map(item => {
          return {
            id: item.id?.videoId || String(Math.random()),
            title: item.title || "Unknown Title",
            artist: item.channelTitle || "Unknown Artist",
            image:
              item.thumbnail && item.thumbnail.thumbnails
                ? item.thumbnail.thumbnails[0]?.url
                : "https://picsum.photos/200",
            url: `https://www.youtube.com/watch?v=${item.id}`,
          };
        });
        setFetchSong(formattedresults);
      } else {
        setFetchSong([]);
      }
  }
    catch(err){
      setError('Failed to search Youtube.Please try again');
    }
    finally{
      setIsLoading(false);
    }
  };

  
  const styles = StyleSheet.create({
    Main: {
      backgroundColor: colors.background,
      width: "100%",
      flex: 1, //added
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
    /*dropdownContainer: {
      paddingVertical: 10, //check
      paddingHorizontal: 15,
      borderRadius: 10,
      width: "100%",
      gap: 12,
    },*/
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
      backgroundColor: "rgba(50,50,50,0.4)",
    },
    cardImage: {
      width: 50,
      height: 50,
      borderRadius: 8,
      marginRight: 15,
    },
    artistName: {
      color: "white",
      fontSize: 14,
    },
    songName: {
      color: "white",
      fontSize: 15,
      fontWeight: "bold",
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
          onSubmitEditing={() => {
            //dispatch(DownloadMusic({ text }));
            //setFetchSong(sampleSongs);
            searchYouTube(text)
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
            setFetchSong([]);
          }}
          onChangeText={(value) => {
            setText(value);
            if (value === "") {
              setFetchSong([]);
            }
          }}
          value={text}
        />
      </View>
      <View style={{ flexGrow: 1 }}>
        <KeyboardAvoidingView>
           {isLoading ? (
            <View style={{ padding: 20 }}>
              <ActivityIndicator size="large" color="white" />
            </View>
          ) : error ? (
            <View style={{ padding: 20, alignItems: 'center' }}>
              <Text style={{ color: 'red', textAlign: 'center' }}>{error}</Text>
            </View>
          ) : (
          <FlatList
            data={fetchSong}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Image source={{ uri: item.image }} style={styles.cardImage} />
                <View style>
                  <Text style={styles.songName}>{item.title}</Text>
                  <Text style={styles.artistName}>{item.artist}</Text>
                </View>
                <View >
                  <Entypo name="dots-three-vertical" size={20} color="white" />
                </View>
              </View>
            )}
            contentContainerStyle={{
              paddingBottom: 100,
            }}
            keyboardShouldPersistTaps="handled"
          />
          ) }
          <Text style={{ color: "white" }}></Text>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
};

export default Search;
