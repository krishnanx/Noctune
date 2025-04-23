import { createSlice } from "@reduxjs/toolkit";

const PlaylistSlice = createSlice({
    name:"playlist",
    initialState:{
        data:[{name:"Playlist",image:null},{name:"Playlist",image:null},{name:"Playlist",image:null}]
    },
    reducers:{
        addPlaylist(state,action){
            const playlist = {
                image:action.payload.image || null,
                name:action.payload.name,
                desc:action.payload.desc,
            }
            state.data = [...state.data,playlist];
        }
    }
})
export const {addPlaylist} = PlaylistSlice.actions;
export default PlaylistSlice.reducer;