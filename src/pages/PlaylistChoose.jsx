import React from "react";
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

import icon from "../../assets/icon.png";
const PlaylistChoose = () => {
  const naviagtion = useNavigation();
  const route = useRoute();

  // Get both index and song parameters to support both navigation methods
  const { index, song } = route.params;

  const dispatch = useDispatch();
  const styles = StyleSheet.create({
    Main: {
      flex: 1,
      width: "100%",
    },
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
      //backgroundColor:"red",
      alignItems: "center",
      flexDirection: "row",
    },
    ImageContainer: {
      width: 60,
      height: 60,
      //backgroundColor:"white",
      justifyContent: "center",
      alignItems: "center",
    },
    Name: {
      width: "100%" - 60,
      height: "100%",
      justifyContent: "center",
      paddingLeft: 25,
    },
  });
  const { data } = useSelector((state) => state.playlist);
  const { data: value, pos } = useSelector((state) => state.data);

  return (
    <ScrollView
      style={styles.Main}
      contentContainerStyle={{
        alignItems: "center",
        paddingBottom: 100,
        paddingHorizontal: 20,
        paddingTop: 30,
        height: 2000,
      }}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.Header}>
        <View style={styles.HeaderInside}>
          <TouchableOpacity
            style={{ width: "32%" }}
            onPress={() => naviagtion.goBack()}
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

      {/* Optional: Show which song will be added */}
      {song && (
        <View
          style={{
            width: "100%",
            height: 60,
            alignItems: "center",
            flexDirection: "row",
            marginTop: 20,
            borderRadius: 10,
            backgroundColor: "rgba(50,50,50,0.3)",
            paddingHorizontal: 15,
          }}
        >
          <Image
            source={{ uri: song.image }}
            style={{ width: 40, height: 40, borderRadius: 8 }}
          />
          <View style={{ flex: 1, paddingLeft: 15 }}>
            <Text
              style={{ fontSize: 16, color: "white", fontWeight: "bold" }}
              numberOfLines={1}
            >
              {song.title}
            </Text>
            <Text style={{ fontSize: 12, color: "gray" }} numberOfLines={1}>
              {song.artist}
            </Text>
          </View>
        </View>
      )}

      <View style={styles.body}>
        <FlatList
          data={data}
          renderItem={({ item, index }) => (
            <DisplayPlaylist
              item={item}
              index={index}
              pos={pos}
              styles={styles}
              dispatch={dispatch}
              naviagtion={naviagtion}
              data={value}
              songToAdd={song} // Pass the selected song
            />
          )}
          keyExtractor={(item, index) => index.toString()}
          scrollEnabled={false}
        />
      </View>
    </ScrollView>
  );
};

export default PlaylistChoose;

const DisplayPlaylist = ({
  item,
  index,
  styles,
  dispatch,
  naviagtion,
  data,
  pos,
  songToAdd,
}) => {
  return (
    <TouchableHighlight
      onPress={() => {
        // Use the selected song from search if available, otherwise use currently playing song
        const musicToAdd = songToAdd || data[pos];
        dispatch(addMusicinPlaylist({ id: index, music: musicToAdd }));
        naviagtion.goBack();
      }}
      style={{
        borderRadius: 3,
      }}
      underlayColor="rgba(245,222,179,0.2)"
      activeOpacity={0.7}
    >
      <View
        style={styles.Playinfo}
        onPress={() => console.log(item)}
        key={item}
      >
        <View style={styles.ImageContainer}>
          <Image
            source={item.image ? { uri: item.image } : icon}
            style={{ width: 50, height: 50 }}
            // fallback if user image fails to load
          />
        </View>
        <View style={styles.Name}>
          <Text style={{ fontSize: 20, color: "white" }}>{item.name}</Text>
          <Text style={{ fontSize: 15, color: "white" }}>
            Playlist . Noctune
          </Text>
        </View>
      </View>
    </TouchableHighlight>
  );
};
