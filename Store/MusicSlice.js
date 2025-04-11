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
    },
    extraReducers: (builder) => {
        builder
            .addCase(FetchMetadata.pending, (state) => {
                state.status = "loading";
            })
            .addCase(FetchMetadata.fulfilled, (state, action) => {
                state.data = action.payload;
                state.status = "idle";
            })
            .addCase(FetchMetadata.rejected, (state, action) => {
                state.status = "error";
            });
    },

})
export const { addMusic } = MusicSlice.actions;
export default MusicSlice.reducer;
export const FetchMetadata = createAsyncThunk(
    "/FetchMetadata",
    async ({ text }, { rejectWithValue }) => {
        try {
            console.log("📥 Fetching metadata for:", text);
            console.log("🔗 Express server:", Constants.expoConfig.extra.SERVER);

            const response = await axios.get(`${Constants.expoConfig.extra.SERVER}/api/metadata`, {
                params: { url: text },
            });
            console.log(response.data);
            return response.data; // Metadata (title, duration, etc.)
        } catch (error) {
            console.error("❌ Metadata fetch error:", error.message);
            return rejectWithValue(error.response?.data || "Something went wrong");
        }
    }
);