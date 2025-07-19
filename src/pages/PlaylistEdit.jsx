import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import { KeyboardAvoidingView, Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { StatusBar } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {editPlaylist} from '../../Store/PlaylistSlice'
import {user} from '../../Store/UserSlice'

// Option 1: Try the correct import for react-native-reanimated-dnd
// Uncomment the version that works with your library:

// For react-native-reanimated-dnd (newer version)
// import { DndProvider, Sortable, SortableItem } from 'react-native-reanimated-dnd';

// For react-native-reanimated-dnd (alternative API)
// import { useSortable, SortableProvider } from 'react-native-reanimated-dnd';

// For react-native-draggable-flatlist (popular alternative)
import DraggableFlatList, { RenderItemParams } from "react-native-draggable-flatlist";


// Import with proper error handling
let BackArrow;
try {
  BackArrow = require("../Components/BackArrow").default;
} catch (error) {
  console.warn('BackArrow component not found, using fallback');
  BackArrow = () => <Text style={{ color: 'white', fontSize: 18 }}>←</Text>;
}

// Import existing actions from your PlaylistSlice
import { 
  addPlaylist, 
  addMusicinPlaylist, 
  setPlaylistplaying, 
  changePlaylist, 
  updatePlaylistData 
} from "../../Store/PlaylistSlice";

import icon from "../../assets/icon.png";

const PlaylistEdit = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const route = useRoute();
  const { index } = route.params;

  // Get playlist data from Redux store
  const { data } = useSelector((state) => state.playlist);
  const userState = useSelector((state) => state.user || {});
  const { user, session, loading, error, clientID } = userState;
  
  // Get the specific playlist using the index
  const playlistData = data && data[index] ? data[index] : null;

  // Local state for editing
  const [editedName, setEditedName] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [editedImage, setEditedImage] = useState("");
  const [editedSongs, setEditedSongs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  // Initialize state when playlistData is available
  useEffect(() => {
    if (playlistData) {
      setEditedName(playlistData.name || "");
      setEditedDescription(playlistData.desc || playlistData.description || "");
      setEditedImage(playlistData.image || "");
      setEditedSongs(playlistData.songs || []);
    }
  }, [playlistData]);
  
 useEffect(() => {
  if (playlistData) {
    const nameChanged = editedName !== (playlistData.name || "");
    const descChanged = editedDescription !== (playlistData.desc || playlistData.description || "");
    const imageChanged = selectedImage !== null || editedImage !== (playlistData.image || "");

    const originalSongs = playlistData.songs || [];
    const songsChanged = JSON.stringify(originalSongs.map(s => s.id)) !== JSON.stringify(editedSongs.map(s => s.id));

    setHasChanges(nameChanged || descChanged || imageChanged || songsChanged);
  }
}, [editedName, editedDescription, editedImage, editedSongs, selectedImage, playlistData]);
  // Early return if playlist data is not available
  if (!playlistData) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#1DB954" />
        <Text style={{ color: "white", marginTop: 10 }}>Loading playlist...</Text>
      </View>
    );
  }


