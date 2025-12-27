import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Constants from "expo-constants";
import { use } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
// In your MusicSlice.js
const MusicSlice = createSlice({
  name: "data",
  initialState: {
    data: [],
    pos: -1,
    seek: 0,
    isplaying: false,
    canLoad: false,
    isLoadedFromAsyncStorage: false, //NOTE: true | false will always evaluate to true in JavaScript (because of bitwise OR). isLoadedFromAsyncStorage: true | false,
    searchedMusic: false,
    searchedMusicHistory:[],
    searchTextHistory: [], // New: Store search query strings
    checkOnceNext:true
  },
  reducers: {
    setCheckOnceNext(state,action){
      state.checkOnceNext = action.payload
    },
       // Search text history reducers
    addSearchTextHistory(state, action) {
      const searchText = action.payload?.trim?.() || '';
      if (!searchText) return;
      
      // Remove existing entry (case-insensitive)
      const existingIndex = state.searchTextHistory.findIndex(
        item => item.toLowerCase() === searchText.toLowerCase()
      );
      if (existingIndex !== -1) {
        state.searchTextHistory.splice(existingIndex, 1);
      }
      
      // Add to beginning of array (most recent first)
      state.searchTextHistory.unshift(searchText);
      
      // Keep only last 10 searches
      if (state.searchTextHistory.length > 10) {
        state.searchTextHistory = state.searchTextHistory.slice(0, 10);
      }
      
      console.warn('Search history updated:', state.searchTextHistory);
    },
    clearSearchTextHistory(state) {
      state.searchTextHistory = [];
    },
    
    setSearchTextHistory(state, action) {
      state.searchTextHistory = Array.isArray(action.payload) ? action.payload : [];
    },
    setSearchedMusicHistory(state,action){
      if(state.searchedMusicHistory.count == 15){
        state.searchedMusicHistory.splice(state.searchedMusicHistory.count-1, 1); 
      }
      const upscaledUrl = action.payload.image.replace(
        /w\d+-h\d+/,
        "w500-h500"
      );
      const newMusic = {
        id: action.payload.id,
        title: action.payload.title || null,
        uploader: action.payload.artist || null,
        image: upscaledUrl || null,
        url: action.payload.url || null,
        duration: action.payload.duration || 0,
       
      };
      const id = newMusic.id;

      const index = state.searchedMusicHistory.findIndex(item => item.id === id);
      if (index !== -1) {
        state.searchedMusicHistory.splice(index, 1); 
      }

      state.searchedMusicHistory.push(newMusic);
    },
    deleteSearchedMusicHistory(state,action){
      state.searchedMusicHistory = [];
    },
    addMusic(state, action) {
      state.data = state.data.filter((item) => item.id !== action.payload.id);
      if (state.pos > state.data.length - 1) {
        state.pos = state.data.length - 1; // Ensure pos doesn't go out of bounds
      } else if (state.pos > state.data.length) {
        state.pos -= 1; // Decrement pos if item is before the current pos
      }
      console.log(action.payload.image);
      //console.warn("artist:",action.payload.artist)
      const upscaledUrl = action.payload.image.replace(
        /w\d+-h\d+/,
        "w500-h500"
      );
      const newMusic = {
        id: action.payload.id,
        title: action.payload.title || null,
        uploader: action.payload.uploader || action.payload.artist ||  null,
        image: upscaledUrl || null,
        duration: action.payload.duration || null,
        url: action.payload.url || null,
        //duration: action.payload.duration || 0,
      };
      console.log("Music data:", newMusic);
      //console.error(state.data[state.pos]?.duration);

      const insertPos = state.pos + 1;
      const newArray = [
        ...state.data.slice(0, insertPos),
        newMusic,
        ...state.data.slice(insertPos),
      ];
      state.data = newArray;
      state.pos = insertPos;
    },
    changeDATA(state, action) {
      state.data = action.payload;
      state.pos = 0;
      state.seek = 0;
      state.isplaying = true;
      state.canLoad = true;
      state.isLoadedFromAsyncStorage = false;
    },

    changePos(state, action) {
      //console.error("pos is being changed")
      //console.warn(state.pos);
      //console.warn(state.data.length - 1);
      if (action.payload == +1) {
        if (state.pos !== state.data.length - 1) {
          state.pos = state.pos + 1;
        }
      } else if (action.payload == -1) {
        if (state.pos > 0) {
          state.pos = state.pos - 1;
        }
      }
    },
    progress(state, action) {
      console.log("bro?");

      if (action.payload === 1 || action.payload === -1) {
        console.log(action.payload);
        state.seek = state.seek + action.payload; // Increment or decrement by 1
      } else {
        state.seek = action.payload; // Set the seek to the exact value if not +1 or -1
      }
    },
    setIsPlaying(state, action) {
      //console.warn("Is playing called")
      if (typeof action.payload === "boolean") {
        state.isplaying = action.payload; // Set specific value
      } else if (action.payload === "toggle") {
        state.isplaying = !state.isplaying; // Toggle
      }
    },
    load(state, action) {
      state.canLoad = action.payload;
      console.log("canLoad:", state.canLoad);
    },
    setIsLoadedFromAsyncStorage(state, action) {
      state.isLoadedFromAsyncStorage = action.payload;
    },
    setSearchedMusic(state, action) {
      state.searchedMusic = action.payload
    }
  },  

  extraReducers: (builder) => {
    builder
        .addCase(getPersistSearch.fulfilled, (state, action) => {
            try {
                const raw = action.payload;
                const response = typeof raw === "string" ? JSON.parse(raw) : raw;

                //console.error("PULLING SEARCHED MUSIC", response);
                state.searchedMusicHistory = Array.isArray(response) ? response : [];
            } catch (err) {
                //console.error("Error parsing searched music:", err);
                state.searchedMusicHistory = [];
            }
        })

        .addCase(getPersistSearch.pending, (state, action) => {


        })
        .addCase(getPersistSearch.rejected, (state, action) => {

        })
      }
});
export const {
  addMusic,
  changePos,
  progress,
  setIsPlaying,
  load,
  setIsLoadedFromAsyncStorage,
  changeDATA,
  setSearchedMusic,
  setSearchedMusicHistory,
  setCheckOnceNext,
  addSearchTextHistory,
  clearSearchTextHistory,
  setSearchTextHistory,
  deleteSearchedMusicHistory
} = MusicSlice.actions;
export default MusicSlice.reducer;


