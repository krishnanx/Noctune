
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Constants from 'expo-constants';
export const fetchFullLyrics = createAsyncThunk(
  'lyrics/fetchFull',
  async (songId, { getState, rejectWithValue }) => {
    const state = getState();
    
    // Check if lyrics already loaded for the song
    if (state.lyrics.fullLyrics && state.lyrics.currentSongId === songId) {
      return state.lyrics.fullLyrics;
    }
    
   try {
      const response = await axios.get(`${Constants.expoConfig.extra.SERVER}/api/lyrics/full/${songId}`);
      return response.data.lyrics;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const LyricsSlice = createSlice({
  name: 'lyrics',
  initialState: {
    previewLyrics: '',
    fullLyrics: '',
    currentSongId: null,
    loading: false,
    error: null,
  },
  reducers: {
    setPreviewLyrics: (state, action) => {
      state.previewLyrics = action.payload;
    },
    setCurrentSongId: (state, action) => {
      if (state.currentSongId !== action.payload) {
        // Clear lyrics when song changes
        state.previewLyrics = '';
        state.fullLyrics = '';
        state.currentSongId = action.payload;
      }
    },
    setFullLyrics: (state, action) => {
      state.fullLyrics = action.payload;
    },
    clearLyrics: (state) => {
      state.previewLyrics = '';
      state.fullLyrics = '';
      state.currentSongId = null;
      state.error = null;
    },
  },
});

export const { setPreviewLyrics, setCurrentSongId,setFullLyrics, clearLyrics } = LyricsSlice.actions;
export default LyricsSlice.reducer;