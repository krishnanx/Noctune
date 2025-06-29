import { createSlice } from '@reduxjs/toolkit';
import { signIn, signUp, signOut, loadUser } from './AuthThunk';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null,
    session: null,
    loading: false,   //krish set to true
    waveload: true,
    error: false,
    clientID: null,
    ws: null
  },
  reducers: {
    setUser: (state, action) => {
      console.log("UserSlice - setUser reducer called with:", action.payload);
      state.user = action.payload;
    },
    setSession: (state, action) => {
      state.session = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
      state.session = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setwaveLoad: (state, action) => {
      state.waveload = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setClientID(state, action) {
      state.clientID = action.payload.id
    },
    setWebsocket(state, action) {
      state.ws = action.payload.ws
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(signIn.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.session = action.payload.session;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.user = null;
      })
      .addCase(signOut.fulfilled, (state) => {
        state.user = null;
        state.session = null;
      })
      .addCase(loadUser.fulfilled, (state, action) => {
      })
      .addCase(signIn.rejected, (state, action) => {
        state.error = action.payload.error;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.error = action.payload.error;
      });
  },
});

export const { setUser, setSession, clearUser, setwaveLoad, setLoading, setError, setClientID, setWebsocket } = userSlice.actions;
export default userSlice.reducer;
