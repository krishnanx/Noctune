import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

const Home = () => {
  return (
    <View>
      <TouchableOpacity
        style={{ width: 100, height: 100, backgroundColor: "white" }}
      >
        <Text>Playlist</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Home;
