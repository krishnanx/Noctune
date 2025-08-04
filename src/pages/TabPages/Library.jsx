import React, { useEffect, useState } from 'react'
import { ScrollView, View, StyleSheet, Text, ViewBase, TouchableOpacity, Modal, Image, TextInput, Switch, FlatList, TouchableHighlight } from 'react-native'
import { Download } from 'react-native-feather';
import ThreeDots from "../../Components/Icons/ThreeDots"
import SearchIcon from '../../Components/Icons/Search';
import AddIcon from '../../Components/Icons/AddIcon';
import Migrate from '../../Components/Icons/Migrate';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from "@react-navigation/native";
import MusicNote from "../../Components/Icons/MusicNote"
import Collab from "../../Components/Icons/Collab"
import icon from "../../../assets/LikedSongs/heart.png"
import normicon from "../../../assets/LikedSongs/Frame 4.png";
import { addPlaylist } from '../../../Store/PlaylistSlice';
import { useNavigation } from '@react-navigation/native';
import { AddNewPlaylist } from '../../../Store/PlaylistSlice';
import { Dimensions } from 'react-native';
import FadeWrapper from '../../../Navigation/FadeWrapper.jsx';

const Library = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);

    const [isPlaylistaddVisible, setisPlaylistaddVisible] = useState(false);
    const [isPrivate, setIsPrivate] = useState(false);
    const [playlistName, setPlaylistName] = useState("");
    const [description, setDescription] = useState("")
    const [PlaceHolder,setPlaceHolder] = useState("Playlist Name")
    const { colors } = useTheme();
    const { data, id: playid } = useSelector((state) => state.playlist);
    //const { user, id } = useSelector((state) => state.user)
    const { user, id } = useSelector((state) => state.user || {});

    const navigation = useNavigation();
    const screenWidth = Dimensions.get('window').width;
    const toggleModal = () => {
        setIsModalVisible((prev) => !prev);
    };
    const togglePlaylistadd = () => {
        setisPlaylistaddVisible((prev) => !prev);
    };
    // useEffect(() => { //console.warn(data) }, [])
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

            height: "30%",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
            paddingBottom: 90,
            backgroundColor: colors.border,
            gap: 5,
            paddingHorizontal: 25,
            marginHorizontal:"3%"
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
            //backgroundColor: colors.text,
            borderRadius: 20,
            padding: 25,
            backgroundColor:colors.card,
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
            color: colors.text,
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
            color: colors.text,
            width: 120,
            height: 40,
            backgroundColor: colors.primary,
            borderRadius: 20,
            justifyContent: "center",
            alignItems: "center"
        },
        Playinfo: {
            width: "100%",
            // /height: 80,
            //backgroundColor:"red",
            alignItems: "center",

            flexDirection: "row"
        },
        ImageContainer: {
            width: 60,
            height: 60,
            //backgroundColor: "white",
            justifyContent: "center",
            alignItems: "center"
        },
        Name: {
            width: screenWidth - 60,
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
        if(playlistName!=""){
            togglePlaylistadd();
            const playlist = {
                id: playid + 1,
                image: null,
                name: playlistName,
                desc: description,
                songs: [],
                Time: 0,
                isPlaying: false
            }
            dispatch(addPlaylist({ playlist: playlist }));
            dispatch(AddNewPlaylist({ data: playlist, userid: user?.id }))
            setDescription("");
            setPlaylistName("");
        }
        else{
            setPlaceHolder("Enter a valid name")
        }
    }
    return (
        <FadeWrapper>
        <ScrollView
            style={styles.Main}
            contentContainerStyle={{ alignItems: 'center', paddingBottom: 100, paddingHorizontal: 20, paddingTop: 30, height: 1000 }}
            keyboardShouldPersistTaps="handled"
        >
            <View
                style={styles.Header}
            >
                <View
                    style={styles.HeaderInside}
                >
                    <Text
                        style={{ fontSize: 30, color: colors.text }}
                    >
                        Your Library
                    </Text>
                </View>
                <View
                    style={[styles.HeaderInside, { width: "25%" }]}
                >
                    <SearchIcon width={30} height={30} fill={colors.text} />
                    <TouchableOpacity
                        onPress={() => toggleModal()}
                    >
                        <AddIcon width={30} height={30} fill={colors.text} />
                    </TouchableOpacity>
                </View>
            </View>
            <View
                style={styles.body}
            >
                <FlatList
                    data={[...data].sort((a, b) => a.id - b.id)}
                    renderItem={({ item, index }) => <DisplayPlaylist item={item}
                        index={index}
                        styles={styles}
                        navigation={navigation}
                        colors ={colors}
                    />}
                    keyExtractor={(item, index) => index.toString()}
                    scrollEnabled={false}
                />
                <Custom_modal
                    isModalVisible={isModalVisible}
                    styles={styles}
                    toggleModal={toggleModal}
                    handlePress={handlePress}
                    navigation={navigation}
                    colors={colors}
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
                    PlaceHolder = {PlaceHolder}
                    colors={colors}
                />

            </View>

        </ScrollView>
        </FadeWrapper>
    )
}

