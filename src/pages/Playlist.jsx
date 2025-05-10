import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity, ScrollView, FlatList } from "react-native";
import BackArrow from '../Components/BackArrow';
import Download from '../Components/Download';
import AnimatedDownloadIcon from "../Components/Icons/AnimatedDownloadIcon"
import AddFriend from '../Components/addFriend';
import ThreeDots from '../Components/ThreeDots';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import icon from "../../assets/favicon.png"
import { soundRef } from '../functions/music';
import { progress, setIsPlaying } from '../../Store/MusicSlice';
import { changePlaylist, setPlaylistplaying } from '../../Store/PlaylistSlice';
import { download } from '../../Store/DownloadSlice';
import DownloadButton from '../Components/DownloadButton';
const Playlist = () => {
  const { data, id, playlistNo } = useSelector((state) => state.playlist)
  const { user, session, loading, error, clientID } = useSelector((state) => state.user)
  const { index } = useRoute().params;
  const { data: value, pos, seek, isplaying, isMinimized, animationTargetY } =
    useSelector((state) => state.data);

  const navigation = useNavigation()
  const dispatch = useDispatch();
  const styles = StyleSheet.create({
    Main: {
      flex: 1,
      width: "100%"

    },
    insideMain: {
      paddingHorizontal: 20,
      paddingTop: 20,
      flexDirection: "column",
      flex: 1,
      flexGrow: 1

    },
    top: {
      width: "100%",
      marginBottom: 20,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center"
    },
    // search:{
    //     width:"100%",
    //     height:35,
    //     //backgroundColor:"pink",
    //     marginBottom:20,

    // },
    albumArt: {
      //position: "absolute",

      width: 240,
      height: 240,
      borderRadius: 20,
      marginBottom: 20,
      backgroundColor: "gray",
    },
    imageContainer: {
      width: "100%",
      height: 250,
      //backgroundColor:"pink",
      position: "relative",
      justifyContent: "center",
      alignItems: "center"
    },
    metadata: {

      //backgroundColor:"white",
      paddingTop: 15,
      width: "100%"
    },
    Name: {
      width: "100%",
      height: 80,
      //backgroundColor:"white"
    },
    function: {
      width: "100%",
      height: 80,
      //backgroundColor:"white",
      marginTop: 20
    },
    topFunc: {
      //backgroundColor:"red",
      width: "100%",
      height: "50%",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between"
    },
    bottomFunc: {
      //backgroundColor:"pink",
      width: "100%",
      height: "50%",
      flexDirection: "row"
    },
    topFuncLeft: {
      width: "50%",
      height: "100%",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start"

    },
    topFuncRight: {
      width: "50%",
      height: "100%",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-end"

    },
    miniTriangle: {
      width: 0,
      height: 0,

      backgroundColor: "transparent",
      borderStyle: "solid",
      borderLeftWidth: 10,
      borderRightWidth: 0,
      borderBottomWidth: 7,
      borderTopWidth: 7,
      borderLeftColor: "black",
      borderTopColor: "transparent",
      borderBottomColor: "transparent",
      borderRightColor: "transparent",
      marginLeft: 2,
    },
    miniPlayPauseButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: "white",
      justifyContent: "center",
      alignItems: "center",
      marginHorizontal: 8,
    },
    miniPauseLine: {
      width: 3,
      height: 12,
      backgroundColor: "black",
      marginHorizontal: 2,
      borderRadius: 1,
    },
    pauseLinesContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },
    funcbutton: {
      width: 40,
      height: 40,
      justifyContent: "center",
      alignItems: "center", // centers content horizontally
      borderRadius: 25,
      borderColor: "white",
      borderWidth: 1,

    },
    card: {
      width: "100%", //95
      alignSelf: "center",
      borderRadius: 20,
      paddingVertical: 10,

      marginVertical: 5,
      flexDirection: "row",
      alignItems: "center",

      // backgroundColor: "rgba(50,50,50,0.5)",
    },
    cardImage: {
      width: 50,
      height: 50,
      borderRadius: 8,
      marginRight: 15,
    },
    artistName: {
      color: "white",
      fontSize: 12,
      fontWeight: "300",
      marginTop: 2
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

  })
  const Pname = data[index].name
  const Uname = "Krishnan E"

  const togglePlayPause = async () => {
    if (!soundRef.current) return;
    console.warn("reached playlist toggle")
    console.warn(playlistNo, index)
    if (playlistNo != index) {
      dispatch(changePlaylist(index))
    }
    // if (isplaying) {
    //   await soundRef.current.pauseAsync();
    //   dispatch(progress(-1));
    //   //updatePlaybackState(false, seek); //added
    // } else {
    //   await soundRef.current.playAsync(); // resumes from last position
    //   dispatch(progress(-1));
    //   //updatePlaybackState(true, seek); //added
    // }
    dispatch(setPlaylistplaying({ action: "toggle", id: index }))
    dispatch(setIsPlaying("toggle"));

  };
  const handleDownload = () => {
    console.warn("reached download function")
    console.warn(data[index]?.songs, clientID);
    dispatch(download({ data: data[index]?.songs, ClientId: clientID }))
  }
  return (
    <ScrollView
      style={styles.Main}
      contentContainerStyle={{ alignItems: 'center', paddingBottom: 100, paddingHorizontal: 20, paddingTop: 20, height: 1000 }}

    >

      <Information
        styles={styles}
        Pname={Pname}
        Uname={Uname}
        data={data[index]}
        navigation={navigation}
        togglePlayPause={togglePlayPause}
        handleDownload={handleDownload}
        DownloadButton={DownloadButton}
      />
      <Flatlist data={data[index].songs || []} styles={styles} />


    </ScrollView>
  )
}

