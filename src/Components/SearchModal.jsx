import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Image,
} from "react-native";
import { useSelector } from "react-redux";

const SearchModal = ({
  isModalVisible,
  toggleModal,
  dispatch,
  navigation,
  song,
}) => {
  const { data, pos } = useSelector((state) => state.data);

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isModalVisible}
      onRequestClose={() => toggleModal()}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={() => toggleModal()}
      >
        <View style={styles.modalContent}>
          {/* Mini Player Info Section - now showing selected song */}
          <View style={styles.miniPlayerInfo}>
            <Image
              source={{ uri: song?.image }} 
              style={styles.miniPlayerThumbnail}
            />
            <View style={styles.miniPlayerTextContainer}>
              <Text style={styles.miniPlayerTitle} numberOfLines={1}>
                {song?.title || "Unknown Title"}{" "}
              </Text>
              <Text style={styles.miniPlayerArtist} numberOfLines={1}>
                {song?.artist || "Unknown Artist"}{" "}
              </Text>
            </View>
          </View>

          <View style={styles.line} />

          {/* Option Buttons */}
          <TouchableOpacity style={styles.optionTouch}>
            <Text style={styles.option}>Add to Liked Songs</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionTouch}
            onPress={() => {
              toggleModal();
              navigation.navigate("Playchoose", { song: song });
            }}
          >
            <Text style={styles.option}>Add to Playlist</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionTouch}>
            <Text style={styles.option}>Share</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionTouch}
            // onPress={() => {
            //   toggleModal();
            //   dispatch({ type: "ADD_TO_QUEUE", payload: song });
            // }}
          >
            <Text style={styles.option}>Add to Queue</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(29, 26, 26, 0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "black",
    borderRadius: 20,
    padding: 20,
    elevation: 10,
  },
  miniPlayerInfo: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom:20
  },
  miniPlayerThumbnail: {
    width: 50,
    height: 50,
    borderRadius: 10,
    marginRight: 15,
  },
  miniPlayerTextContainer: {
    flex: 1,
  },
  miniPlayerTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  miniPlayerArtist: {
    color: "#aaa",
    fontSize: 14,
  },
  optionTouch: {
    marginTop: 15,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: "rgba(128,128,128,0.3)", // gray with 60% opacity
    borderRadius: 10,
  },
  option: {
    color: "#f9fafb",
    fontSize: 16,
  },
  line: {
    height: 1,
    backgroundColor: "#aaa",
    opacity: 0.4,
  },
});

export default SearchModal;