export default Library

const Custom_modal = ({ isModalVisible, styles, toggleModal, handlePress, navigation,colors }) => {
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
                        <View style={styles.modal1L}>
                            <MusicNote width={40} height={40} fill="violet" />
                        </View>
                        <View style={styles.modal1R}>
                            <View
                                style={{
                                    width: "100%",
                                    height: "50%",
                                    alignItems: "center",
                                    flexDirection: "row",
                                }}
                            >
                                <Text style={{ fontSize: 20, color: colors.text }}>Playlist</Text>
                            </View>
                            <View style={{ width: "100%", height: "30%" }}>
                                <Text style={{ fontSize: 12, color: colors.text }}>
                                    Build a playlist with songs or episodes
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.modal1}>
                        <View style={styles.modal1L}>
                            <Collab width={40} height={40} fill="violet" />
                        </View>
                        <View style={styles.modal1R}>
                            <View
                                style={{
                                    width: "100%",
                                    height: "50%",
                                    alignItems: "center",
                                    flexDirection: "row",
                                }}
                            >
                                <Text style={{ fontSize: 20, color: colors.text }}>Collab</Text>
                            </View>
                            <View style={{ width: "100%", height: "30%" }}>
                                <Text style={{ fontSize: 12, color: colors.text }}>
                                    Join forces to make the ultimate playlist
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.modal1}
                        onPress={() => {
                            toggleModal();
                            navigation.push("Migrate");
                        }}
                    >
                        <View style={styles.modal1L}>
                            <Migrate width={40} height={40} fill="violet" />
                        </View>
                        <View style={styles.modal1R}>
                            <View
                                style={{
                                    width: "100%",
                                    height: "50%",
                                    alignItems: "center",
                                    flexDirection: "row",
                                }}
                            >
                                <Text style={{ fontSize: 20, color: colors.text }}>
                                    Noctune Sync
                                </Text>
                            </View>
                            <View style={{ width: "100%", height: "30%" }}>
                                <Text
                                    style={{ fontSize: 12, color: colors.text, lineHeight: 11 }}
                                >
                                    Transfer your Spotify playlists to Noctune in just a few
                                    taps
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        </Modal>
    );
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
    setDescription,
    PlaceHolder,
    colors
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
                    <Text style={{ fontSize: 20, color: colors.text }}>Create Playlist</Text>
                    <TextInput
                        placeholder={PlaceHolder}
                        value={playlistName}
                        onChangeText={setPlaylistName}
                        placeholderTextColor={PlaceHolder == "Enter a valid name" ? "red":colors.text}
                        style={styles.input}
                    />

                    <TextInput
                        placeholder="Description (optional)"
                        value={description}
                        onChangeText={setDescription}
                        placeholderTextColor={colors.text}
                        style={[styles.input, { height: 100 }]}
                    />

                    <View style={styles.switchContainer}>
                        <Text
                            style={{ color:colors.text }}
                        >Private</Text>
                        <Switch
                            value={isPrivate}
                            onValueChange={setIsPrivate}
                            trackColor={{ false: "#767577", true: colors.primary }}
                            thumbColor={!isPrivate ? colors.primary : colors.primary}
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

const DisplayPlaylist = ({ item, index, styles, navigation,colors }) => {
    return (

        <TouchableHighlight
            onPress={() => {
                console.log("Navigating to Playlist");
                navigation.navigate("Playlist", { index: index });
            }}
            style={{
                borderRadius: 25,
                // /backgroundColor: "rgba(128,128,128,0.2)",
                marginBottom: 5,
                height: 80,
                paddingLeft: 15,
                paddingVertical: 0,
                justifyContent:"center"
            }}
            underlayColor="rgba(128,128,128,0.2)"
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
                    {/* {//console.warn("SONG ARRAY, ", item)} */}
                    <Image
                        source={item.id == 0 ? item.image ? { uri: item.image } : item.songs?.length > 0 ? { uri: item.songs[0].image } : icon :
                            item.image ? { uri: item.image } : item.songs?.length > 0 ? { uri: item.songs[0].image } : normicon}
                        style={{ width: 50, height: 50 , borderRadius:10 }}
                    // fallback if user image fails to load
                    />
                </View>
                <View
                    style={styles.Name}
                >
                    <Text
                        style={{ fontSize: 20, color:colors.text, width: "95%", paddingHorizontal: 5, flexWrap: "wrap" }}
                    >
                        {item.name}
                    </Text>
                    <Text
                        style={{ fontSize: 15, color:colors.text, paddingLeft: 5 }}
                    >
                        Playlist . Noctune
                    </Text>
                </View>
            </View>

        </TouchableHighlight>
    );
}