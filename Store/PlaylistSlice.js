import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Constants from "expo-constants";

const PlaylistSlice = createSlice({
    name: "playlist",
    initialState: {
        data: [],
        id: -1,
        playlistNo: -1,
        migrateSliceSucess: false,
        migratedPlaylist: []
    },
    reducers: {
        addPlaylist(state, action) {

            state.data = [...state.data, action.payload.playlist];
            state.id = state.id + 1
            console.warn(state.id)
        },
        updatemigrateSliceSucess(state, action) {
            state.migrateSliceSucess = action.payload.success
        },
        updataID(state, action) {
            state.id = state.data.length - 1
        },
        addMusicinPlaylist(state, action) {
            let bool = true;
            if (state.data[action.payload.id].songs.length === 0) {
                console.warn(action.payload.music.image)
                state.data[action.payload.id].image = action.payload.music.image
            }
            state.data[action.payload.id].songs.forEach(element => {
                if (element.id === action.payload.music.id) {
                    bool = false
                }
            });
            if (bool) {
                state.data[action.payload.id].songs = [...state.data[action.payload.id].songs, action.payload.music]
            }
            state.data[action.payload.id].Time += action.payload.music.duration
            // state.data[action.payload.id].songs.forEach(element => {
            //     state.data[action.payload.id].Time += element.duration
            // });
            console.log("Time", state.data[action.payload.id].Time)


        },
        setPlaylistplaying(state, action) {
            if (typeof action.payload.action === "boolean") {
                if (action.payload.action) {
                    state.data.forEach((item, index) => {
                        if (index != action.payload.id) {
                            state.data[index].isPlaying = false
                        }
                    })
                }
                state.data[action.payload.id].isPlaying = action.payload.action; // Set specific value

            } else if (action.payload.action === "toggle") {
                state.data[action.payload.id].isPlaying = !state.data[action.payload.id].isPlaying // Toggle

                state.data.forEach((item, index) => {
                    if (index != action.payload.id) {
                        state.data[index].isPlaying = false
                    }
                })
            }

        },
        changePlaylist(state, action) {
            state.playlistNo = action.payload;
        },
        updatePlaylistData(state, action) {
            const { index, updatedData } = action.payload;
            if (state.data[index]) {
                state.data[index] = { ...state.data[index], ...updatedData };
            }
        }
    },
    extraReducers: (builder) => {
        builder

            .addCase(migrate.fulfilled, (state, action) => {

                const response = action.payload;
                const id = state.id + 1;
                state.id = id
                console.warn("id", id)
                const playlist = {
                    id: id,
                    image: response[0].cover_url || null,
                    name: response[0].album_name,
                    desc: "imported from spotify",
                    songs: [],
                    Time: 0,
                    isPlaying: false
                }
                state.data = [...state.data, playlist];
                const song = [];

                response.forEach((item) => {
                    song.push({
                        id: item.song_id,
                        title: item.name || null,
                        uploader: item.artist || null,
                        image: item.cover_url || null,
                        url: item.url || null,
                        duration: item.duration || 0,
                    });
                    state.data[id].Time += item.duration;
                });

                state.data[id].songs = song
                state.migratedPlaylist = state.data[id]
                state.migrateSliceSucess = true

            })
            .addCase(migrate.pending, (state, action) => {


            })
            .addCase(migrate.rejected, (state, action) => {



            })
            .addCase(AddNewPlaylist.fulfilled, (state, action) => {

                const response = action.payload;
                console.warn("New playlist added")

            })
            .addCase(AddNewPlaylist.pending, (state, action) => {

                const response = action.payload;

            })
            .addCase(AddNewPlaylist.rejected, (state, action) => {

                const response = action.payload;

            })
            .addCase(pullPlaylists.fulfilled, (state, action) => {

                const response = action.payload;
                var array = []
                response.forEach((item) => {
                    const data = item.value;
                    array = [...array, data]

                }
                )
                array.sort((a, b) => a.id - b.id)
                state.data = array
                console.warn(response)
                console.error("Playlists taken")

            })
            .addCase(addMusictoPlaylist.fulfilled, (state, action) => {
                const response = action.payload;
                console.error(response)
            })



    }
})

export const { addPlaylist, addMusicinPlaylist, setPlaylistplaying, changePlaylist, updataID, updatemigrateSliceSucess, updatePlaylistData } = PlaylistSlice.actions;

export default PlaylistSlice.reducer;
export const migrate = createAsyncThunk('/migratedata', async ({ Url: data }) => {
    try {
        console.warn(data)
        const response = await axios.post(`${Constants.expoConfig.extra.SERVER
            }/api/migrate`, { playlist: data })
        console.warn("reached back")
        return response.data
    }
    catch (e) {
        console.error("error migrating!!", e)
    }
})
export const AddNewPlaylist = createAsyncThunk('/newplaylist', async ({ data: playlist, userid: userid }) => {
    try {
        console.warn("adding new playlist");
        const response = await axios.post(`${Constants.expoConfig.extra.SERVER
            }/playlist/NewPlaylists`, { playlist: playlist, user: userid })
        // const response = await axios.post(`http://192.168.1.44/playlist/NewPlaylists`, { playlist: playlist, user: userid })

        return response.data
    }
    catch (e) {
        console.error(e)
    }
})

export const pullPlaylists = createAsyncThunk('/pullPlaylists', async ({ user: user }) => {
    try {
        console.warn("pulling playlist");
        console.warn("user reached pull: ", user)

        const response = await axios.post(`${Constants.expoConfig.extra.SERVER
            }/playlist/pullPlaylist`
            , { data: user })

        return response.data
    }
    catch (e) {
        console.error(e)
    }
})
export const addMusictoPlaylist = createAsyncThunk('/addMusic', async ({ playlist: playlist, user: user, music: music }) => {
    try {
        console.warn("pulling playlist");
        console.warn("user reached pull: ", user)
        const response = await axios.post(`${Constants.expoConfig.extra.SERVER
            }/playlist/addMusic`, { playlist: playlist, user: user, music: music })
        return response.data
    }
    catch (e) {
        console.error(e)
    }
})