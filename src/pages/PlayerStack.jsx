// THIS IS EXTENDED PLAYER PAGE (BIG)
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  Dimensions,
  Animated,
  TouchableWithoutFeedback,
  Button,
  ImageBackground,
  ScrollView
} from "react-native";
import { useTheme } from "@react-navigation/native";
import { SkipBack, SkipForward } from "react-native-feather";
import Icon from "react-native-vector-icons/FontAwesome";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import {
  changePos,
  progress,
  setIsPlaying,
  load,
  isLoadedFromAsyncStorage,
  isplaying,
  setSearchedMusic
} from "../../Store/MusicSlice";
import { playRef, soundRef } from "../../App.jsx";
// import { addMusicinPlaylist } from "../../Store/PlaylistSlice";
// import MarqueeText from "react-native-marquee";
// import TextTicker from "react-native-text-ticker";
import Marquee from "../Components/Marquee";
import SleepTimerModal from "../Components/SleepTimerModal";
import TimerIcon from "../Components/Icons/TimerIcon.jsx";
import ThreeDots from "../Components/Icons/ThreeDots.jsx";
import ChevronForward from "../Components/Icons/ChevronForward";
import Replay from "../Components/Icons/Replay";
const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;
import { changePlaylistPos } from "../../Store/Playdataslice.js";
import MediaNotificationManager from "../functions/MediaNotification";
import { showNotification } from "../functions/MediaNotification";
import { setPlaylistplaying } from "../../Store/PlaylistSlice";
import WaveformVisualizer from "../Components/WaveformVisualizer";
import Lyrics from "./Lyrics.jsx";
import {setFullLyrics,setCurrentSongId} from "../../Store/LyricsSlice.js";
import { changeLoad } from "../../Store/Playdataslice.js";
import { addMusictoPlaylist,addMusicinPlaylist,addPlaylist ,AddNewPlaylist,removeMusicFromPlaylist} from "../../Store/PlaylistSlice";
import { current } from "@reduxjs/toolkit";
import TrackPlayer, { State, usePlaybackState,useActiveTrack } from 'react-native-track-player';
import { setupPlayer } from "../functions/player.js";
//import { BlurView } from "expo-blur";
import Constants from "expo-constants"
const PlayerStack = () => {
  const { colors } = useTheme();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [liked, setLiked] = useState(false);
  const [lastPress, setLastPress] = useState(0);
  const DOUBLE_PRESS_DELAY = 800;
  const [sleepTimerVisible, setSleepTimerVisible] = useState(false);
  const { isTimerActive } = useSelector((state) => state.sleepTimer);
  const { data: array, id, playlistNo } = useSelector((state) => state.playlist);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const lastPressRef = useRef(0);
  const singlePressTimeoutRef = useRef(null);
  const { data, pos, seek, isplaying, canLoad, isLoadedFromAsyncStorage, searchedMusic } =
      useSelector((state) => state.data);
  const { song, pos: position, seek: seekk, load: newLoad } = useSelector(
    (state) => state.playlistload
  );
  //console.warn("Load:",load)
  console.warn("currentTrack", currentTrack)
  //const mediaListenersInitialized = useRef(false);

  const [lyrics, setLyrics] = useState(null);
  const [lyricsLoading, setLyricsLoading] = useState(true);

  
  const fullLyrics = useSelector(state => state.lyrics?.fullLyrics);
  //const currentSongId = useSelector(state => state.lyrics?.currentSongId);

  // Function to generate a unique song ID
  const generateSongId = (track) => {
    if (!track) return null;
    const artist = track.uploader || 'Unknown Artist';
    const title = track.title || 'Unknown Song';
    return `${artist}-${title}`.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, '-');
  };

  const playbackState = usePlaybackState();
  const [currentTrack, setCurrentTrack] = useState(null);
  const getCurrentTrackInfo = async () => {
    try {
      const track = await TrackPlayer.getActiveTrack(); 
      if (track) {
        setCurrentTrack(track); // store track in state
        console.error(track)
      } else {
        setCurrentTrack(null);
      }
    } catch (error) {
      console.error("Error getting current track info:", error);
      setCurrentTrack(null);
    }
  };

  useEffect(() => {
    getCurrentTrackInfo();

    // optional: update when track changes
    const listener = TrackPlayer.addEventListener("playback-track-changed", async () => {
      await getCurrentTrackInfo();
    });

    return () => {
      listener.remove();
    };
  }, []);

  useEffect(() => {
    const fetchLyrics = async () => {
      setLyricsLoading(true);
      setLyrics(null); // Clear previous lyrics
      
      try {
        
        const artist = currentTrack.uploader;
        const title = currentTrack.title;
        console.warn(artist)
        console.warn(title)
        
        // Clean up the search terms (remove special characters, extra spaces)
        const cleanArtist = artist.replace(/[^\w\s]/gi, '').replace(/\s+/g, '-').toLowerCase();
        const cleanTitle = title.replace(/[^\w\s]/gi, '').replace(/\s+/g, '-').toLowerCase();
        
        // Construct Genius URL
        const geniusUrl = `https://genius.com/${cleanArtist}-${cleanTitle}-lyrics`;
        console.warn(geniusUrl)
        console.error("Lyrics Request made:");
        
        
        const response = await fetch(`${Constants.expoConfig.extra.SERVER}/api/lyrics`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            url: geniusUrl,
            artist: artist,
            title: title
          })
        });

        if (!response.ok) {
          throw new Error('Failed to fetch lyrics');
        }

        const lyricsData = await response.text();
        //console.error(lyricsData);
        
        if (lyricsData && lyricsData.trim()) {
            const songId = generateSongId(currentTrack);
            dispatch(setCurrentSongId(songId));
            dispatch(setFullLyrics(lyricsData));     //store full lyrics data to redux
            const previewLyrics = lyricsData.split('\n').slice(0, 8).join('\n') + '\n...';   //preview only first 8 lines
          setLyrics(previewLyrics);             //to see preview lyrics
        } else {
          setLyrics("Lyrics not found for this song");
        }
        
      } catch (error) {
        console.error('Error fetching lyrics:', error);
        setLyrics("Unable to load lyrics at this time");
      } finally {
        setLyricsLoading(false);
      }
    };

    fetchLyrics();
  }, [canLoad, data, pos, song, position]); 


