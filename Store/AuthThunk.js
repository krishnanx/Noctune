import { createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Constants from "expo-constants"
import {
  setUser,
  setSession,
  clearUser,
  setLoading,
  setError,
} from "./UserSlice";
import { deleteAllPlaylist } from "./PlaylistSlice";
import { deleteSearchedMusicHistory } from "./MusicSlice";

export const loadUser = createAsyncThunk(
  "user/loadUser",
  async (_, { dispatch }) => {
    try {
      //dispatch(setLoading(true));
      const userData = await AsyncStorage.getItem("user");
      const sessionData = await AsyncStorage.getItem("session");
      //console.warn("session: ", sessionData)
      //console.warn("user data: ", userData)
      if (userData && sessionData) {
        const parsedUser = JSON.parse(userData);
        //console.error(parsedUser)
        dispatch(setUser(parsedUser));
        dispatch(setSession(JSON.parse(sessionData)));
        return parsedUser;
      }

      return null;
    } catch (error) {
      //console.error(error)
      dispatch(setError("Failed to load userdata"));
      throw error;
    }
  }
);


// Sign up thunk
export const signUp = createAsyncThunk(
  "user/signUp",
  async ({ email, password, username }, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const response = await axios.post(
        `${Constants.expoConfig.extra.SERVER
        }/api/auth/signup`,
        { email, password, username }
      );

      const { user } = response.data;
      //console.warn(response.data)
      // Store in AsyncStorage

      //--------------------------------------------------
      await AsyncStorage.removeItem("user");


      // Then set new data
      await AsyncStorage.setItem("user", JSON.stringify(user));

      //-------------------------------------------

      // Update Redux state
      dispatch(setUser(user));
      dispatch(setError(false))
      return { success: true, user: user };
    } catch (error) {
      //console.error(error)
      const errorMessage = error.response?.data?.error || "Failed to sign up";
      dispatch(setError(true));
      return { success: false, error: errorMessage };
    } finally {
      dispatch(setLoading(false));
    }
  }
);


export const signIn = createAsyncThunk(
  "user/signIn",
  async ({ email, password }, { dispatch, rejectWithValue }) => {

    try {
      //console.warn("sign in reached")
      dispatch(setLoading(true));

      const response = await axios.post(
        `${Constants.expoConfig.extra.SERVER
        }/api/auth//signin`,
        { email, password }
      );

      if (response.data && response.data.user) {
        const { user, session } = response.data;


        await AsyncStorage.setItem("user", JSON.stringify(user));
        if (session) {
          await AsyncStorage.setItem("session", JSON.stringify(session));
        }

        // Update Redux state
        dispatch(setUser(user));
        if (session) dispatch(setSession(session));
        dispatch(setError(false))
        return {
          success: true,
          user: response.data.user,
          session: response.data.session,
        };
      } else {
        //console.error("Invalid response format:", response.data);
        return rejectWithValue({ error: "Invalid response from server" });
      }
    } catch (error) {
      //console.error("Auth API error:", error.message);
      if (error.response) {
        //console.error("Error response:", error.response.data);
      }
      return rejectWithValue({
        error: error.response?.data?.error || "Connection failed",
      });
    } finally {
      dispatch(setLoading(false));
    }
  }
);

// Sign out thunk
export const signOut = createAsyncThunk(
  "user/signOut",
  async (_, { dispatch }) => {
    try {
      dispatch(deleteAllPlaylist())
      dispatch(deleteSearchedMusicHistory())
      await AsyncStorage.removeItem("user");
      //-----------------------
      await AsyncStorage.removeItem("session");
      await AsyncStorage.removeItem("isFirstTime");
      //----------------------
      dispatch(clearUser());
      return { success: true };
    } catch (error) {
      dispatch(setError("Failed to sign out"));
      return { success: false };
    }
  }
);