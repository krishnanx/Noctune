import React, { useEffect, useState } from 'react'
import {View,StyleSheet,Text,TextInput,Image,} from "react-native";
import { useTheme } from '@react-navigation/native';
import { Input } from '@ui-kitten/components';
import { Entypo } from "@expo/vector-icons";
import { Searchbar } from 'react-native-paper';
import Svg, { Path } from "react-native-svg";
import { Keyboard } from "react-native";
import { useDispatch } from 'react-redux';
import { changeState } from '../../Store/KeyboardSlice';
import { DownloadMusic } from '../../Store/MusicSlice'; 
import { ScrollView } from "react-native";



const Search = () => {
  const { colors } = useTheme(); // Get theme colors
  //const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [fetchSong, setFetchSong] = useState([]);
  const dispatch = useDispatch();

  // Temporary dummy data for fetched songs
  const sampleSongs = [
    {
      id: 1,
      title: "Levitating",
      artist: "Dua Lipa",
      image: "https://picsum.photos/200",
    },
    {
      id: 2,
      title: "Perfect",
      artist: "Ed Sheeran",
      image: "https://picsum.photos/200",
    },
    {
      id: 3,
      title: "Espresso",
      artist: "Sabrina Carpenter",
      image: "https://picsum.photos/200",
    },
    {
      id: 4,
      title: "Roar",
      artist: "Katy Perry",
      image: "https://picsum.photos/200",
    },
    {
      id: 5,
      title: "Wildest Dreams",
      artist: "Taylor Swift",
      image: "https://picsum.photos/200",
    },
    {
      id: 6,
      title: "Shape of You",
      artist: "Ed Sheeran",
      image: "https://picsum.photos/200",
    },
    {
      id: 7,
      title: "Blinding Lights",
      artist: "The Weeknd",
      image: "https://picsum.photos/200",
    },
    {
      id: 8,
      title: "Peaches",
      artist: "Justin Bieber",
      image: "https://picsum.photos/200",
    },
  ];
  
 
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
  }, [])

  const styles = StyleSheet.create({
    Main: {
      backgroundColor: colors.background,
      width: "100%",
      alignItems: "center",
      //padding: 10, //added
      //paddingTop: 50, //added
      //flex: 1, //added
      height: "100%", //min height
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
      //backgroundColor: "pink",
      justifyContent: "center",
      alignItems: "center",
      height: "15%",
    },
    dropdownContainer: {
      paddingVertical: 10, //check
      paddingHorizontal: 15,
      borderRadius: 10,
      width: "100%",
      gap: 12,
    },
    card: {
      width: "95%", //95
      alignSelf: "center",
      borderRadius: 20,
      padding: 15,
      paddingLeft: 5,
      marginVertical: 5,
      flexDirection: "row",
      alignItems: "center",
      gap: 15,
      backgroundColor: "rgba(50,50,50,0.4)",
    },
    cardImage: {
      width: 60,
      height: 60,
      borderRadius: 8,
      marginRight: 15,
    },
    artistName: {
      color: "white",
      fontSize: 14,
    },
    songName: {
      color: "white",
      fontSize: 18,
      fontWeight: "bold",
    },
  });

  const [text, setText] = useState("");
  
 
  return (
    <View style={styles.Main}>
      {/* <Input
                placeholder='Place your Text'
                value={""}
                onChangeText={nextValue => { }}
            /> */}

      <View style={styles.InputView}>
        <Searchbar
          style={{ padding: 0, margin: 0, width: 350 }}
          onSubmitEditing={() => {
            dispatch(DownloadMusic({ text }));
            setFetchSong(sampleSongs);
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
          //onFocus={() => setIsFocussed(true)}
          //onBlur={() => setIsFocussed(false)}
          //onChangeText={setText}
          value={text}
        />
      </View>

      {fetchSong.length > 0 && (
        <View style={styles.dropdownContainer}>
          {/*<Text style={styles.heading}>Recent Searches</Text>*/}
          {fetchSong.map((item) => (
            <View key={item.id} style={styles.card}>
              <Image source={{ uri: item.image }} style={styles.cardImage} />
              <View style={{ flex: 1 }}>
                <Text style={styles.songName}>{item.title}</Text>
                <Text style={styles.artistName}>{item.artist}</Text>
              </View>
              <View style={{ marginLeft: "auto" }}>
                <Entypo name="dots-three-vertical" size={20} color="white" />
              </View>
            </View>
          ))}
        </View>
      )}

      <Text style={{ color: "white" }}></Text>
    </View>
  );
}

export default Search