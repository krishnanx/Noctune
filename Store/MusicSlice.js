import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const MusicSlice = createSlice({
    name: "Music",
    initialState: {
        data: []
    },
    reducers: {
        addMusic(state, action) {
            state.data = action.payload
        }
    }
})
export const { addMusic } = MusicSlice.actions;
export default MusicSlice.reducer;
export const DownloadMusic = createAsyncThunk("/Download", async ({ text }) => {
    try {
        console.log("function reached", text);
        const response = await axios.post("http://192.168.26.235:80/download/", { data: text }, {
            headers: { "Content-Type": "application/json" }
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || "Something went wrong");
    }
});