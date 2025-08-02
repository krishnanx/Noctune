import React, { useState } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useTheme } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { signUp } from "../../../Store/AuthThunk";
import Icon from "react-native-vector-icons/Ionicons";
import Toast from "react-native-toast-message";
import { AddNewPlaylist, addPlaylist } from "../../../Store/PlaylistSlice";
import Playlist from "./../Playlist";
import { showToast,hideToast } from "../../../Store/ToastSlice";

const SignUp = () => {
  const { colors } = useTheme();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmpass, setConfirmPass] = useState();
  const [username, setUserName] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  //const [loading, setLoading] = useState(false);
  //const [error, setError] = useState(null);
  const navigation = useNavigation();

  const dispatch = useDispatch();
  const { user, session, loading, waveload, error } = useSelector(
    (state) => state.user || {}
  );

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSignUp = async () => {
    try {
     if (!username || !email || !password || !confirmpass) {
        dispatch(showToast({Title:"Please fill in all the fields",message:""}));
        return;
      }


     if (password !== confirmpass) {
        dispatch(showToast({Title:"Passwords do not match",message:""}));
        return;
      }



      const result = await dispatch(signUp({ email, password, username })).unwrap();
      //console.warn(result)

      if (result.success) {
        alert("Account created successfully! Please sign in");
        const userid = result.user.id
        const playlist = {

          id: 0,
          image: "",
          name: "Liked Songs",
          desc: "A collection of all your favorite tracks in one place. Updated every time you tap that ❤️.",
          songs: [],
          Time: 0,
          isPlaying: false

        }
        await dispatch(AddNewPlaylist({ data: playlist, userid: userid })).unwrap()
        dispatch(addPlaylist({ playlist: playlist }))

       navigation.navigate("signin");
        
      }
      // else {
      //   dispatch(showToast(result.payload?.message || "Failed to create account"));
      // }
      else {
        const errorMessage =
          result.error || result.payload?.message || "Failed to create account";
          dispatch(showToast({Title:errorMessage,message:""}));
      }
    } catch (error) {
      //console.error("Sign-up error:", error);
        dispatch(showToast({Title:error.message || "An unexpected error occurred",message:""}));
    }

  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      padding: 20,
      marginTop: 30,
      paddingBottom: 100,
    },
    appName: {
      color: "wheat",
      fontWeight: "bold",
      fontSize: 40,
      textAlign: "center",
      padding: 20,
    },
    line: {
      marginTop: 15,
      height: 1,
      backgroundColor: "#aaa",
      opacity: 0.4,
      marginBottom: 15,
    },
    signText: {
      color: "white",
      fontSize: 15,
      textAlign: "center",
      padding: 10,
    },
    input: {
      backgroundColor: "rgba(255,255,255,0.1)",
      borderRadius: 10,
      padding: 15,
      fontSize: 16,
      marginBottom: 15,
      color: colors.text,
    },
    button: {
      backgroundColor: "wheat",
      borderRadius: 50,
      padding: 15,
      alignItems: "center",
      marginTop: 15,
    },
    buttonText: {
      color: "black",
      fontSize: 16,
      fontWeight: "bold",
    },
    footer: {
      flexDirection: "row",
      justifyContent: "center",
      marginTop: 30,
    },
    footerText: {
      color: "wheat",
      fontSize: 14,
    },
    signInText: {
      color: "wheat",
      fontSize: 14,
      fontWeight: "bold",
      marginLeft: 5,
    },
    passwordContainer: {
      flexDirection: "row",
      backgroundColor: "rgba(255,255,255,0.1)",
      borderRadius: 10,
      marginBottom: 15,
      alignItems: "center",
      paddingHorizontal: 10,
    },
    inputPassword: {
      flex: 1,
      fontSize: 16,
      paddingVertical: 15,
      color: colors.text,
    },
    eyeIcon: {
      padding: 10,
    },
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.appName}>𝙉𝙤𝙘𝙩𝙪𝙣𝙚</Text>
          <View style={styles.line}></View>

          {/*<View style={styles.line}></View>
          <Text style={styles.signText}>Sign up with your email address</Text>
          <View style={styles.line}></View>*/}

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="rgba(255,255,255,0.5)"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.inputPassword}
              placeholder="Password"
              placeholderTextColor="rgba(255,255,255,0.5)"
              value={password}
              onChangeText={setPassword}
              keyboardType="password"
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={togglePasswordVisibility}
            >
              <Icon
                name={showPassword ? "eye-off" : "eye"}
                size={22}
                color="rgba(255,255,255,0.7)"
              />
            </TouchableOpacity>
          </View>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.inputPassword}
              placeholder=" Confirm Password"
              placeholderTextColor="rgba(255,255,255,0.5)"
              value={confirmpass}
              onChangeText={setConfirmPass}
              secureTextEntry={!showConfirmPassword}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={toggleConfirmPasswordVisibility}
            >
              <Icon
                name={showConfirmPassword ? "eye-off" : "eye"}
                size={22}
                color="rgba(255,255,255,0.7)"
              />
            </TouchableOpacity>
          </View>
          <TextInput
            style={styles.input}
            placeholder="What should we call you?"
            placeholderTextColor="rgba(255,255,255,0.5)"
            value={username}
            onChangeText={setUserName}
          />

          <TouchableOpacity
            style={styles.button}
            onPress={handleSignUp}
            disabled={loading}
          >
            {/* {error && (
              <Text style={{ color: "red", marginBottom: 10 }}>{error}</Text>
            )} */}
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Sign Up</Text>
            )}
          </TouchableOpacity>
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account?</Text>
            <Text
              style={styles.signInText}
              onPress={() => navigation.navigate("signin")}
            >
              Sign In
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignUp;
