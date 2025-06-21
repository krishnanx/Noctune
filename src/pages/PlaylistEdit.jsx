import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation, useRoute } from "@react-navigation/native";
//import * as ImagePicker from 'expo-image-picker';
import DragDropList from 'react-native-reanimated-dnd';
import BackArrow from "../Components/BackArrow";
import { updateCompletePlaylist } from "../../Store/PlaylistSlice";

const PlaylistEdit = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const route = useRoute();
  
  // Get playlist data from route params or Redux store
  const { playlistIndex } = route.params;
  const { data } = useSelector((state) => state.playlist);
  const playlistData = data[playlistIndex];

  // Local state for editing
  const [editedName, setEditedName] = useState(playlistData?.name || "");
  const [editedDescription, setEditedDescription] = useState(playlistData?.desc || "");
  const [editedImage, setEditedImage] = useState(playlistData?.image || "");
  const [editedSongs, setEditedSongs] = useState(playlistData?.songs || []);
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    // Track if there are any changes
    const nameChanged = editedName !== playlistData?.name;
    const descChanged = editedDescription !== playlistData?.desc;
    const imageChanged = editedImage !== playlistData?.image;
    const songsChanged = JSON.stringify(editedSongs) !== JSON.stringify(playlistData?.songs);
    
    setHasChanges(nameChanged || descChanged || imageChanged || songsChanged);
  }, [editedName, editedDescription, editedImage, editedSongs, playlistData]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#000",
    },
    scrollContainer: {
      flexGrow: 1,
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 100,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 30,
    },
    headerTitle: {
      color: "white",
      fontSize: 18,
      fontWeight: "600",
    },
    saveButton: {
      backgroundColor: hasChanges ? "#1DB954" : "#333",
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
    },
    saveButtonText: {
      color: hasChanges ? "white" : "#666",
      fontSize: 14,
      fontWeight: "600",
    },
    imageSection: {
      alignItems: "center",
      marginBottom: 30,
    },
    playlistImage: {
      width: 200,
      height: 200,
      borderRadius: 15,
      backgroundColor: "#333",
      marginBottom: 15,
    },
    changeImageButton: {
      backgroundColor: "rgba(255,255,255,0.1)",
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.3)",
    },
    changeImageText: {
      color: "white",
      fontSize: 14,
      fontWeight: "500",
    },
    detailsSection: {
      marginBottom: 30,
    },
    sectionTitle: {
      color: "white",
      fontSize: 18,
      fontWeight: "600",
      marginBottom: 15,
    },
    inputContainer: {
      marginBottom: 20,
    },
    inputLabel: {
      color: "#ccc",
      fontSize: 14,
      marginBottom: 8,
    },
    textInput: {
      backgroundColor: "rgba(255,255,255,0.1)",
      borderRadius: 10,
      paddingHorizontal: 15,
      paddingVertical: 12,
      color: "white",
      fontSize: 16,
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.2)",
    },
    textInputFocused: {
      borderColor: "#1DB954",
    },
    multilineInput: {
      height: 80,
      textAlignVertical: "top",
    },
    songsSection: {
      flex: 1,
    },
    songItem: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "rgba(255,255,255,0.05)",
      borderRadius: 12,
      padding: 12,
      marginBottom: 10,
    },
    dragHandle: {
      padding: 10,
      marginRight: 10,
    },
    dragHandleText: {
      color: "#666",
      fontSize: 18,
    },
    songImage: {
      width: 50,
      height: 50,
      borderRadius: 8,
      backgroundColor: "#333",
      marginRight: 12,
    },
    songDetails: {
      flex: 1,
    },
    songTitle: {
      color: "white",
      fontSize: 16,
      fontWeight: "500",
      marginBottom: 4,
    },
    songArtist: {
      color: "#ccc",
      fontSize: 14,
    },
    removeButton: {
      padding: 8,
      marginLeft: 10,
    },
    removeButtonText: {
      color: "#ff4444",
      fontSize: 18,
    },
    emptyState: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 40,
    },
    emptyStateText: {
      color: "#666",
      fontSize: 16,
      textAlign: "center",
    },
    loadingOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0,0,0,0.7)",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
    },
    discardButton: {
      backgroundColor: "transparent",
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: "#666",
      marginRight: 10,
    },
    discardButtonText: {
      color: "#666",
      fontSize: 14,
      fontWeight: "600",
    },
    headerButtons: {
      flexDirection: "row",
      alignItems: "center",
    },
  });

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant camera roll permissions to change the playlist image.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setEditedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const handleSongReorder = (newOrder) => {
    setEditedSongs(newOrder);
  };

  const removeSong = (songId) => {
    Alert.alert(
      "Remove Song",
      "Are you sure you want to remove this song from the playlist?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            setEditedSongs(editedSongs.filter(song => song.id !== songId));
          },
        },
      ]
    );
  };

  const saveChanges = async () => {
    if (!hasChanges) return;

    setIsLoading(true);
    try {
      // Dispatch the action to update the complete playlist
      dispatch(updateCompletePlaylist({
        index: playlistIndex,
        name: editedName,
        description: editedDescription,
        image: editedImage,
        songs: editedSongs,
      }));

      // If you want to sync with backend, you can add an API call here
      // await updatePlaylistOnServer(playlistIndex, { name: editedName, description: editedDescription, image: editedImage, songs: editedSongs });
      
      Alert.alert(
        "Success",
        "Playlist updated successfully!",
        [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      console.error('Error saving playlist:', error);
      Alert.alert('Error', 'Failed to save changes. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const discardChanges = () => {
    if (!hasChanges) {
      navigation.goBack();
      return;
    }

    Alert.alert(
      "Discard Changes",
      "Are you sure you want to discard your changes?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Discard",
          style: "destructive",
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  const renderSongItem = ({ item, index }) => (
    <View style={styles.songItem}>
      <TouchableOpacity style={styles.dragHandle}>
        <Text style={styles.dragHandleText}>≡</Text>
      </TouchableOpacity>
      
      <Image 
        source={{ uri: item.image }} 
        style={styles.songImage}
        defaultSource={require('../../assets/favicon.png')}
      />
      
      <View style={styles.songDetails}>
        <Text numberOfLines={1} style={styles.songTitle}>
          {item.title}
        </Text>
        <Text numberOfLines={1} style={styles.songArtist}>
          {item.uploader}
        </Text>
      </View>
      
      <TouchableOpacity 
        style={styles.removeButton}
        onPress={() => removeSong(item.id)}
      >
        <Text style={styles.removeButtonText}>×</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#1DB954" />
          <Text style={{ color: "white", marginTop: 10 }}>Saving changes...</Text>
        </View>
      )}
      
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={discardChanges}>
            <BackArrow />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>Edit Playlist</Text>
          
          <View style={styles.headerButtons}>
            {hasChanges && (
              <TouchableOpacity 
                style={styles.discardButton}
                onPress={discardChanges}
              >
                <Text style={styles.discardButtonText}>Cancel</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity 
              style={styles.saveButton}
              onPress={saveChanges}
              disabled={!hasChanges}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Image Section */}
        <View style={styles.imageSection}>
          <Image 
            source={{ 
              uri: editedImage || (editedSongs.length > 0 ? editedSongs[0].image : '') 
            }} 
            style={styles.playlistImage}
            defaultSource={require('../../assets/favicon.png')}
          />
          <TouchableOpacity style={styles.changeImageButton} onPress={pickImage}>
            <Text style={styles.changeImageText}>Change Image</Text>
          </TouchableOpacity>
        </View>

        {/* Details Section */}
        <View style={styles.detailsSection}>
          <Text style={styles.sectionTitle}>Details</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Playlist Name</Text>
            <TextInput
              style={styles.textInput}
              value={editedName}
              onChangeText={setEditedName}
              placeholder="Enter playlist name"
              placeholderTextColor="#666"
              maxLength={50}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Description</Text>
            <TextInput
              style={[styles.textInput, styles.multilineInput]}
              value={editedDescription}
              onChangeText={setEditedDescription}
              placeholder="Add a description (optional)"
              placeholderTextColor="#666"
              multiline
              maxLength={200}
            />
          </View>
        </View>

        {/* Songs Section */}
        <View style={styles.songsSection}>
          <Text style={styles.sectionTitle}>
            Songs ({editedSongs.length})
          </Text>
          
          {editedSongs.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                No songs in this playlist.{'\n'}Add some songs to get started!
              </Text>
            </View>
          ) : (
            <DragDropList
              data={editedSongs}
              keyExtractor={(item) => item.id.toString()}
              onReorder={handleSongReorder}
              renderItem={renderSongItem}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default PlaylistEdit;