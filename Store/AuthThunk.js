import { createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import {
  setUser,
  setSession,
  clearUser,
  setLoading,
  setError,
} from "./UserSlice";

export const loadUser = createAsyncThunk(
  "user/loadUser",
  async (_, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      const userData = await AsyncStorage.getItem("user");
      const sessionData = await AsyncStorage.getItem("session");

      if (userData && sessionData) {
        dispatch(setUser(JSON.parse(userData)));
        dispatch(setSession(JSON.parse(sessionData)));
      }
    } catch (error) {
      dispatch(setError("Failed to load userdata"));
    } finally {
      dispatch(setLoading(false));
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
        "http://nutrigen.myprojects.studio/api/auth/signup",
        { email, password, username }
      );

      const { user } = response.data;

      // Store in AsyncStorage
      await AsyncStorage.setItem("user", JSON.stringify(user));
      //--------------------------------------------------
      await AsyncStorage.removeItem("user");
      await AsyncStorage.removeItem("session");

      // Then set new data
      await AsyncStorage.setItem("user", JSON.stringify(user));
      await AsyncStorage.setItem("session", JSON.stringify(session));
      //-------------------------------------------

      // Update Redux state
      dispatch(setUser(user));
  
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Failed to sign up";
      dispatch(setError(errorMessage));
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
      dispatch(setLoading(true));

      const response = await axios.post(
        "http://nutrigen.myprojects.studio/api/auth/signin",
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

        return { success: true, user };
      } else {
        console.error("Invalid response format:", response.data);
        return rejectWithValue({ error: "Invalid response from server" });
      }
    } catch (error) {
      console.error("Auth API error:", error.message);
      if (error.response) {
        console.error("Error response:", error.response.data);
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
