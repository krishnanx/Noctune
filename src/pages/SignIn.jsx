import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import { ScrollView } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { signIn } from "../../Store/AuthThunk";
import { setUser } from "../../Store/UserSlice";
import Icon from "react-native-vector-icons/Ionicons";

const SignIn = () => {
  const { colors } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  //const [loading, setLoading] = useState(false);
  //const [error, setError] = useState(null);
  const navigation = useNavigation();

  const dispatch = useDispatch();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSignIn = async () => {
    try {
      if (!email || !password) {
        dispatch(setError(null));
        return;
      }

      const result = await dispatch(signIn({ email, password }));

      if (result.payload?.success) {
        dispatch(setUser(user));
      } else {
        const errorMessage = result.payload?.error || "Failed to sign in";
        dispatch({
          type: "user/setError",
          payload: errorMessage,
        });
      }
    } catch (error) {
      console.error("Sign-in error:", error);
      dispatch({
        type: "user/setError",
        payload: error.message || "An unexpected error occurred",
      });
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      padding: 20,
      marginTop: 60,
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
    input: {
      backgroundColor: "rgba(255,255,255,0.1)",
      borderRadius: 10,
      padding: 15,
      fontSize: 16,
      color: colors.text,
      marginBottom: 15,
    },
    button: {
      backgroundColor: "wheat",
      borderRadius: 30,
      padding: 15,
      alignItems: "center",
      marginTop: 15,
    },
    buttonText: {
      color: "black",
      fontSize: 16,
      fontWeight: "bold",
    },
    forgotPassword: {
      color: colors.text,
      textAlign: "right",
      marginTop: 10,
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
    signUpText: {
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
  const { loading } = useSelector((state) => state.user);
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.appName}>𝙉𝙤𝙘𝙩𝙪𝙣𝙚</Text>
          <View style={styles.line}></View>

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="rgba(255,255,255,0.5)"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {/*{error && (
            <Text style={{ color: "red", marginBottom: 10 }}>{error}</Text>
          )}*/}
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.inputPassword}
              placeholder="Password"
              placeholderTextColor="rgba(255,255,255,0.5)"
              value={password}
              onChangeText={setPassword}
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
          <Text style={styles.forgotPassword}>Forgot Password?</Text>

          <TouchableOpacity style={styles.button} onPress={handleSignIn}>
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Sign In</Text>
            )}
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account?</Text>
            <Text
              style={styles.signUpText}
              onPress={() => navigation.navigate("signup")}
            >
              Sign Up
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignIn;
