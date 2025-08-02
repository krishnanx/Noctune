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
import { playRef, soundRef } from "../functions/MusicLoaders/music";
import { load, progress, setIsPlaying } from "../../Store/MusicSlice";
import { changePlaylist, setPlaylistplaying } from "../../Store/PlaylistSlice";
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




const Playlist = () => {


  const { data, id, playlistNo } = useSelector((state) => state.playlist);
  const [isDisabled,setIsDisabled] =useState(false)
  const [songid,setSongId] =useState(null)
  const userState = useSelector((state) => state.user || {});
  const { user, session, loading, error, clientID } = userState;

  const { index } = useRoute().params;
  const {
    data: value,
    pos,
    seek,
    isplaying,
  } = useSelector((state) => state.data);
  // const user = useSelector((state)=>state.user.user)
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const goToNewPage = () => {
    // //console.warn("DATA: ", JSON.stringify(data, null, 2));
    // data[0].songs?.forEach((song, idx) => {
    //   //console.warn(`Song ${idx + 1}:`, song);
    // });

    // navigation.navigate('PlaylistEdit', { index });
  };

  const handlePressLogic = async(item,pos) => {
    if(isDisabled && songid===item.id) return;
    setIsDisabled(true)
    setSongId(item.id);
    console.warn(item)
    if (!playRef.current) {
      //console.warn("no current songs")
      if (playlistNo != index) {
        dispatch(changePlaylist(index))
      }
      //console.warn(data[index].songs)
      dispatch(addType(data[index].songs))
      dispatch(changePlaylistPos({value:0,jump:pos}));
      dispatch(changeLoad(false))
      dispatch(load(false));
      setTimeout(() => {
        dispatch(changeLoad(true))
      }, 500);
      dispatch(setPlaylistplaying({ action: true, id: index }));
      dispatch(setIsPlaying(true));

    } else {
      //console.warn("reached playlist toggle");
      //console.warn(playlistNo, index);
      if (playlistNo != index) {
        dispatch(changePlaylist(index))  
        //await playRef.current.playAsync();
      }
      dispatch(addType(data[index].songs))
      dispatch(changePlaylistPos({value:0,jump:pos}));
      dispatch(changeLoad(false))
      dispatch(load(false));
      dispatch(setPlaylistplaying({ action: true, id: index }));

      setTimeout(() => {
        dispatch(changeLoad(true))
      }, 500);

      
      // else if (isplaying) {
      //   //console.warn("isplaying", isplaying)
      //   await playRef.current.pauseAsync();
      //   dispatch(setPlaylistplaying({ action: false, id: index }));
      //   dispatch(progress(-1));
      //   //updatePlaybackState(false, seek); //added
      // } else {
      //   //console.warn("isplaying", isplaying)
      //   await playRef.current.playAsync(); // resumes from last position
      //   dispatch(setPlaylistplaying({ action: true, id: index }));
      //   dispatch(progress(-1));
      //   //updatePlaybackState(true, seek); //added
      // }
      
      
    }
    dispatch(setIsPlaying(true));
    
    setTimeout(()=>{
      setIsDisabled(false)
    },5000)
}

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
      height: 80,
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
      //paddingHorizontal:0,
      height:80,
      marginVertical: 5,
      flexDirection: "row",
      alignItems: "center",
      //borderRadius: 25,
          // /backgroundColor: "rgba(128,128,128,0.2)",
         
         
          
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
      color: "white",
      fontSize: 12,
      fontWeight: "300",
      marginTop: 2,
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
  const togglePlayPause = async () => {

    if (!playRef.current) {
      //console.warn("no current songs")
      if (playlistNo != index) {
        dispatch(changePlaylist(index))
      }
      //console.warn(data[index].songs)
      dispatch(addType(data[index].songs))
      dispatch(changeLoad(false))
      dispatch(load(false));
      setTimeout(() => {
        dispatch(changeLoad(true))
      }, 500);
      dispatch(setPlaylistplaying({ action: true, id: index }));
      dispatch(setIsPlaying(true));

    } else {
      //console.warn("reached playlist toggle");
      //console.warn(playlistNo, index);
      if (playlistNo != index) {
        dispatch(changePlaylist(index))
        dispatch(addType(data[index].songs))
        dispatch(changeLoad(false))
        dispatch(load(false));
        dispatch(setPlaylistplaying({ action: true, id: index }));

        setTimeout(() => {
          dispatch(changeLoad(true))
        }, 500);

        //await playRef.current.playAsync();
      }
      else if (isplaying) {
        //console.warn("isplaying", isplaying)
        await playRef.current.pauseAsync();
        dispatch(setPlaylistplaying({ action: false, id: index }));
        dispatch(progress(-1));
        //updatePlaybackState(false, seek); //added
      } else {
        //console.warn("isplaying", isplaying)
        await playRef.current.playAsync(); // resumes from last position
        dispatch(setPlaylistplaying({ action: true, id: index }));
        dispatch(progress(-1));
        //updatePlaybackState(true, seek); //added
      }

      dispatch(setIsPlaying("toggle"));
    }
  };

  const initialiseWebsocket = (id) => {
    try{ //console.error("reached websocket connection")
     
      //const ws = initWebSocket(`ws://192.168.1.7:8000/download-progress`);
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
          value: "hi"
          
        }));
      };
      //const ws = getWebSocket() 
      wsRef.current = ws
    }catch(error){
      //console.error(error)
    }

  }

  const handleDownload = async () => {
    //console.warn("reached download function");
    const id = Math.random().toString(36).slice(2, 8);
    //console.warn(data[index]?.songs, clientID);
    initialiseWebsocket(id);
    const path = await folderPicker();
    //console.warn(path);
    dispatch(addPath({ path: path }));
    dispatch(addSong({ data: data[index]?.songs }));
    dispatch(download({ data: data[index]?.songs, ClientId: id }));

  };
  return (
    <ScrollView
      style={styles.Main}
      contentContainerStyle={{
        alignItems: "center",
        paddingBottom: 100,
        paddingHorizontal: 20,
        paddingTop: 20,
        height: 630 + (data[index].songs?.length * 90),
        //backgroundColor: "white"
      }}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      overScrollMode="never"
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
        Description={Description}
        goToNewPage={goToNewPage}
        index={index}
      />
      <Flatlist data={data[index].songs || []} 
          styles={styles} 
          handleCardPress={handlePressLogic} 
          
      />
    </ScrollView>
  );
};

