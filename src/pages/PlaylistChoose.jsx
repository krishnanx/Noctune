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
} from "react-native";
import BackArrow from "../Components/BackArrow";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation, useRoute } from "@react-navigation/native";
import { addMusicinPlaylist } from "../../Store/PlaylistSlice";
import { LinearGradient } from "expo-linear-gradient";
import icon from "../../assets/icon.png";
import { addPlaylist } from "../../Store/PlaylistSlice";
import { useTheme } from "@react-navigation/native";
import { AddNewPlaylist } from "../../Store/PlaylistSlice";
import Tick from "react-native-vector-icons/MaterialIcons";

const PlaylistChoose = () => {
  const navigation = useNavigation();
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
    dispatch(AddNewPlaylist({ data: playlist }));
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

    const musicToAdd = song || value[pos];

    // Add the song to all selected playlists
    selectedIndices.forEach((playlistIndex) => {
      dispatch(addMusicinPlaylist({ id: playlistIndex, music: musicToAdd }));
    });

    // Show success message or toast here if desired

    // Navigate back
    navigation.goBack();
  };

  const styles = StyleSheet.create({
    modalOverlay: {
      flex: 1,
      justifyContent: "flex-end",
      backgroundColor: "rgba(85, 85, 85, 0.85)", // backdrop blur
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
      paddingRight: 30,
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
      color: "white",
      borderWidth: 1,
      padding: 10,
      backgroundColor: "gray",
      borderRadius: 8,
    },
    Button: {
      color: "white",
      width: 120,
      height: 40,
      backgroundColor: "green",
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
    },
    PlaylistModal: {
      height: 350,
      backgroundColor: colors.text,
      borderRadius: 20,
      padding: 25,
      backgroundColor: "rgba(0,0,0,1)",
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
      backgroundColor: "#2c3a2f",
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
      backgroundColor: "rgba(0,0,0,0.7)",
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 15,
    },
    selectionCountText: {
      color: "white",
      fontSize: 14,
    },
  });

  return (
    <LinearGradient
      colors={["#141414", "#1c2c32"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
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
              <BackArrow />
            </TouchableOpacity>
            <View style={styles.HeaderInsideText}>
              <Text style={{ fontSize: 20, color: "white" }}>
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
              backgroundColor: "rgba(50,50,50,0.5)",
              paddingHorizontal: 15,
            }}
          >
            <Image
              source={{ uri: song?.image || index?.image }}
              style={{ width: 40, height: 40, borderRadius: 8 }}
            />
            <View style={{ flex: 1, paddingLeft: 15 }}>
              <Text
                style={{ fontSize: 16, color: "white", fontWeight: "bold" }}
                numberOfLines={1}
              >
                {song?.title || index?.title}
              </Text>
              <Text style={{ fontSize: 12, color: "gray" }} numberOfLines={1}>
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
    </LinearGradient>
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
      style={{ borderRadius: 3 }}
      underlayColor="rgba(245,222,179,0.2)"
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.Playinfo,
          { justifyContent: "space-between", paddingHorizontal: 10 },
        ]}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View style={styles.ImageContainer}>
            <Image
              source={item.image ? { uri: item.image } : icon}
              style={{ width: 50, height: 50 }}
            />
          </View>
          <View style={styles.Name}>
            <Text style={{ fontSize: 20, color: "white" }}>{item.name}</Text>
            <Text style={{ fontSize: 15, color: "white" }}>
              Playlist . Noctune
            </Text>
          </View>
        </View>
        <View
          activeOpacity={0.7}
          style={{
            position: "absolute",
            right: 10,
            top: "40%",
            justifyContent: "center",
            alignItems: "center",
            padding: 10,
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
                borderColor: isSelected ? "#1DB954" : "white",
              },
            ]}
          >
            {isSelected && <Tick name="done" size={20} color="white" />}
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
            <Text style={{ fontSize: 20, color: "white" }}>
              Create Playlist
            </Text>
            <TextInput
              placeholder="Playlist Name"
              value={playlistName}
              onChangeText={setPlaylistName}
              placeholderTextColor="white"
              style={styles.input}
            />

            <TextInput
              placeholder="Description (optional)"
              value={description}
              onChangeText={setDescription}
              placeholderTextColor="white"
              style={[styles.input, { height: 100 }]}
            />

            <View style={styles.switchContainer}>
              <Text style={{ color: "white" }}>Private</Text>
              <Switch
                value={isPrivate}
                onValueChange={setIsPrivate}
                trackColor={{ false: "#767577", true: "wheat" }}
                thumbColor={!isPrivate ? "white" : "wheat"}
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
