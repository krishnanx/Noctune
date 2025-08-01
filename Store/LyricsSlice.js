
import { createSlice } from '@reduxjs/toolkit';

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