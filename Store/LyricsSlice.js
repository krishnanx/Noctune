
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchFullLyrics = createAsyncThunk(
  'lyrics/fetchFull',
  async (songId, { getState, rejectWithValue }) => {
    const state = getState();
    
    // Check if lyrics already loaded for the song
    if (state.lyrics.fullLyrics && state.lyrics.currentSongId === songId) {
      return state.lyrics.fullLyrics;
    }
    
    try {
      const response = await fetch(`/api/lyrics/full/${songId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch lyrics');
      }
      const data = await response.json();
      return data.lyrics;
    } catch (error) {
      return rejectWithValue(error.message);
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
  extraReducers: (builder) => {
    builder
      .addCase(fetchFullLyrics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFullLyrics.fulfilled, (state, action) => {
        state.loading = false;
        state.fullLyrics = action.payload;
      })
      .addCase(fetchFullLyrics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setPreviewLyrics, setCurrentSongId,setFullLyrics, clearLyrics } = LyricsSlice.actions;
export default LyricsSlice.reducer;