const pickImage = async () => {
  try {
    // Ask permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'We need access to your gallery.');
      return;
    }

    // Open picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      console.log('Selected image URI:', uri);
      
      // Update the state with the new image
      setEditedImage(uri);
      setSelectedImage(uri);
      setHasChanges(true);
    }
  } catch (e) {
    console.error('Error picking image:', e);
    Alert.alert('Error', 'Could not pick image.');
  }
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
      const updatedPlaylist = {
        ...playlistData,
        name: editedName,
        desc: editedDescription,
        image: selectedImage || editedImage || playlistData.image,
        songs: editedSongs,
        Time: editedSongs.reduce((total, song) => total + (song.duration || 0), 0)
      };

      dispatch(updatePlaylistData({
        index: index,
        updatedData: updatedPlaylist
      }));

      //Use unwrap() to get the actual result or throw on rejection
    const result = await dispatch(editPlaylist({
      data: updatedPlaylist,
      userid: user
    })).unwrap();

    console.log('Playlist updated successfully:', result);
    navigation.goBack();

  } catch (error) {
    console.error('Error saving playlist:', error);
    Alert.alert('Error', `Failed to save changes: ${error.message}`);
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

  // Get the image source for the playlist
const getImageSource = () => {
  if (selectedImage) {
    return { uri: selectedImage };
  }
  if (editedImage) {
    return { uri: editedImage };
  }
  if (playlistData.image) {
    return { uri: playlistData.image };
  }
  if (playlistData.songs && playlistData.songs.length > 0 && playlistData.songs[0].image) {
    return { uri: playlistData.songs[0].image };
  }
  return icon;
};


  // Render item for the draggable list
const renderSongItem = ({ item, drag, isActive }) => (
  <View style={[styles.songItem, isActive && styles.songItemActive]}>
    {/* Drag handle */}
    <TouchableOpacity 
      style={styles.dragHandle}
      onLongPress={drag}
      delayLongPress={0}
    >
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
        {item.uploader || item.artist}
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

  // Manual drag and drop implementation (fallback if no library works)
// const DraggableSongsList = () => (
//   <DraggableFlatList
//     data={editedSongs}
//     keyExtractor={(item) => item.id.toString()}
//     onDragEnd={({ data }) => setEditedSongs(data)}
//     renderItem={({ item, drag, isActive }) => renderSongItem({ item, drag, isActive })}
//     activationDistance={0}
//     containerStyle={styles.sortableContainer}
//      ListHeaderComponent={renderHeader} 
//   />
// );


  // Header component for the main content
  const renderHeader = () => (
    <View>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={discardChanges}>
          {BackArrow ? <BackArrow /> : <Text style={{ color: 'white', fontSize: 18 }}>←</Text>}
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
            style={[styles.saveButton, !hasChanges && styles.saveButtonDisabled]}
            onPress={saveChanges}
            disabled={!hasChanges}
          >
            <Text style={[styles.saveButtonText, !hasChanges && styles.saveButtonTextDisabled]}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Image Section */}
      <View style={styles.imageSection}>
        <Image
          source={getImageSource()}
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
             <Text style={styles.sectionTitle}>
                Songs ({editedSongs.length}) - Use arrows to reorder
              </Text>
        </View>
      </View>
    </View>
  );

return (
  <>
    <StatusBar backgroundColor="#000" />
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <GestureHandlerRootView style={styles.gestureContainer}>
        {isLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#1DB954" />
            <Text style={{ color: "white", marginTop: 10 }}>Saving changes...</Text>
          </View>
        )}
        

        <DraggableFlatList
          data={editedSongs}
          keyExtractor={(item) => item.id.toString()}
          onDragEnd={({ data }) => setEditedSongs(data)}
          renderItem={renderSongItem}
          activationDistance={0}
          containerStyle={styles.sortableContainer}
          contentContainerStyle={{ paddingBottom: 40 }}
          ListHeaderComponent={renderHeader} // 👈 your header goes here
        />
      </GestureHandlerRootView>
    </KeyboardAvoidingView>
  </>
);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gestureContainer: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#000',
    backgroundColor: '#000',
  },
  scrollView: {
    flex: 1,
    backgroundColor: 'transparent', 
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20, 
  },
  header: {
    paddingTop: 15,
    paddingTop: 15,
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
  headerButtons: {
    flexDirection: "row",
    alignItems: "center",
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
  saveButton: {
    backgroundColor: "#1DB954",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  saveButtonDisabled: {
    backgroundColor: "#555", 
  },
  saveButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  saveButtonTextDisabled: {
    color: "#888",
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
    marginBottom: 0,
  },
  sectionTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    marginTop: 25,
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
  multilineInput: {
    height: 80,
    textAlignVertical: "top",
  },
  songsSection: {
    paddingBottom: 20,
    backgroundColor: 'transparent', 
  },
  sortableContainer: {
    paddingTop: 10,
    backgroundColor: 'transparent', 
    backgroundColor: 'transparent', 
  },
  songItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    minHeight: 70,
    borderColor: "rgba(255,255,255,0.1)",
    minHeight: 70,
  },
  songItemActive: {
    backgroundColor: "rgba(40,40,40,0.9)",
    backgroundColor: "rgba(40,40,40,0.9)",
    borderColor: "rgba(29, 185, 84, 0.3)",
    elevation: 8,
    shadowColor: "#1DB954",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  dragHandle: {
    padding: 10,
    padding: 10,
    marginRight: 12,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  dragHandleText: {
    fontSize: 26,
    color: "#ccc", 
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
    justifyContent: "center",
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
  reorderButtons: {
    flexDirection: "column",
    marginRight: 10,
  },
  reorderButton: {
    padding: 4,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 4,
    marginVertical: 1,
    minWidth: 24,
    alignItems: "center",
  },
  reorderButtonText: {
    color: "#1DB954",
    fontSize: 14,
    fontWeight: "600",
  },
  reorderButtons: {
    flexDirection: "column",
    marginRight: 10,
  },
  reorderButton: {
    padding: 4,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 4,
    marginVertical: 1,
    minWidth: 24,
    alignItems: "center",
  },
  reorderButtonText: {
    color: "#1DB954",
    fontSize: 14,
    fontWeight: "600",
  },
  removeButton: {
    padding: 8,
    marginLeft: 10,
  },
  removeButtonText: {
    color: "#ff4444",
    fontSize: 18,
    fontWeight: "600",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    backgroundColor: 'transparent', 
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
  },}
);

export default PlaylistEdit;