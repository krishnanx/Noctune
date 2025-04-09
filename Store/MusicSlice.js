import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Constants from 'expo-constants';
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
export const DownloadMusic = createAsyncThunk(
    "/Download",
    async ({ text }, { rejectWithValue }) => {  // <-- Destructure rejectWithValue
        try {
            console.log("function reached", text);
            console.log("server", Constants.expoConfig.extra.SERVER)
            const response = await axios.post(

                Constants.expoConfig.extra.SERVER,
                { data: text },
                {
                    headers: { "Content-Type": "application/json" },
                    responseType: "arraybuffer", // <-- Important for binary data
                }
            );

            return response.data; // This will be the MP3 binary data
        } catch (error) {
            return rejectWithValue(error.response?.data || "Something went wrong");
        }
    }
);