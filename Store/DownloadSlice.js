import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios, { Axios } from "axios";
const DownloadSlice = createSlice({
    name: "download",
    initialState: {
        songs: [],
        status: "idle"
    },
    reducers: {
        addSong(state, action) {
            state.songs = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(download.pending, (state, action) => {
                state.status = "downloading"
            })
            .addCase(download.fulfilled, (state, action) => {
                state.status = "idle"
            })
            .addCase(download.rejected, (state, action) => {
                state.status = "error"
            })
    }
})
export const { addSong } = DownloadSlice.actions;
export default DownloadSlice.reducer;
export const download = createAsyncThunk('download/music', async ({ data, ClientId }) => {
    console.warn("blahh")
    console.warn({ data, ClientId })

    const song = data.map(element => element.url);

    console.warn(song, ClientId)
    const response = await axios.post("http://192.168.1.44/api/download", { song, ClientId },);
    return response.data; // This will be returned to your Redux store
});