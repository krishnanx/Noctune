import React, { useState } from 'react'
import { ScrollView, View, StyleSheet, Text, ViewBase, TouchableOpacity, Modal, Image, TextInput, Switch, FlatList, TouchableHighlight } from 'react-native'
import { Download } from 'react-native-feather';
import ThreeDots from "../Components/ThreeDots"
import SearchIcon from '../Components/Search';
import AddIcon from '../Components/AddIcon';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from "@react-navigation/native";
import MusicNote from "../Components/MusicNote"
import Collab from "../Components/Collab"
import icon from "../../assets/favicon.png"
import { addPlaylist } from '../../Store/PlaylistSlice';
import { useNavigation } from '@react-navigation/native';
const Library = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isPlaylistaddVisible, setisPlaylistaddVisible] = useState(false);
    const [isPrivate, setIsPrivate] = useState(false);
    const [playlistName, setPlaylistName] = useState("");
    const [description, setDescription] = useState("")
    const { colors } = useTheme();
    const { data } = useSelector((state) => state.playlist);
    const navigation = useNavigation();
    const toggleModal = () => {
        setIsModalVisible((prev) => !prev);
    };
    const togglePlaylistadd = () => {
        setisPlaylistaddVisible((prev) => !prev);
    };
    const dispatch = useDispatch();
    const styles = StyleSheet.create({
        Main: {
            flex: 1,
            width: "100%"

        },
        insideMain: {
            paddingHorizontal: 20,
            paddingTop: 20,
            flexDirection: "column",
            flex: 1,
            flexGrow: 1

        },
        Header: {
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between"
        },
        HeaderInside:
        {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center"
        }
        ,
        body: {
            width: "100%",
            height: "auto",
            paddingTop: 80,
            flexDirection: "column",




        },
        modalOverlay: {
            flex: 1,
            justifyContent: "flex-end",
            //backgroundColor: "rgba(98, 92, 92, 0.5)", // backdrop blur
        },
        modalContent: {
            height: "20%",
            backgroundColor: colors.text,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            padding: 25,
            backgroundColor: "rgba(0,0,0,1)",
            gap: 15,
        },
        option: {
            fontSize: 18,
            marginVertical: 10,
            color: colors.text,
        },
        modal1: {
            width: "100%",
            height: "50%",
            flexDirection: "row",

        },
        modal1R: {
            width: "80%",
            height: "auto",
            //backgroundColor:"white",
            justifyContent: "center",
            alignItems: "center",

        },
        modal1L: {
            width: "20%",
            height: "auto",
            //backgroundColor:"red",
            justifyContent: "center",
            alignItems: "center"
        },
        PlaylistModal: {
            height: 350,
            backgroundColor: colors.text,
            borderRadius: 20,
            padding: 25,
            backgroundColor: "rgba(0,0,0,1)",
            gap: 15,
            width: "80%"

        },
        playlistMain: {

            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            //backgroundColor: "rgba(98, 92, 92, 0.)", // backdrop blur


        },
        input: {
            width: "100%",
            color: "white",
            borderColor: "wheat",
            borderWidth: 1,
            padding: 10
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
            //backgroundColor:"white"

        },
        Button: {
            color: "white",
            width: 120,
            height: 40,
            backgroundColor: "wheat",
            borderRadius: 20,
            justifyContent: "center",
            alignItems: "center"
        },
        Playinfo: {
            width: "100%",
            height: 80,
            //backgroundColor:"red",
            alignItems: "center",

            flexDirection: "row"
        },
        ImageContainer: {
            width: 60,
            height: 60,
            //backgroundColor:"white",
            justifyContent: "center",
            alignItems: "center"
        },
        Name: {
            width: "100%" - 60,
            height: "100%",
            justifyContent: "center",
            paddingLeft: 25

        }



    });
    const handlePress = () => {
        toggleModal();
        togglePlaylistadd();
    }
    const handlePlaylist = () => {
        togglePlaylistadd();
        dispatch(addPlaylist({ name: playlistName, desc: description }));
        setDescription("");
        setPlaylistName("");
    }
    return (
        <ScrollView
            style={styles.Main}
            contentContainerStyle={{ alignItems: 'center', paddingBottom: 100, paddingHorizontal: 20, paddingTop: 30, height: 2000 }}
            keyboardShouldPersistTaps="handled"
        >
            <View
                style={styles.Header}
            >
                <View
                    style={styles.HeaderInside}
                >
                    <Text
                        style={{ fontSize: 30, color: "white" }}
                    >
                        Your Library
                    </Text>
                </View>
                <View
                    style={[styles.HeaderInside, { width: "25%" }]}
                >
                    <SearchIcon width={30} height={30} />
                    <TouchableOpacity
                        onPress={() => toggleModal()}
                    >
                        <AddIcon width={30} height={30} />
                    </TouchableOpacity>
                </View>
            </View>
            <View
                style={styles.body}
            >
                <FlatList
                    data={data}
                    renderItem={({ item, index }) => <DisplayPlaylist item={item}
                        index={index}
                        styles={styles}
                        navigation={navigation}
                    />}
                    keyExtractor={(item, index) => index.toString()}
                    scrollEnabled={false}
                />
                <Custom_modal
                    isModalVisible={isModalVisible}
                    styles={styles}
                    toggleModal={toggleModal}
                    handlePress={handlePress}
                />
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

            </View>

        </ScrollView>

    )
}

