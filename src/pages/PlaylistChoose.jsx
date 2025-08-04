import React, { useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  TouchableHighlight,
  Image,
  Modal,
  TextInput,
  Switch,
  ImageBackground
} from "react-native";
import BackArrow from "../Components/Icons/BackArrow";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation, useRoute } from "@react-navigation/native";
import { addMusicinPlaylist } from "../../Store/PlaylistSlice";
import { LinearGradient } from "expo-linear-gradient";
import icon from "../../assets/LikedSongs/heart.png";
import normicon from "../../assets/LikedSongs/Frame 4.png";
import { addPlaylist } from "../../Store/PlaylistSlice";
import { useTheme } from "@react-navigation/native";
import { AddNewPlaylist } from "../../Store/PlaylistSlice";
import Tick from "react-native-vector-icons/MaterialIcons";
import { addMusictoPlaylist } from "../../Store/PlaylistSlice";
const PlaylistChoose = () => {
  const navigation = useNavigation();
  const { user } = useSelector((state) => state.user || {});
  const route = useRoute();
  const { index, song } = route.params;

  const dispatch = useDispatch();
  const { data, id } = useSelector((state) => state.playlist);
  const { data: value, pos } = useSelector((state) => state.data);
  const [selectedIndices, setSelectedIndices] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isPlaylistaddVisible, setisPlaylistaddVisible] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  const [playlistName, setPlaylistName] = useState("");
  const [description, setDescription] = useState("");
  const { colors } = useTheme();


  
  //const backgroundImage = song?.image || index?.image;

  const handlePress = () => {
    toggleModal();
    togglePlaylistadd();
  };

  const handlePlaylist = () => {
    togglePlaylistadd();
    const playlist = {
      id: id + 1,
      image: null,
      name: playlistName,
      desc: description,
      songs: [],
      Time: 0,
      isPlaying: false,
    };
    dispatch(addPlaylist({ playlist: playlist }));
    dispatch(AddNewPlaylist({ data: playlist, userid: user?.id }))
    setDescription("");
    setPlaylistName("");
  };

  const toggleModal = () => {
    setIsModalVisible((prev) => !prev);
  };

  const togglePlaylistadd = () => {
    setisPlaylistaddVisible((prev) => !prev);
  };

  const handleDone = () => {
    if (selectedIndices.length === 0) {
      // Optionally show a message that no playlists were selected
      return;
    }
    // const upscaledUrl = song.image.replace(
    //   /w\d+-h\d+/,
    //   "w500-h500"
    // );
    // song.image = upscaledUrl

    if (song?.image) {
      const upscaledUrl = song.image.replace(/w\d+-h\d+/, "w500-h500");
      song.image = upscaledUrl;
    }

    const musicToAdd = song || value[pos];

    // Add the song to all selected playlists
    selectedIndices?.forEach((playlistIndex) => {
      dispatch(addMusicinPlaylist({ id: playlistIndex, music: musicToAdd }));
      //console.error(data[playlistIndex])
      dispatch(addMusictoPlaylist({ playlist: data[playlistIndex], user: user?.id, music: musicToAdd }))
    });

    // Show success message or toast here if desired

    // Navigate back
    navigation.goBack();
  };

  const styles = StyleSheet.create({
    modalOverlay: {
      flex: 1,
      justifyContent: "flex-end",
    },
    Main: { flex: 1, width: "100%" },
    Header: {
      width: "100%",
      flexDirection: "row",
      justifyContent: "space-between",
    },
    HeaderInside: {
      width: "100%",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    HeaderInsideText: {
      width: "68%",
      flexDirection: "row",
      justifyContent: "flex-start",
      alignItems: "center",
    },
    body: {
      width: "100%",
      height: "auto",
      paddingTop: 80,
      flexDirection: "column",
    },
    Playinfo: {
      width: "100%",
      height: 80,
      flexDirection: "row",
      alignItems: "center",
      //paddingRight: 30,
    },
    ImageContainer: {
      width: 60,
      height: 60,
      justifyContent: "center",
      alignItems: "center",
    },
    Name: {
      flex: 1,
      height: "100%",
      justifyContent: "center",
      paddingLeft: 25,
      paddingBottom:10
    },
    circle: {
      width: 25,
      height: 25,
      borderRadius: 20,
      borderWidth: 2,
      borderColor: "#1DB954",
      justifyContent: "center",
      alignItems: "center",
    },
    tick: {
      color: "white",
      fontSize: 16,
      fontWeight: "bold",
    },
    switchContainer: {
      width: "100%",
      height: 30,
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "space-around",
    },
    ButtonContainer: {
      width: "100%",
      height: 60,
      flexDirection: "row",
      justifyContent: "flex-end",
      alignItems: "center",
    },
    input: {
      width: "100%",
      padding: 10,
      backgroundColor: colors.border,
      borderRadius: 8,
    },
    Button: {
      color: "white",
      width: 120,
      height: 40,
      backgroundColor:  colors.primary,
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
    },
    PlaylistModal: {
      height: 350,
      borderRadius: 20,
      padding: 25,
      backgroundColor:  colors.card,
      gap: 15,
      width: "80%",
    },
    playlistMain: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    doneButton: {
      position: "absolute",
      bottom: 20,
      alignSelf: "center",
      backgroundColor: "#1DB954",
      paddingVertical: 12,
      paddingHorizontal: 30,
      borderRadius: 20,
      elevation: 3,
    },
    doneButtonDisabled: {
      backgroundColor:  "#1DB954",
    },
    doneButtonText: {
      color: "white",
      fontSize: 16,
      fontWeight: "bold",
    },
    selectionCount: {
      position: "absolute",
      bottom: 80,
      alignSelf: "center",
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 15,
    },
    selectionCountText: {
      color: "white",
      fontSize: 14,
    },
    imageStyle: {
      opacity: 0.3,
    },
  });


const bg = index?.image || song?.image;

  return (
    
    <ImageBackground
      source={{uri :bg}}
      style={{ flex: 1 }}
      imageStyle={styles.imageStyle}
      blurRadius={10}
    >
      <ScrollView
        style={styles.Main}
        contentContainerStyle={{
          alignItems: "center",
          paddingBottom: 100,
          paddingHorizontal: 20,
          paddingTop: 30,
        }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.Header}>
          <View style={styles.HeaderInside}>
            <TouchableOpacity
              style={{ width: "32%" }}
              onPress={() => navigation.goBack()}
            >
              <BackArrow fill={colors.text}/>
            </TouchableOpacity>
            <View style={styles.HeaderInsideText}>
              <Text style={{ fontSize: 20, color:  colors.text}}>
                Add to playlists
              </Text>
            </View>
          </View>
        </View>

        {/* Selected song info */}
        {(song || index) && (
          <View
            style={{
              width: "100%",
              height: 60,
              alignItems: "center",
              flexDirection: "row",
              marginTop: 20,
              borderRadius: 10,
              backgroundColor:  colors.card,
              paddingHorizontal: 15,
            }}
          >
            <Image
              source={{ uri: song?.image || index?.image }}
              style={{ width: 40, height: 40, borderRadius: 8 }}
            />
            <View style={{ flex: 1, paddingLeft: 15 }}>
              <Text
                style={{ fontSize: 16, color:  colors.text, fontWeight: "bold" }}
                numberOfLines={1}
              >
                {song?.title || index?.title}
              </Text>
              <Text style={{ fontSize: 12, color:  colors.text}} numberOfLines={1}>
                {song?.artist || index?.uploader}
              </Text>
            </View>
          </View>
        )}

        {/* New Playlist Button */}
        <TouchableOpacity
          style={{
            marginTop: 20,
            backgroundColor: "#1DB954",
            paddingVertical: 10,
            paddingHorizontal: 25,
            borderRadius: 10,
            alignSelf: "center",
          }}
          onPress={handlePress}
        >
          <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
            + New Playlist
          </Text>
        </TouchableOpacity>

        <Playlistadd
          isPlaylistaddVisible={isPlaylistaddVisible}
          togglePlaylistadd={togglePlaylistadd}
          styles={styles}
          isPrivate={isPrivate}
          setIsPrivate={setIsPrivate}
          handlePlaylist={handlePlaylist}
          description={description}
          setDescription={setDescription}
          setPlaylistName={setPlaylistName}
          playlistName={playlistName}
          colors={colors}
        />

        {/* Playlist List */}
        <View style={styles.body}>
          <FlatList
            data={data}
            renderItem={({ item, index }) => (
              <DisplayPlaylist
                item={item}
                index={index}
                styles={styles}
                selectedIndices={selectedIndices}
                setSelectedIndices={setSelectedIndices}
                colors={colors}
              />
            )}
            keyExtractor={(item, index) => index.toString()}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>

      {/* Selection count indicator */}
      {selectedIndices.length > 0 && (
        <View style={styles.selectionCount}>
          <Text style={styles.selectionCountText}>
            {selectedIndices.length} playlist
            {selectedIndices.length > 1 ? "s" : ""} selected
          </Text>
        </View>
      )}

      {/* Done button */}
      <TouchableOpacity
        style={[
          styles.doneButton,
          selectedIndices.length === 0 && styles.doneButtonDisabled,
        ]}
        onPress={handleDone}
        disabled={selectedIndices.length === 0}
      >
        <Text style={styles.doneButtonText}>Done</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
};

export default PlaylistChoose;

// Playlist item component
const DisplayPlaylist = ({
  item,
  index,
  styles,
  selectedIndices,
  setSelectedIndices,
  colors
}) => {
  const isSelected = selectedIndices.includes(index);

  const handleSelect = () => {
    if (isSelected) {
      setSelectedIndices((prev) => prev.filter((i) => i !== index));
    } else {
      setSelectedIndices((prev) => [...prev, index]);
    }
  };

  return (
    <TouchableHighlight
      onPress={handleSelect}
      style={{ borderRadius: 25,justifyContent:"center",alignItems:"center" }}
      underlayColor="rgba(245,222,179,0.2)"
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.Playinfo,
          { justifyContent: "space-between", paddingHorizontal: 10,alignItems:"center" },
        ]}
      >
        <View style={{ flexDirection: "row", alignItems: "center",justifyContent:"center" }}>
          <View style={styles.ImageContainer}>
            <Image
              source={
                item.image
                  ? { uri: item.image }
                  : item.songs?.[0]?.image
                    ? { uri: item.songs[0].image }
                    : index == 0 ? icon : normicon
              }
              style={{ width: 50, height: 50 , borderRadius:10 }}
            />
          </View>
          <View style={[styles.Name]}>
            <Text style={{ fontSize: 20, color: colors.text }}>{item.name}</Text>
            <Text style={{ fontSize: 15, color: colors.text}}>
              Playlist . Noctune
            </Text>
          </View>
          <View
          activeOpacity={0.7}
          style={{
            //position: "absolute",
            //right: 10,
            //top: "40%",
            justifyContent: "center",
            alignItems: "center",
            //padding: 10,
            borderRadius: 25,
          }}
          accessibilityLabel={
            isSelected ? "Deselect playlist" : "Select playlist"
          }
          accessibilityHint="Double-tap to select or deselect this playlist"
        >
          <View
            style={[
              styles.circle,
              {
                backgroundColor: isSelected ? "#1DB954" : "transparent",
                borderColor: isSelected ? "#1DB954" :  colors.text,
              },
            ]}
          >
            {isSelected && <Tick name="done" size={20}/>}
          </View>
        </View>
        </View>
        
      </View>
    </TouchableHighlight>
  );
};

