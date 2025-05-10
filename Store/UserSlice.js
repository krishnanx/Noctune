import { createSlice } from '@reduxjs/toolkit';
import { signIn, signUp, signOut, loadUser } from './AuthThunk';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null,
    session: null,
    loading: false,
    error: null,
    clientID: null
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
    setError: (state, action) => {
      state.error = action.payload;
    },
    setClientID(state, action) {
      state.clientID = action.payload.id
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

export const { setUser, setSession, clearUser, setLoading, setError, setClientID } = userSlice.actions;
export default userSlice.reducer;