export default Playlist;


const Information = ({
  styles,
  Pname,
  Uname,
  data,
  navigation,
  togglePlayPause,
  handleDownload,
  DownloadButton,
  Description,
  goToNewPage,
  index
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
    <View style={{ width: "100%" }}>
      <View style={styles.top}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <BackArrow />
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

        <DownloadButton />
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
              color: "white",
              marginBottom: 8,
            }}
          >
            {Pname}
          </Text>
          <Text
            style={{
              fontSize: 15,
              fontWeight: "600",
              color: "white",
              marginBottom: 4,
            }}
          >
            {Uname}
          </Text>
          <Text style={{ fontSize: 10, fontWeight: "600", color: "white" }}>
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
                  <Download />
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.funcbutton, { marginRight: 15 }]}
                // onPress={() => navigation.navigate("InviteCollab")}


              >
                <AddFriend />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.funcbutton, { marginRight: 15 }]}
                onPress={goToNewPage}
              >
                <ThreeDots />
              </TouchableOpacity>
            </View>
            <View style={styles.topFuncRight}>
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
          <View style={styles.bottomFunc}></View>
        </View>
      </View>
    </View>
  );
};
const DataList = ({ styles, item ,handleCardPress,index}) => {
  //console.warn("item", item,index);
  return (
    <TouchableHighlight
      style={styles.card}
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
          <ThreeDots />
        </View>
      </View>
    </TouchableHighlight>
  );
};
const Flatlist = ({ data, styles,handleCardPress }) => {
  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id.toString()}
      scrollEnabled={false}
      renderItem={({item,index}) => <DataList styles={styles} item={item} handleCardPress={handleCardPress} index={index} />

      }
      showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
    />
  );
};
