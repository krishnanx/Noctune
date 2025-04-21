import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useTheme } from "@react-navigation/native";

const SignIn = () => {
  const { colors } = useTheme();
  //console.log("Theme colors:", colors);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSignIn = async () => {
    console.log("Sign in with:", email, password);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      padding: 20,
      marginTop: 60,
    },

    title: {
      fontSize: 28,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 50,
      textAlign: "center",
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
      color: colors.text,
      fontSize: 14,
    },
    signUpText: {
      color: "#1DB954",
      fontSize: 14,
      fontWeight: "bold",
      marginLeft: 5,
    },
    errorText: {
      color: "red",
      marginBottom: 10,
      textAlign: "center",
    },
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Sign In</Text>
        {error && <Text style={styles.errorText}>{error}</Text>}
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="rgba(255,255,255,0.5)"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="rgba(255,255,255,0.5)"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Text style={styles.forgotPassword}>Forgot Password?</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={handleSignIn}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Signing In..." : "Sign In"}
          </Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account?</Text>
          <Text
            style={styles.signUpText}
            //onPress={() => navigation.navigate("SignUp")}
          >
            Sign Up
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default SignIn;
