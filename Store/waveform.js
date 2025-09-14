import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  lastScrollX: 0,
  lastSmoothPosition: 0,
};

const waveformSlice = createSlice({
  name: 'waveformSlice',
  initialState,
  reducers: {
    updateWaveformPosition: (state, action) => {
      state.lastScrollX = action.payload.lastScrollX;
      state.lastSmoothPosition = action.payload.lastSmoothPosition;
    },
    resetWaveformPosition: (state) => {
      state.lastScrollX = 0;
      state.lastSmoothPosition = 0;
    },
  },
});

export const { updateWaveformPosition, resetWaveformPosition } = waveformSlice.actions;
export default waveformSlice.reducer;
