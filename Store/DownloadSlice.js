import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios, { Axios } from "axios";
import Constants from "expo-constants";
import { progress } from "./MusicSlice";
import { manuallyCloseWebSocket } from "../src/Websocket/Websocket";
const DownloadSlice = createSlice({
  name: "download",
  initialState: {
    songs: [],
    status: "idle",
    completed: 0,
    path: "",
    finalData: [],
  },
  reducers: {
    addSong(state, action) {
      const array = action.payload.data.map(item => ({ ...item, progress: 0 })

      )
      state.songs = array
    },
    changeProgress(state, action) {
      state.songs[action.payload.index].progress = action.payload.progress
    },
    setCompleted(state, action) {
      if (action.payload == 1) {
        state.completed += action.payload
      }
      else if (action.payload == 0) {
        state.completed = action.payload
      }
    },
    addPath(state, action) {
      state.path = action.payload.path
    },
    addData(state, action) {
      const data = action.payload.final
      const status = "idle"
      state.finalData = [...state.finalData, { data: data, status: status }]
    },
    changeSongStatus(state, action) {
      state.finalData[action.payload.index].status = action.payload.status
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(download.pending, (state, action) => {
        state.status = "downloading"
      })
      .addCase(download.fulfilled, (state, action) => {
        state.status = "idle"
        manuallyCloseWebSocket()
      })
      .addCase(download.rejected, (state, action) => {
        state.status = "error"
      })
  }
})
export const { addSong, changeProgress, setCompleted, addPath, addData, changeSongStatus } = DownloadSlice.actions;
export default DownloadSlice.reducer;

export const download = createAsyncThunk(
  "download/music",
  async ({ data, ClientId }, { rejectWithValue }) => {
    console.warn("=== REDUX THUNK DEBUG ===");
    console.warn("Input data:", data);
    console.warn("ClientId:", ClientId);
    console.warn("Data type:", typeof data);
    console.warn("Is array?", Array.isArray(data));
    console.warn("Data length:", data?.length);
    // Validation
    if (!data || !Array.isArray(data)) {
      const error = "Data must be an array";
      console.error(error);
      return rejectWithValue(error);
    }

    if (!ClientId) {
      const error = "ClientId is required";
      console.error(error);
      return rejectWithValue(error);
    }

    // Ensure data contains valid items
    const validatedData = data.map((item, index) => {
      if (typeof item === 'string') {
        // If it's a string, treat it as a URL
        return item;
      } else if (typeof item === 'object' && item !== null) {
        // If it's an object, ensure it has required fields
        return {
          url: item.url || '',
          title: item.title || `Track_${index}`,
          uploader: item.uploader || item.artist || 'Unknown Artist',
          artist: item.artist || null,
          image: item.image || item.thumbnail || null
        };
      } else {
        console.warn(`Invalid item at index ${index}:`, item);
        return null;
      }
    }).filter(item => item !== null); // Remove invalid items

    if (validatedData.length === 0) {
      const error = "No valid URLs or items found in data";
      console.error(error);
      return rejectWithValue(error);
    }

    const payload = {
      data: validatedData,
      ClientId
    };

    console.warn("Sending payload:", payload);
    console.warn("Validated data count:", validatedData.length);

    try {
      // 192.168.85.33 K
      // 192.168.1.44 krish
      const response = await axios.post(
        `${Constants.expoConfig.extra.SERVER
        }/api/download`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 300000, // 5 minute timeout
        }
      );

      console.warn("Response status:", response.status);
      console.warn("Response data:", response.data);
      if(response.data.message == "All downloads complete"){
        console.error("=============close=============")
        manuallyCloseWebSocket()
        
      }
      return response.data;
    } catch (error) {
      console.error("=== REDUX THUNK ERROR ===");
      console.error("Request failed:", error.message);

      if (error.response) {
        console.error("Error response status:", error.response.status);
        console.error("Error response data:", error.response.data);

        return rejectWithValue({
          status: error.response.status,
          message: error.response.data?.error || error.response.data?.detail || "Server error",
          details: error.response.data
        });
      } else if (error.request) {
        console.error("No response received");
        return rejectWithValue({
          status: 0,
          message: "No response from server",
          details: "Network error or server unavailable"
        });
      } else {
        console.error("Request setup error:", error.message);
        return rejectWithValue({
          status: 0,
          message: error.message,
          details: "Request configuration error"
        });
      }
    }
  }
);