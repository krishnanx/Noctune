import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Constants from "expo-constants";

// In your MusicSlice.js
const MusicSlice = createSlice({
  name: "Music",
  initialState: {
    data: [],
    pos:-1,
    seek:0,
    isplaying:false,
    canLoad:false
  },
  reducers: {
    addMusic(state, action) {
      state.data = state.data.filter(item => item.id !== action.payload.id);
      if (state.pos > state.data.length - 1) {
        state.pos = state.data.length - 1;  // Ensure pos doesn't go out of bounds
      } else if (state.pos > state.data.length) {
        state.pos -= 1; // Decrement pos if item is before the current pos
      }
      console.log(action.payload.image);
      const upscaledUrl = action.payload.image.replace(/w\d+-h\d+/, 'w500-h500');
      const newMusic = {
        id:action.payload.id,
        title: action.payload.title || null ,
        uploader: action.payload.artist || null,
        image: upscaledUrl || null, 
        duration: action.payload.duration || null,
        url: action.payload.url || null,
        duration: action.payload.duration || 0
      };
      console.log("Music data:",newMusic)
      const insertPos = state.pos+ 1;
      const newArray = [
        ...state.data.slice(0, insertPos),
        newMusic,
        ...state.data.slice(insertPos),
      ];
      state.data = newArray;
      state.pos = insertPos;
    },
    changePos(state, action) {
      console.log(state.pos);
      console.log(state.data.length-1)
      if(action.payload == +1){
        if(state.pos!==state.data.length-1){
          state.pos = state.pos + 1;
        }
      }
      else if(action.payload == -1){
        if(state.pos>0){
          state.pos = state.pos - 1;
        }
      }
    },
    progress(state, action) {
      console.log("bro?")
      
      if (action.payload === 1 || action.payload === -1) {
        console.log(action.payload)
        state.seek = state.seek + action.payload;   // Increment or decrement by 1
      } else {
        state.seek = action.payload;  // Set the seek to the exact value if not +1 or -1
      }
    },
    setIsPlaying(state, action) {
      if (typeof action.payload === "boolean") {
        state.isplaying = action.payload; // Set specific value
      } else if (action.payload === "toggle") {
        state.isplaying = !state.isplaying; // Toggle
      }
    },
    load(state,action){
      state.canLoad = action.payload;
      console.log("canLoad:",state.canLoad)
    }
    
  },
  // extraReducers: (builder) => {
  //   builder
  //     .addCase(FetchMetadata.pending, (state) => {
  //       state.status = "loading";
  //     })
  //     .addCase(FetchMetadata.fulfilled, (state, action) => {
  //       state.status = "succeeded";
  //       // Store the metadata explicitly
        // const newMusic = {
        //   id:action.payload.id,
        //   title: action.payload.title,
        //   uploader: action.payload.uploader,
        //   image: action.payload.thumbnail, 
        //   duration: action.payload.duration,
        //   url: action.payload.url || null, 
        // };
        // state.data = [...state.data,newMusic];
  //       console.log("Metadata stored in state:", action.payload);
  //     })
  //     .addCase(FetchMetadata.rejected, (state, action) => {
  //       state.status = "failed";
  //       state.error = action.payload;
  //     });
  // },
});
export const { addMusic, changePos,progress,setIsPlaying,load } = MusicSlice.actions;
export default MusicSlice.reducer;
// export const FetchMetadata = createAsyncThunk(
//   "/FetchMetadata",
//   async ({ text }, { rejectWithValue }) => {
//     try {
//       console.log("Fetching metadata for:", text);
//       console.log("Express server:", Constants.expoConfig.extra.SERVER);

//       const response = await axios.get(
//         `${Constants.expoConfig.extra.SERVER}/api/stream`,
//         {
//           params: { url: text },
//         }
//       );
//       const metadata = {
//         title: response.headers.get("X-Title"),
//         uploader: response.headers.get("X-Artist"),
//         thumbnail: response.headers.get("X-Thumbnail"),
//         duration: Number(response.headers.get("X-Duration")),
//       };
     
//       console.log("META DATA");
//       console.log(metadata);
//       return metadata; // Metadata (title, duration, etc.)
//     } catch (error) {
//       console.error("Metadata fetch error:", error.message);
//       return rejectWithValue(error.response?.data || "Something went wrong");
//     }
//   }
// );
