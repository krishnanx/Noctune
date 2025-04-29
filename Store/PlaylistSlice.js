import { createSlice } from "@reduxjs/toolkit";

const PlaylistSlice = createSlice({
    name: "playlist",
    initialState: {
        data: [],
        id: -1
    },
    reducers: {
        addPlaylist(state, action) {
            const playlist = {
                id: state.id + 1,
                image: action.payload.image || null,
                name: action.payload.name,
                desc: action.payload.desc,
                songs: [],
                Time: 0
            }
            state.data = [...state.data, playlist];
        },
        addMusicinPlaylist(state, action) {
            let bool = true;
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


        }
    }
})
export const { addPlaylist, addMusicinPlaylist } = PlaylistSlice.actions;
export default PlaylistSlice.reducer;