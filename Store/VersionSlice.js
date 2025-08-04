import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import Constants from 'expo-constants';
import * as Application from 'expo-application';

const CURRENT_VERSION = Application.nativeApplicationVersion;

export const checkAppVersion = createAsyncThunk('/checkAppVersion', async () => {
  try {
    const response = await axios.get(`${Constants.expoConfig.extra.SERVER}/api/app-version`);
    //const response = await axios.get(`${Constants.expoConfig.extra.SERVER}/api/app-version`);
    const latestVersion = response.data.version;
    // console.warn("00000000000000000000")
    // console.warn("RESPONSE", response)

    const isOutdated = CURRENT_VERSION !== latestVersion;

    return {
      current: CURRENT_VERSION,
      latest: latestVersion,
      updateUrl: response.data.updateUrl,
      outdated: isOutdated
    };
  } catch (e) {
    console.error('Version check failed:', e);
    throw e;
  }
});

const VersionSlice = createSlice({
  name: 'version',
  initialState: {
    current: CURRENT_VERSION,
    latest: null,
    outdated: false,
    updateUrl: null,
    showBanner: false,
  },
  reducers: {
    hideBanner(state) {
      state.showBanner = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(checkAppVersion.fulfilled, (state, action) => {
      state.latest = action.payload.latest;
      state.outdated = action.payload.outdated;
      state.updateUrl = action.payload.updateUrl;
      state.showBanner = action.payload.outdated;
    });
  },
});

export const { hideBanner } = VersionSlice.actions;
export default VersionSlice.reducer;