export default Library
const Custom_modal = ({ isModalVisible, styles, toggleModal, handlePress }) => {
    const { data, pos } = useSelector((state) => state.data);

    return (
        <Modal
            transparent
            visible={isModalVisible}
            animationType="slide"
            onRequestClose={() => toggleModal()}

        >
            <TouchableOpacity
                style={styles.modalOverlay}
                activeOpacity={1}
                onPressOut={() => toggleModal()}
            >
                <View style={styles.modalContent}>
                    <TouchableOpacity
                        style={styles.modal1}
                        onPress={() => handlePress()}
                    >
                        <View
                            style={styles.modal1L}
                        >
                            <MusicNote width={40} height={40} />
                        </View>
                        <View
                            style={styles.modal1R}
                        >
                            <View
                                style={{ width: "100%", height: "70%", alignItems: "center", flexDirection: "row" }}
                            >
                                <Text
                                    style={{ fontSize: 20, color: "white" }}
                                >
                                    Playlist
                                </Text>
                            </View>
                            <View
                                style={{ width: "100%", height: "30%", }}
                            >
                                <Text
                                    style={{ fontSize: 10, color: "white" }}
                                >
                                    Build a playlist with songs or episodes
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.modal1}
                    >
                        <View
                            style={styles.modal1L}
                        >
                            <Collab width={40} height={40} />

                        </View>
                        <View
                            style={styles.modal1R}
                        >
                            <View
                                style={{ width: "100%", height: "70%", alignItems: "center", flexDirection: "row" }}
                            >
                                <Text
                                    style={{ fontSize: 20, color: "white" }}
                                >
                                    Collab
                                </Text>
                            </View>
                            <View
                                style={{ width: "100%", height: "30%", }}
                            >
                                <Text
                                    style={{ fontSize: 10, color: "white" }}
                                >
                                    Join forces to make the ultimate playlist
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>



                </View>






            </TouchableOpacity>
        </Modal>
    )
};

const Playlistadd = ({ isPlaylistaddVisible,
    togglePlaylistadd,
    styles,
    isPrivate,
    setIsPrivate,
    handlePlaylist,
    playlistName,
    setPlaylistName,
    description,
    setDescription
}) => {
    return (
        <Modal
            transparent
            visible={isPlaylistaddVisible}
            animationType="slide"
            onRequestClose={() => togglePlaylistadd()}
        >
            <View
                style={styles.playlistMain}
            >
                <View style={styles.PlaylistModal}>
                    <Text style={{ fontSize: 20, color: "white" }}>Create Playlist</Text>
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
                        <Text
                            style={{ color: "white" }}
                        >Private</Text>
                        <Switch
                            value={isPrivate}
                            onValueChange={setIsPrivate}
                            trackColor={{ false: "#767577", true: "wheat" }}
                            thumbColor={!isPrivate ? "white" : "wheat"}
                        />
                    </View>
                    <View
                        style={styles.ButtonContainer}
                    >
                        <TouchableOpacity
                            style={styles.Button}
                            onPress={() => handlePlaylist()}
                        >
                            <Text

                            >
                                Drop the Beat
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    )
}
const DisplayPlaylist = ({ item, index, styles, navigation }) => {
    return (
        <TouchableHighlight
            onPress={() => {
                console.log("Navigating to Playlist");
                navigation.navigate("Playlist", { index: index });
            }}
            style={{
                borderRadius: 3
            }}
            underlayColor="rgba(245,222,179,0.2)"
            activeOpacity={0.7}
        >
            <View
                style={styles.Playinfo}
                onPress={() => console.log(item)}
                key={item}
            >
                <View
                    style={styles.ImageContainer}
                >
                    <Image
                        source={item.image ? { uri: item.image } : icon}
                        style={{ width: 50, height: 50 }}
                    // fallback if user image fails to load
                    />
                </View>
                <View
                    style={styles.Name}
                >
                    <Text
                        style={{ fontSize: 20, color: "white" }}
                    >
                        {item.name}
                    </Text>
                    <Text
                        style={{ fontSize: 15, color: "white" }}
                    >
                        Playlist . Noctune
                    </Text>
                </View>
            </View>

        </TouchableHighlight>
    );
}