const handleFetchFullLyrics = async () => {

    if (fullLyrics) {
      return fullLyrics;
    }
    return lyrics || 'Lyrics not available';
  };

  {
    /**If you ever want it even safer (rare), you can do [pos, data[pos]?.url]
    (so it depends on the exact song url changing).
    But in 99% cases, [pos, data.length] is enough for you. */
    //(pos, data.length), soundRef.current
  }
  useEffect(() => {
    console.log("sec:", seek);
    console.log("isPlaying?...:", isplaying);
  }, [seek, isplaying]);

  const togglePlayPauseRef = useRef(null);

  const togglePlayPause = async () => {
    console.warn("toggle")
    console.warn(playbackState)
    console.warn(State.Playing)
    
    if (playbackState.state === State.Playing) {
      await TrackPlayer.pause();
    } else {
      await TrackPlayer.play();
    }
  };

  const replaySound = async () => {
    
    if (soundRef.current) {
      await soundRef.current.setPositionAsync(0);
      dispatch(setIsPlaying(true))
      await soundRef.current.playAsync();
      
    }
    else if (playRef.current) {
      await playRef.current.setPositionAsync(0);
      dispatch(setPlaylistplaying({ action:true, id: playlistNo }))
      await playRef.current.playAsync();
      
    }
    dispatch(progress(0));
    
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const toggleModal = () => {
    setIsModalVisible((prev) => !prev);
  };


  const togglePlayerSize = () => {

    navigation.goBack();

  };


  let singlePressTimeout = null;

  const handlePress = async (value) => {

    if(soundRef.current==null){
        dispatch(changePlaylistPos({value:value,jump:-1}));
        dispatch(setSearchedMusic(true))
        dispatch(changeLoad(false));
        dispatch(changeLoad(true));
    }else{
      dispatch(changePos(value));
      dispatch(setSearchedMusic(true))
      dispatch(load(false));
      dispatch(load(true));
      
      }
  };

  const TOTAL_DURATION = data ? data[pos]?.duration : 0;

  const styles = StyleSheet.create({
    Main: {
      //backgroundColor: colors.background,
      //flex:1,
      width: "100%",
      alignItems: "center",
      justifyContent: "space-between",
      paddingBottom: 80,
      //height: "100%",
      zIndex:1,
    },
    miniPlayer: {
      flex: 1,
      position: "absolute",
      // bottom: 100,
      width: "95%",
      height: "7%",
      backgroundColor: "gray",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 7, // Inner space
      margin: 10, // Outer space
      borderRadius: 7,
      borderTopWidth: 1,
      borderTopColor: "rgba(255,255,255,0.1)",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 5,
      zIndex: 100,
    },
    miniPlayerInfo: {
      flexDirection: "row",
      alignItems: "center",
    },
    miniPlayerThumbnail: {
      width: 43,
      height: 43,
      borderRadius: 4,
      marginRight: 12,
      backgroundColor: "black", // keep for debug, remove later
    },

    miniPlayerTextContainer: {
      flex: 1,
    },
    miniPlayerTitle: {
      color: colors.text,
      fontSize: 14,
      fontWeight: "bold",
      marginBottom: 2,
      width: 180,
    },
    miniPlayerArtist: {
      color: colors.text,
      fontSize: 12,
    },
    miniPlayerControls: {
      flexDirection: "row",
      alignItems: "center",
    },
    progressBarContainer: {
      position: "absolute",
      bottom: 200,
      width: "90%",
      alignSelf: "center",
    },
    progressBarBackground: {
      width: "100%",
      height: 3,
      backgroundColor: colors.text,
      borderRadius: 2.5,
      overflow: "hidden",
    },
    progressBarFill: {
      height: 3,
      backgroundColor: colors.text ?? colors.primary,
    },
    miniProgressBar: {
      position: "absolute",
      top: 54,
      left: 7,
      right: 3,
      height: 3,
      zIndex: 10,
    },
    miniProgressBarFill: {
      height: 2,
      backgroundColor: colors.text,
      borderRadius: 3,
    },
    timeContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 5,
    },
    timeText: {
      fontSize: 12,
      color: "white",
    },
    controlsContainer: {
      paddingTop:50,
      width: "100%",
      height: 120,
      flexDirection: "row",
      alignItems: "center",
      //backgroundColor:"pink"
    },
    controls: {
      width: "100%",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-around",
      paddingHorizontal: 10,
    },
    playPauseButton: {
      width: 70,
      // position: "absolute",
      height: 70,
      // top: 50,
      borderRadius: 35,
      backgroundColor: "white",
      justifyContent: "center",
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 4.65,
      elevation: 8,
    },
    playpause: {
      flexDirection: "row",
      alignItems: "center",
    },
    miniPlayPauseButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: "white",
      justifyContent: "center",
      alignItems: "center",
      marginHorizontal: 8,
      position: "absolute",
      right: 0,
    },
    triangle: {
      width: 0,
      height: 0,
      backgroundColor: "transparent",
      borderStyle: "solid",
      borderLeftWidth: 18,
      borderRightWidth: 0,
      borderBottomWidth: 12,
      borderTopWidth: 12,
      borderLeftColor: "black",
      borderTopColor: "transparent",
      borderBottomColor: "transparent",
      borderRightColor: "transparent",
      marginLeft: 4,
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
    pauseLinesContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },
    pauseLine: {
      width: 4,
      height: 20,
      backgroundColor: "black",
      marginHorizontal: 4,
      borderRadius: 2,
    },
    miniPauseLine: {
      width: 3,
      height: 12,
      backgroundColor: "black",
      marginHorizontal: 2,
      borderRadius: 1,
    },
    skipButton: { /*top: 65,*/ marginHorizontal: 20 },
    container: {
      position: "absolute",
      top: 490,
      left: 25,
      alignItems: "left",
      flexDirection: "row",
      height: 90,
      alignItems: "center",
    },
    songName: {
      fontSize: 18,
      top: 20,
      fontWeight: "bold",
      color: "white",
    },
    progressBarTouchArea: {
      height: 30, // Increased height for better touch target
      justifyContent: "flex-end",
    },
    singerName: {
      position: "relative",
      top: 20,
      fontSize: 18,
      fontWeight: "300",
      color: "white",
      marginTop: 2,
    },
    albumArt: {
      position: "absolute",
      top: 120,
      width: 340,
      height: 340,
      borderRadius: 20,
      marginBottom: 20,
      backgroundColor: "gray",
    },
    heartIcon: {
      position: "absolute",
      top: 510,
      left: 140,
    },
    modalOverlay: {
      flex: 1,
      justifyContent: "flex-end",
      //backgroundColor: "rgba(98, 92, 92, 0.5)", // backdrop blur
    },
    modalContent: {
      height: "50%", // half the screen
      backgroundColor: colors.text,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
      padding: 25,
      backgroundColor: colors.card,
      gap: 15,
      marginHorizontal:"4%"
    },
    option: {
      fontSize: 18,
      marginVertical: 10,
      color: colors.text,
    },
    optionTouch: {
      width: "100%",
    },
    optionTouch: {
      width: "100%",
    },
    button: {
      padding: 6,
      // position: "absolute",
      // top: 35,
      // left: 30,
      // zIndex: 10,
    },
    sleepTimerButton: {
      flexDirection: "row",
      alignItems: "center",
      padding: 10,
    },
    sleepTimerText: {
      marginLeft: 8,
      fontSize: 16,
      color: "#888",
    },
    activeTimerText: {
      color: "#4f8ef7",
      fontWeight: "500",
    },
    bgImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  imageStyle: {
    resizeMode: "cover",
    transform: [{ scale: 1.5 }],
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  scrollViewContent: {
    paddingBottom: 80,
    flexGrow: 1,
  },
  });

  // Render the full player
  return (
    <View style ={{flex:1}}>
    <Animated.View
      style={{
        backgroundColor: "white", // or your styling
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        overflow: "hidden",
      }}
    >
      <ImageBackground
          source={{uri: currentTrack?.artwork}}
          style={StyleSheet.absoluteFill}
          imageStyle={styles.imageStyle}
          blurRadius={50} 
        >
        <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.1)' }]} />
      </ImageBackground>
       <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
      <View style={styles.Main}>
        <View
          style={{
            paddingHorizontal: 20,
            paddingTop: 20,
            width: "100%",
            flexDirection: "row",
            height: 60,
            justifyContent: "space-between",
            alignItems: "center",
            zIndex: 10,
          }}
        >
          <TouchableOpacity
            style={[
              styles.button,
              {
                transform: [{ rotate: "90deg" }],
                justifyContent: "center",
                alignItems: "center",
              },
            ]}
            onPress={togglePlayerSize}
          >
            <ChevronForward width={28} height={28} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => toggleModal()}>
            <ThreeDots height={28} width={28} />
          </TouchableOpacity>
        </View>
        {/* <WaveformVisualizer ytUrl={currentTrack?.url} seconds={seek} /> */}
        <Metadata
          data={
                currentTrack
                  ? { title: currentTrack.title, artist: currentTrack.artist, image:currentTrack.artwork }
                  : { title: "Unknown Song", uploader: "Unknown Artistt" }
          }
          colors={colors}
          liked={liked}
          setLiked={setLiked}
          seek={seek}
          TOTAL_DURATION={TOTAL_DURATION}
          formatTime={formatTime}
          styles={styles}
          dispatch={dispatch}
        />
        <View>
           <View style={{ height: 550 }} />
            <WaveformVisualizer ytUrl={currentTrack?.url} seconds={seek}/>
            <Controls
              togglePlayPause={togglePlayPause}
              playbackState={playbackState.state}
              styles={styles}
              colors={colors}
              dispatch={dispatch}
              changePos={changePos}
              handlePress={handlePress}
              Replay={Replay}
              TimerIcon={TimerIcon}
              replaySound={replaySound}
              setSleepTimerVisible={setSleepTimerVisible}
              isTimerActive={isTimerActive}
            />
        </View>
        {/* <View paddingTop="60">
          {lyrics && lyrics !== "Lyrics not found for this song" && lyrics !== "Unable to load lyrics at this time" && (
            <Lyrics lyrics={lyrics} loading={lyricsLoading} onFetchFullLyrics={handleFetchFullLyrics}/>
          )}
        </View> */}

        <SleepTimerModal
          visible={sleepTimerVisible}
          onClose={() => setSleepTimerVisible(false)}
          soundRef={soundRef}
        />

        <Custom_modal
          data={
                currentTrack
                  ? { title: currentTrack.title, artist: currentTrack.artist,image:currentTrack.artwork }
                  : { title: "Unknown Song", uploader: "Unknown Artist" }
              }
          isModalVisible={isModalVisible}
          styles={styles}
          toggleModal={toggleModal}
          navigation={navigation}
        />
      </View>
      </ScrollView>
    </Animated.View>
    </View>
  );
};

