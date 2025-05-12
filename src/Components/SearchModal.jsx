// components/SearchModal.js
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

const SearchModal = ({ isModalVisible, toggleModal, dispatch, navigation }) => {
  const { data, pos } = useSelector((state) => state.data);

  return (
    <Modal
      transparent
      visible={isModalVisible}
     // animationType="slide"
      onRequestClose={() => toggleModal()}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPressOut={() => toggleModal()}
      >
        <View style={styles.modalContent}>
          {/* Mini Player Info Section */}
          <View style={[styles.miniPlayerInfo, { marginBottom: 30 }]}>
            <Image
              source={{ uri: data ? data[pos]?.image : null }}
              style={styles.miniPlayerThumbnail}
            />
            <View style={styles.miniPlayerTextContainer}>
              <Text style={styles.miniPlayerTitle} numberOfLines={1}>
                {data ? data[pos]?.title : "Unknown Title"}
              </Text>
              <Text style={styles.miniPlayerArtist} numberOfLines={1}>
                {data ? data[pos]?.uploader : "Unknown Artist"}
              </Text>
            </View>
          </View>

          {/* Option Buttons */}
          <TouchableOpacity style={styles.optionTouch}>
            <Text style={styles.option}>Add to Liked Songs</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.optionTouch}
            onPress={() => {
              toggleModal();
              navigation.navigate("Playchoose", { index: pos });
            }}
          >
            <Text style={styles.option}>Add to Playlist</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionTouch}>
            <Text style={styles.option}>Media Quality</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionTouch}>
            <Text style={styles.option}>Share</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.optionTouch}
            onPress={() => {
              toggleModal();
              dispatch({ type: "ADD_TO_QUEUE", payload: data[pos] });
            }}
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
  },
  option: {
    color: "#f9fafb",
    fontSize: 16,
  },
});

export default SearchModal;