const Playlistadd = ({
  isPlaylistaddVisible,
  togglePlaylistadd,
  styles,
  isPrivate,
  setIsPrivate,
  handlePlaylist,
  playlistName,
  setPlaylistName,
  description,
  setDescription,
  colors
}) => {
  return (
    <Modal
      transparent
      visible={isPlaylistaddVisible}
      animationType="slide"
      onRequestClose={() => togglePlaylistadd()}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.playlistMain}>
          <View style={styles.PlaylistModal}>
            <Text style={{ fontSize: 20, color:  colors.text }}>
              Create Playlist
            </Text>
            <TextInput
              placeholder="Playlist Name"
              value={playlistName}
              onChangeText={setPlaylistName}
              placeholderTextColor={ colors.text}
              style={styles.input}
            />

            <TextInput
              placeholder="Description (optional)"
              value={description}
              onChangeText={setDescription}
              placeholderTextColor={ colors.text}
              style={[styles.input, { height: 100 }]}
            />

            <View style={styles.switchContainer}>
              <Text style={{ color: colors.primary }}>Private</Text>
              <Switch
                value={isPrivate}
                onValueChange={setIsPrivate}
                trackColor={{ false:  colors.border, true:  colors.border }}
                thumbColor={!isPrivate ?  colors.primary : colors.primary}
              />
            </View>
            <View style={styles.ButtonContainer}>
              <TouchableOpacity style={styles.Button} onPress={handlePlaylist}>
                <Text style={{ color: "white" }}>Drop the Beat</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};
