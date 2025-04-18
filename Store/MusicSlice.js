import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Constants from "expo-constants";

// In your MusicSlice.js
const MusicSlice = createSlice({
  name: "Music",
  initialState: {
    data: [],
    status: "idle",
    Url: "",
    error:null
  },
  reducers: {
    addMusic(state, action) {
      state.data = action.payload;
    },
    addUrl(state, action) {
      state.Url = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(FetchMetadata.pending, (state) => {
        state.status = "loading";
      })
      .addCase(FetchMetadata.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Store the metadata explicitly
        state.data = action.payload;
        console.log("Metadata stored in state:", action.payload);
      })
      .addCase(FetchMetadata.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});
export const { addMusic, addUrl } = MusicSlice.actions;
export default MusicSlice.reducer;
export const FetchMetadata = createAsyncThunk(
  "/FetchMetadata",
  async ({ text }, { rejectWithValue }) => {
    try {
      console.log("📥 Fetching metadata for:", text);
      console.log("🔗 Express server:", Constants.expoConfig.extra.SERVER);

      const response = await axios.get(
        `${Constants.expoConfig.extra.SERVER}/api/stream`,
        {
          params: { url: text },
        }
      );
      
      const metadata = {
        title: response.headers.get("X-Title"),
        uploader: response.headers.get("X-Artist"),
        thumbnail: response.headers.get("X-Thumbnail"),
        duration: Number(response.headers.get("X-Duration")),
      };
     
      console.log("META DATA");
      console.log(metadata);
      return metadata; // Metadata (title, duration, etc.)
    } catch (error) {
      console.error("❌ Metadata fetch error:", error.message);
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);