export default PlayerStack;

const Metadata = ({
  data,
  colors,
  seek,
  TOTAL_DURATION,
  formatTime,
  styles,
  dispatch,
}) => {
  // Add state for tracking drag operation
  const [isDragging, setIsDragging] = useState(false);
  const [userSeek, setUserSeek] = useState(seek);
  const [userSetPosition, setUserSetPosition] = useState(false);

   useEffect(() => {
    if (!isDragging && (!userSetPosition || Math.abs(seek - userSeek) > 5)) {
      setUserSeek(seek);
    }
  }, [seek, isDragging, userSetPosition]);

  
  const playlists = useSelector(state => state.playlist?.data || []);  //fetch playlists 
  const {user} = useSelector(state => state.user)
  const likedPlaylist = playlists.find(p => p.id === 0); // search for playlists with  id:0  ie Liked Songs
  const likedSongs = likedPlaylist?.songs || [];         //get the song from the liked songs playlist
  const isLiked = likedSongs.some(song => song.id === data.id); // checking if song is liked already

 
  const handleLikePress = async () => {
    const upscaledSong = {
      ...data,
      image: data.image?.replace(/w\d+-h\d+/, "w500-h500"),
    };

    const isAlreadyLiked = likedSongs.some(song => song.id === data.id);

    if (isAlreadyLiked) {   //Unliking a song
      try {
        dispatch(removeMusicFromPlaylist({ id: 0, musicId: data.id }));  //remove from redux
      } catch (error) {
        console.error("Error removing song from liked playlist:", error);
      }
    } else { //Like a soong
      try {
        if (!likedPlaylist) {
          const newLiked = {
            id: 0,
            name: "Liked Songs",
            desc: "Your favorite tracks",
            songs: [upscaledSong],
            image: upscaledSong.image || null,
            Time: upscaledSong.duration || 0,
            isPlaying: false,
          };

          await dispatch(AddNewPlaylist({ data: newLiked, userid: user.id }));   //if Liked song playlist doesnt exist,create one with current song
          dispatch(addPlaylist({ playlist: newLiked }));
        } else {
          dispatch(addMusicinPlaylist({ id: 0, music: upscaledSong }));  //if Liked songs playlist exist,add the song
          
          dispatch(addMusictoPlaylist({    //send add req to backend
            playlist: likedPlaylist,
            user: user.id,
            music: upscaledSong
          }));
        }
      } catch (error) {
        console.error("Error adding song to liked playlist:", error);
        // Optionally revert the Redux state 
        dispatch(removeMusicFromPlaylist({ id: 0, musicId: data.id }));
      }
    }
  };
  return (
    <>  
    {/* {console.warn(data)} */}
      <Image source={{ uri: data?.image }} style={styles.albumArt} />
      <View style={styles.container}>
        <View style={{ height: "100%" }}>
          <View style={{ width: 300 }}>
            <Text style={styles.songName}>{data?.title || "Unknown Song"}</Text>
          </View>
          <Text style={styles.singerName}>
            {data?.artist || "Unknown Artist"}
          </Text>
        </View>

        <TouchableOpacity onPress= {handleLikePress}>
          <Icon
            name={isLiked ? "heart" : "heart-o"}
            size={28}
            color={isLiked ? colors.text : "white"}
          />
        </TouchableOpacity>
        
      </View>
    </>
  );
};

