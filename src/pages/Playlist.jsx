import React, {useState, useEffect, useCallback, useMemo, useRef  } from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  TouchableHighlight,
  Alert,
} from "react-native";
import BackArrow from "../Components/Icons/BackArrow";
import Download from "../Components/Icons/Download";
import AnimatedDownloadIcon from "../Components/Icons/AnimatedDownloadIcon";
import AddFriend from "../Components/Icons/addFriend";
import ThreeDots from "../Components/Icons/ThreeDots";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation, useRoute } from "@react-navigation/native";
import icon from "../../assets/LikedSongs/heart.png"
import normIcon from "../../assets/LikedSongs/Frame 4.png";
import { playRef, soundRef } from "../../App.jsx";
import { load, progress, setIsPlaying } from "../../Store/MusicSlice";
import { changePlaylist, setPlaylistplaying,deletePlaylist,removePlaylist } from "../../Store/PlaylistSlice";
import { addPath, addSong, download } from "../../Store/DownloadSlice";
import DownloadButton from "../Components/Icons/DownloadButton";
import { folderPicker } from "../functions/FileFunctions/StoragePicker";
import Info from "../Components/Icons/Info";
import InfoModal from "../Components/InfoModal";
import { addType, changeLoad, changePlaylistPos } from "../../Store/Playdataslice";
import Constants from "expo-constants"
import { setClientID } from "../../Store/UserSlice";
import { initWebSocket } from "../Websocket/websocketfunc";
import { wsRef } from "../Websocket/Websocket";
import { useTheme } from "@react-navigation/native";
import Delete from "../Components/Icons/Delete";
import { showToast } from "../../Store/ToastSlice";
import MediaNotificationManager from "../functions/MediaNotification";
import TrackPlayer, { State, usePlaybackState } from "react-native-track-player";
import { addMusicIntoRNTP } from "../functions/RNTP/addMusicIntoRNTP";

export const initialiseWebsocket = ({id,dispatch,value}) => {
    try{ 
      console.error("reached websocket connection")
      
      //const ws = initWebSocket(`ws://192.168.1.43:80/download-progress`);
      const ws = initWebSocket(`${Constants.expoConfig.extra.WEBSOC}/download-progress`);
      //const ws = initWebSocket(`ws://192.168.1.107:3000/download-progress`);
      //const ws = getWebSocket();
      if (!ws) {
        //console.error("WebSocket failed to initialize.");
        return;
      }

      ws.onopen = () => {
        //console.error("Connected to WebSocket server");
        dispatch(setClientID({ id }));
        ws.send(JSON.stringify({
          type: "register",
          clientId: id,
          value: value
          
        }));
      };
      //const ws = getWebSocket() 
      wsRef.current = ws
    }catch(error){
      console.error(error)
    }
    finally{
      //console.warn("gonna download")
    }
  }

