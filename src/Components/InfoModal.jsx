import React from "react";
import { Modal, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Svg, { Path } from "react-native-svg";

const EditIcon = ({ width = 20, height = 20, fill = "#888" }) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill={fill}
  >
    <Path
      d="M3 17.25V21h3.75l11.06-11.06-3.75-3.75L3 17.25zM20.71
     7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 
     0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
    />
  </Svg>
);

const InfoModal = ({
  visible,
  onClose,
  playlistName,
  playlistDescription,
  onEdit,
}) => {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>{playlistName}</Text>
            <TouchableOpacity onPress={onEdit}>
              <EditIcon />
            </TouchableOpacity>
          </View>
          <Text style={styles.description}>{playlistDescription}</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default InfoModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    width: "85%",
    backgroundColor: "#1c1c1e",
    padding: 20,
    borderRadius: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    flex: 1,
  },
  description: {
    fontSize: 14,
    color: "#ccc",
    marginBottom: 20,
  },
  closeButton: {
    alignSelf: "flex-end",
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#333",
    borderRadius: 8,
  },
  closeText: {
    color: "#fff",
    fontSize: 14,
  },
});