export default Playlist
const Information = ({ styles, Pname, Uname, data, navigation, togglePlayPause, handleDownload, DownloadButton }) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };
  return (
    <View style={{ width: "100%" }} >
      <View
        style={styles.top}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}

        >
          <BackArrow />
        </TouchableOpacity>

        <DownloadButton />

      </View>
      {/* <View
            style={styles.search}
        >

        </View> */}
      <View
        style={styles.metadata}

      >
        <View
          style={styles.imageContainer}

        >
          <Image
            source={data.image ? { uri: data.image } : icon}
            style={styles.albumArt}
          // fallback if user image fails to load
          />
        </View>
        <View
          style={styles.Name}

        >
          <Text
            style={{ fontSize: 27, fontWeight: "600", color: "white", marginBottom: 8 }}
          >
            {Pname}
          </Text>
          <Text
            style={{ fontSize: 15, fontWeight: "600", color: "white", marginBottom: 4 }}
          >
            {Uname}
          </Text>
          <Text
            style={{ fontSize: 10, fontWeight: "600", color: "white" }}
          >
            {formatTime(data.Time)} min
          </Text>
        </View>
        <View
          style={styles.function}
        >
          <View
            style={styles.topFunc}
          >
            <View
              style={styles.topFuncLeft}
            >
              <TouchableOpacity
                style={[styles.funcbutton, { marginRight: 15 }]}
                onPress={() => handleDownload()}
              >
                <View >
                  <Download />
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.funcbutton, { marginRight: 15 }]}
              >
                <AddFriend />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.funcbutton, { marginRight: 15 }]}
              >
                <ThreeDots />
              </TouchableOpacity>
            </View>
            <View
              style={styles.topFuncRight}
            >
              <TouchableOpacity
                onPress={() => togglePlayPause()}
                style={styles.miniPlayPauseButton}
              >
                {data.isPlaying ? (
                  <View style={styles.pauseLinesContainer}>
                    <View style={styles.miniPauseLine} />
                    <View style={styles.miniPauseLine} />
                  </View>
                ) : (
                  <View style={styles.miniTriangle} />
                )}
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={styles.bottomFunc}
          >

          </View>
        </View>

      </View>
    </View>
  )
}
const DataList = ({ styles, item }) => {
  console.log("item", item)
  return (
    <View

      style={styles.card}
    // onTouchEnd={() => handleCardPress(item)}
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
        <Text style={styles.artistName}>{item.uploader}</Text>
      </View>
      <View style={styles.dotsContainer}>
        <ThreeDots />
      </View>
    </View>


  );
};
const Flatlist = ({ data, styles }) => {
  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id.toString()}
      scrollEnabled={false}
      renderItem={(item) => <DataList styles={styles} item={item.item} />}
    />


  )
}