const Playlist = ({}) => {


  const { data, id, playlistNo } = useSelector((state) => state.playlist);
  const [isDisabled,setIsDisabled] =useState(false)
  const [songid,setSongId] =useState(null)
  const userState = useSelector((state) => state.user || {});
  const { user, session, loading, error, clientID } = userState;
  const { colors } = useTheme();

  //This constant gives us the current playback state
  const playbackState = usePlaybackState();
  
  const { index } = useRoute().params;
  const { data: value, pos, seek, isplaying, canLoad} = useSelector((state) => state.data);
  // const user = useSelector((state)=>state.user.user)
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const { song,pos:position ,load:playload } = useSelector(
    (state) => state.playlistload
  );
    
  var currentTrack = soundRef.current ? data && pos >= 0 && pos < data.length ? data[pos] : null : playRef.current? song && position >= 0 && position < song.length ? song[position] : null :
      !soundRef.current? data && pos >= 0 && pos < data.length ? data[pos] : null : song && position >= 0 && position < song.length ? song[position] : null
  //console.error("current track from playlist:", currentTrack,soundRef.current,playRef.current,position,song.length)
  const goToNewPage = () => {
    // //console.warn("DATA: ", JSON.stringify(data, null, 2));
    // data[0].songs?.forEach((song, idx) => {
    //   //console.warn(`Song ${idx + 1}:`, song);
    // });

    // navigation.navigate('PlaylistEdit', { index });
  };

  useEffect(() => {
    if (currentTrack) {
      //console.warn("Updating notification with currentTrack:", currentTrack);
      MediaNotificationManager.showNotification({
        title: currentTrack.title || "Unknown Title",
        artist: currentTrack.uploader || currentTrack.artist || "Unknown Artist",
        artwork: currentTrack.image || "", // albumArt
      });
    }
  }, [currentTrack]);

  const handleDelete = async () => {
    try {
      await dispatch(deletePlaylist({ playlistId: data[index].id, userid: user.id })).unwrap();
      dispatch(removePlaylist(data[index].id));
      navigation.goBack();
    } catch (error) {
      console.error("Failed to delete playlist:", error);
      // alert("Could not delete playlist. Please try again.");
      dispatch(showToast({Title:"Error",message:"Could not delete playlist. Please try again later!"}))
    }
  };

//   const handleDelete = async () => {
//   try {
//     const playlistId = data[index]?.id;
//     if (!playlistId) {
//       throw new Error("Playlist not found");
//     }

//     // Call the delete thunk
//     await dispatch(deletePlaylist({ playlistId, userid: user.id })).unwrap();

//     // Find the actual index of the playlist in data before removing
//     const actualIndex = data.findIndex(pl => pl.id === playlistId);
//     if (actualIndex !== -1) {
//       dispatch(removePlaylist(playlistId));
//     }

//     navigation.goBack();
//   } catch (error) {
//     console.error("Failed to delete playlist:", error);
//     dispatch(showToast({ Title: "Error", message: "Could not delete playlist. Please try again later!" }));
//   }
// };


  //This function is used to play a song, when a song is clicked from playlist
  const handlePressLogic = async(item,pos) => {
    if(isDisabled && songid===item.id) return;
    setIsDisabled(true)
    setSongId(item.id);
    if(playbackState.state == State.Playing){
        await TrackPlayer.pause()
    }
    if(playlistNo!=index){
      dispatch(changePlaylist(index))
      dispatch(addType(data[index].songs))
      dispatch(changePlaylistPos(pos))
      addMusicIntoRNTP({tracks:data[index].songs,resetQueue:true})
      await TrackPlayer.skip(pos);
      await TrackPlayer.play();
      dispatch(setPlaylistplaying({id:index,action:true})) // ✅ start right away
      return;
    }
    if(!playRef.current){
      console.error("not in playref")
      playRef.current = true;
      soundRef.current = false;
      dispatch(addType(data[index].songs))
      dispatch(changePlaylistPos(pos))
      addMusicIntoRNTP({tracks:data[index].songs,resetQueue:true})
      await TrackPlayer.skip(pos);
      await TrackPlayer.play()
      dispatch(setPlaylistplaying({id:index,action:true}))
      return
    }
    await TrackPlayer.skip(pos);
    dispatch(changePlaylistPos(pos))
    console.error("playing....")
    await TrackPlayer.play()
    dispatch(setPlaylistplaying({id:index,action:true}))
    setTimeout(()=>{
      setIsDisabled(false)
    },5000)
  }

  //This function is used to play a song when Play/pause button is clicked
  const togglePlayPause = async () => {
    console.error("Current state:", playbackState);
    if(playbackState.state === State.Playing){
        await TrackPlayer.pause()
    }
    if(playlistNo!=index){
      console.warn("moving to diff playlist")
      dispatch(changePlaylist(index))
      dispatch(addType(data[index].songs))
      addMusicIntoRNTP({tracks:data[index].songs,resetQueue:true})
      await TrackPlayer.play();
      dispatch(setPlaylistplaying({id:index,action:true})) // ✅ start right away
      return;
    }
    // Initialize playlist once
    if (!playRef.current) {
      console.error("not in ref...adding")
      playRef.current = true;
      soundRef.current = false;
      addMusicIntoRNTP({tracks:data[index].songs,resetQueue:true})
      dispatch(addType(data[index].songs))
      await TrackPlayer.play();
      dispatch(setPlaylistplaying({id:index,action:true})) // ✅ start right away
      return;
    }
  
    // Toggle play/pause depending on current state
    if (playbackState.state == State.Playing) {
      console.log("Pausing...");
      await TrackPlayer.pause();
      dispatch(setPlaylistplaying({id:index,action:false}))
    } 
    else if(playbackState.state == State.Ended){
      console.warn("ended state")
      await TrackPlayer.seekTo(0)
      await TrackPlayer.play()
      dispatch(addType(data[index].songs))
      dispatch(setPlaylistplaying({id:index,action:false}))
    }
    else {
      console.log("Playing...");
      await TrackPlayer.play();
      dispatch(setPlaylistplaying({id:index,action:true}))
    }
  };

  const styles = StyleSheet.create({
    Main: {
      flex: 1,
      width: "100%",
    },
    insideMain: {
      paddingHorizontal: 20,
      paddingTop: 20,
      flexDirection: "column",
      flex: 1,
      flexGrow: 1,
    },
    top: {
      width: "100%",
      marginBottom: 20,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
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
      //backgroundColor: "gray",
    },
    imageContainer: {
      width: "100%",
      height: 250,
      //backgroundColor:"pink",
      position: "relative",
      justifyContent: "center",
      alignItems: "center",
    },
    metadata: {
      //backgroundColor:"white",
      paddingTop: 15,
      width: "100%",
    },
    Name: {
      width: "100%",
      minHeight: 80,
      
      //backgroundColor:"white"
    },
    function: {
      width: "100%",
      height: 80,
      //backgroundColor:"white",
      marginTop: 20,
    },
    topFunc: {
      //backgroundColor:"red",
      width: "100%",
      height: "50%",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    bottomFunc: {
      //backgroundColor:"pink",
      width: "100%",
      height: "50%",
      flexDirection: "row",
    },
    topFuncLeft: {
      width: "50%",
      height: "100%",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
    },
    topFuncRight: {
      width: "50%",
      height: "100%",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-end",
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
      borderLeftColor: colors.untext,
      borderTopColor:"transparent",
      borderBottomColor: "transparent",
      borderRightColor: "transparent",
      marginLeft: 2,
    },
    miniPlayPauseButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.text,
      justifyContent: "center",
      alignItems: "center",
      marginHorizontal: 8,
    },
    miniPauseLine: {
      width: 3,
      height: 12,
      backgroundColor: colors.untext,
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
      borderColor: colors.text,
      borderWidth: 1,
    },
    card: {
      width: "100%", //95
      alignSelf: "center",
      borderRadius: 20,
      paddingVertical: 10,
      //paddingHorizontal:0,
      height:80,
      marginVertical: 5,
      flexDirection: "row",
      alignItems: "center",
      //borderRadius: 25,
          // /backgroundColor: "rgba(105, 49, 49, 0.2)",
         
         
          
      // justifyContent:"center"
      // backgroundColor: "rgba(50,50,50,0.5)",
    },
    cardImage: {
      width: 50,
      height: 50,
      borderRadius: 8,
      marginRight: 15,
    },
    artistName: {
      color: colors.text,
      fontSize: 12,
      fontWeight: "300",
      marginTop: 2,
    },
    songName: {
      color: colors.text,
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
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    info: {
      width: "100%",
      alignItems: "flex-end",
      paddingRight: 25,
    },
  });
  const Pname = data[index].name;
  const Description = data[index].desc;
  const Uname = user?.user_metadata.username;
  const minHeight = 1000

  const handleDownload = async () => {
    //console.warn("reached download function");
    const id = Math.random().toString(36).slice(2, 8);
    //console.warn(data[index]?.songs, clientID);
    initialiseWebsocket({id:user?.id,dispatch:dispatch,value:"download"});
    const path = await folderPicker();
    //console.warn(path);
    dispatch(addPath({ path: path }));
    dispatch(addSong({ data: data[index]?.songs }));
    dispatch(download({ data: data[index]?.songs, ClientId: user?.id }));

  };
  return (
     <FlatList
      data={data[index].songs}
      //keyExtractor={(item) => item.id.toString()}
      keyExtractor={(item, idx) => (item?.id ? item.id.toString() : `key-${idx}`)}
      renderItem={({item,index}) => <DataList styles={styles} item={item} handleCardPress={handlePressLogic} index={index} colors={colors} />

      }
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={() => (
        <Information
          styles={styles}
          Pname={Pname}
          Uname={Uname}
          data={data[index]}
          navigation={navigation}
          togglePlayPause={togglePlayPause}
          handleDownload={handleDownload}
          DownloadButton={DownloadButton}
          Description={Description}
          goToNewPage={goToNewPage}
          handleDelete={handleDelete}
          index={index}
          colors={colors}
          playbackState={playbackState.state}
        />
      )}
      initialNumToRender={10}
      windowSize={10}
      getItemLayout={(data, index) => ({ length: 80, offset: 80 * index, index })}
    />
  );
};

export default Playlist;


const DataList = ({ styles, item ,handleCardPress,index,colors}) => {
  //console.warn("item", item,index);
  return (
    <TouchableHighlight
      style={[styles.card,{paddingHorizontal:20}]}
      onPress={() => handleCardPress(item,index)}

      underlayColor="rgba(128,128,128,0.2)"
      activeOpacity={0.7}
    >
      <View
        style={{width:"100%",height:80,flexDirection:"row",justifyContent:"center",alignItems:"center",paddingHorizontal:5}}
      >
        <Image source={{ uri: item.image }} style={styles.cardImage} />
        <View style={styles.textContainer}>
          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.songName}>
            {item.title}
          </Text>
          <Text style={styles.artistName}>{item.uploader || item.artist}</Text>
        </View>
        <View style={styles.dotsContainer}>
          <ThreeDots fill ={colors.text} />
        </View>
      </View>
    </TouchableHighlight>
  );
};

