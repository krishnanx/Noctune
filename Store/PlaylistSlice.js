import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const PlaylistSlice = createSlice({
    name: "playlist",
    initialState: {
        data: [],
        id: -1,
        playlistNo: -1
    },
    reducers: {
        addPlaylist(state, action) {
            const playlist = {
                id: state.id + 1,
                image: action.payload.image || null,
                name: action.payload.name,
                desc: action.payload.desc,
                songs: [],
                Time: 0,
                isPlaying: false
            }
            state.data = [...state.data, playlist];
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
                state.data[action.payload.id].isPlaying = action.payload.action; // Set specific value
            } else if (action.payload.action === "toggle") {
                state.data[action.payload.id].isPlaying = !state.data[action.payload.id].isPlaying // Toggle
            }

        },
        changePlaylist(state, action) {
            state.playlistNo = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder

            .addCase(migrate.fulfilled, (state, action) => {

                const response = action.payload;
                const id = state.id + 1;
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

            })

    }
})
export const { addPlaylist, addMusicinPlaylist, setPlaylistplaying, changePlaylist } = PlaylistSlice.actions;
export default PlaylistSlice.reducer;
export const migrate = createAsyncThunk('/migratedata', async ({ Url: data }) => {
    try {
        console.warn(data)
        const response = await axios.post("http://192.168.1.44/api/migrate", { playlist: data })
        console.warn("reached back")
        return response.data
    }
    catch (e) {
        console.error("error migrating!!", e)
    }
})