export const PersistSearch = createAsyncThunk("/persistSearch",async(song, { dispatch, getState })=>{
  try{
    dispatch(setSearchedMusicHistory(song))
    const history = getState().data.searchedMusicHistory;
    const user = getState().user.user
    //console.warn("History: ",history)
    //${Constants.expoConfig.extra.SERVER}
    const response = await axios.post( `${Constants.expoConfig.extra.SERVER}/api/persistsearch`,{searched:history,user:user?.id})
    return response.data
  }
  catch(error){
    //console.warn("Persist search error ",error)
  }

})

export const getPersistSearch = createAsyncThunk("/getpersistSearch",async(_,{ dispatch, getState })=>{
  try{
    const user = getState().user.user
    //console.warn("GETTING SEARCHED MUSICSS")
    //${Constants.expoConfig.extra.SERVER}
    const response = await axios.post( `${Constants.expoConfig.extra.SERVER}/api/getpersistsearch`,{user:user?.id})
    return response.data
  }
  catch(error){
    //console.warn("get search error ",error)
  }

})

export const deletePersistSearch = createAsyncThunk("/deletepersist",async(_,{dispatch,getState}) => {
  try{
    const user = getState().user.user
    const response = await axios.post( `${Constants.expoConfig.extra.SERVER}/api/deletepersist`, {user:user?.id})
    return response.data
  }
  catch(error){
    console.warn("Delete persistign music error");
    return { success: false, error: error.message };
  }
})

export const saveQueue = createAsyncThunk("music/saveQueue", async (_, { getState }) => {
  try {
    const state = getState().data;
    const jsonValue = JSON.stringify(state.data);
    console.warn(state.pos)
    const jsonPos = JSON.stringify(state.pos)
    console.warn(jsonPos)
    await AsyncStorage.setItem("Queue", jsonValue);
    await AsyncStorage.setItem("position",jsonPos)
  } catch (e) {
    console.error("Error saving song metadata", e);
  }
});


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
//       //console.error("Metadata fetch error:", error.message);
//       return rejectWithValue(error.response?.data || "Something went wrong");
//     }
//   }
// );