const Controls = ({
  togglePlayPause,
  playbackState,
  styles,
  colors,
  dispatch,
  changePos,
  handlePress,
  replaySound,
  TimerIcon,
  Replay,
  setSleepTimerVisible,
  isTimerActive,

}) => {
  return (
    <View style={styles.controlsContainer}>
      <View style={styles.controls}>
        <View>
          <TouchableOpacity onPress={() => setSleepTimerVisible(true)}>
            <TimerIcon
              name="timer"
              color={isTimerActive ? "#F5DEB3" : "white"}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.playpause}>
          <TouchableOpacity
            style={styles.skipButton}
            onPress={() => {
              handlePress(-1);
            }}
          >
            <SkipBack width={35} height={35} stroke={"white"} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.playPauseButton}
            onPress={() => togglePlayPause()}
          >
            {playbackState == State.Playing || playbackState == State.Buffering? (
              <View style={styles.pauseLinesContainer}>
                <View style={styles.pauseLine} />
                <View style={styles.pauseLine} />
              </View>
            ) : (
              <View style={styles.triangle} />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.skipButton}
            onPress={() => {
              handlePress(+1);
            }}
          >
            <SkipForward width={35} height={35} stroke={"white"} />
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity onPress={() => replaySound()}>
            <Replay height={24} width={24} fill={"white"} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const Custom_modal = ({
  data,
  isModalVisible,
  styles,
  toggleModal,
  dispatch,
  navigation,
}) => {
  // The data prop already contains the correct current track data
  // that's being passed from PlayerStack, so we can use it directly

  return (
    <Modal
      transparent
      visible={isModalVisible}
      animationType="slide"
      onRequestClose={() => toggleModal()}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPressOut={() => toggleModal()}
      >
        <View style={styles.modalContent}>
          <View style={[styles.miniPlayerInfo, { marginBottom: 30 }]}>
            <Image
              source={{ uri: data?.image ?? null }}
              style={styles.miniPlayerThumbnail}
            />
            <View style={styles.miniPlayerTextContainer}>
              <Text style={styles.miniPlayerTitle} numberOfLines={1}>
                {data?.title || "Unknown Title"}
              </Text>
              <Text style={styles.miniPlayerArtist} numberOfLines={1}>
                {data?.uploader || data?.artist || "Unknown Artist"}
              </Text>
            </View>
          </View>

          <TouchableOpacity style={styles.optionTouch}>
            <Text style={styles.option}>Add to Liked Songs</Text>
          </TouchableOpacity>


          <TouchableOpacity
            style={styles.optionTouch}
            onPress={() => {
              toggleModal();
              navigation.navigate("Playchoose", { index: data });
            }}
          >
            <Text style={styles.option}>Add to playlist</Text>
          </TouchableOpacity>

          {/* <TouchableOpacity style={styles.optionTouch}>
            <Text style={styles.option}>Media Quality</Text>
          </TouchableOpacity> */}

          <TouchableOpacity style={styles.optionTouch}>
            <Text style={styles.option}>Share</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionTouch}
          // onPress={() => {
          //   toggleModal();
          //   dispatch({ type: "ADD_TO_QUEUE", payload: data });
          // }}
          >
            <Text style={styles.option}>Add to Queue</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};