const Information = ({
  styles,
  Pname,
  Uname,
  data,
  navigation,
  togglePlayPause,
  handleDownload,
  Description,
  goToNewPage,
  handleDelete,
  index,
  colors,
  playbackState
}) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const [modalVisible, setModalVisible] = useState(false);
  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };
  return (
    <View style={{ width: "100%",paddingHorizontal:20,paddingTop:10 }}>
      <View style={styles.top}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <BackArrow fill = {colors.text} />
        </TouchableOpacity>

        {/* <View style={styles.info}>
          <TouchableOpacity onPress={openModal}>
            <Info width={24} height={24} fill="#e3e3e3" />
          </TouchableOpacity>
        </View> */}

        {/* Info Modal*/}
        <InfoModal
          visible={modalVisible}
          onClose={closeModal}
          playlistName={Pname} // Replace with dynamic data if necessary
          playlistDescription={Description} // Replace with dynamic data if necessary
          onEdit={() => console.log("Edit pressed")}
        />

        <DownloadButton colors={colors} />
      </View>
      {/* <View
            style={styles.search}
        >

        </View> */}
      <View style={styles.metadata}>
        <View style={styles.imageContainer}>
          
          <Image
            source={index == 0 ? data.songs?.length > 0 ? data.image ? { uri: data.image } : { uri: data.songs[0]?.image } :
              icon : data.songs?.length > 0 ? data.image ? { uri: data.image } : { uri: data.songs[0]?.image } : normIcon}
            style={styles.albumArt}
          // fallback if user image fails to load
          />
        </View>
        <View style={styles.Name}>
          <Text
            style={{
              fontSize: 27,
              fontWeight: "600",
              color: colors.text,
              marginBottom: 8,
              //backgroundColor:"red"
              
            }}
          >
            {Pname}
          </Text>
          <Text
            style={{
              fontSize: 15,
              fontWeight: "600",
              color: colors.text,
              marginBottom: 4,
            }}
          >
            {Uname}
          </Text>
          <Text style={{ fontSize: 10, fontWeight: "600", color: colors.text }}>
            {formatTime(data.Time)} min
          </Text>
        </View>
        <View style={styles.function}>
          <View style={styles.topFunc}>
            <View style={styles.topFuncLeft}>
              <TouchableOpacity
                style={[styles.funcbutton, { marginRight: 15 }]}
                onPress={() => handleDownload()}
              >
                <View>
                  <Download fill = {colors.text} />
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.funcbutton, { marginRight: 15 }]}
                // onPress={() => navigation.navigate("InviteCollab")}


              >
                <AddFriend  fill = {colors.text} />
              </TouchableOpacity>
           {/**   <TouchableOpacity
                style={[styles.funcbutton, { marginRight: 15 }]}
                onPress={goToNewPage}
              >
                <ThreeDots  fill = {colors.text} />
              </TouchableOpacity> */}

              <TouchableOpacity
                style={[styles.funcbutton, { marginRight: 15 }]}
                onPress={() => {
                  Alert.alert(
                    "Delete Playlist",
                    "Are you sure you want to delete this playlist?",
                    [
                      { text: "Cancel", style: "cancel" },
                      { text: "Delete", style: "destructive", onPress: handleDelete }
                    ]
                  );
                }}
              >
                <Delete fill={colors.text} />
              </TouchableOpacity>

            </View>
            <View style={styles.topFuncRight}>
              <TouchableOpacity
                onPress={() => togglePlayPause()}
                style={styles.miniPlayPauseButton}
              >
                {data.isPlaying && (playbackState === State.Playing || playbackState === State.Buffering) ? (
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
          <View style={styles.bottomFunc}></View>
        </View>
      </View>
    </View>
  );
};