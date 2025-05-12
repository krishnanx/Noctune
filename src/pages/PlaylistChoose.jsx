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
} from "react-native";
import BackArrow from "../Components/BackArrow";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation, useRoute } from "@react-navigation/native";
import { addMusicinPlaylist } from "../../Store/PlaylistSlice";
import { LinearGradient } from "expo-linear-gradient";
import icon from "../../assets/icon.png";

const PlaylistChoose = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { index, song } = route.params;
  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.playlist);
  const { data: value, pos } = useSelector((state) => state.data);

  const [selectedIndex, setSelectedIndex] = useState(null); // NEW STATE

  const styles = StyleSheet.create({
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
      width: 24,
      height: 24,
      borderRadius: 12,
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
  });

  return (
    <LinearGradient
      colors={["#141414", "#1c2c30"]}
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
                Add to playlist
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
          onPress={() => {}}
        >
          <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
            + New Playlist
          </Text>
        </TouchableOpacity>

        {/* Playlist List */}
        <View style={styles.body}>
          <FlatList
            data={data}
            renderItem={({ item, index }) => (
              <DisplayPlaylist
                item={item}
                index={index}
                styles={styles}
                dispatch={dispatch}
                navigation={navigation}
                data={value}
                pos={pos}
                songToAdd={song}
                selectedIndex={selectedIndex}
                setSelectedIndex={setSelectedIndex}
              />
            )}
            keyExtractor={(item, index) => index.toString()}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default PlaylistChoose;

// Playlist item
const DisplayPlaylist = ({
  item,
  index,
  styles,
  dispatch,
  navigation,
  data,
  pos,
  songToAdd,
  selectedIndex,
  setSelectedIndex,
}) => {
  const isSelected = selectedIndex === index;
  const [selected, setSelected] = useState(false);
  const handleSelect = () => {
    setSelectedIndex(index);
    const musicToAdd = songToAdd || data[pos];
    dispatch(addMusicinPlaylist({ id: index, music: musicToAdd }));
    navigation.goBack();
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
        <TouchableOpacity
          onPress={() => setSelected(!selected)}
          activeOpacity={0.7}
          style={{ position: "absolute", right: 10, top: "40%" }}
        >
          <View
            style={[
              styles.circle,
              {
                backgroundColor: selected ? "#1DB954" : "transparent",
                borderColor: selected ? "#1DB954" : "white",
              },
            ]}
          >
            {selected && <Text style={styles.tick}>✓</Text>}
          </View>
        </TouchableOpacity>
      </View>
    </TouchableHighlight>
  );
};
