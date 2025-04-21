import React, { useState } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  StyleSheet,
  TextInput
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useTheme } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";

const SignUp = () => {
  const { colors } = useTheme();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmpass, setConfirmPass] = useState();
  const [username, setUserName] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  const handleSignUp = async () => {
    if (password != confirmpass) {
      setError("Password doesnt match");
      return;
    }
    console.log("sign up:", email, password, username);
  };
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      padding: 20,
      marginTop: 30,
      paddingBottom:100,
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

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="rgba(255,255,255,0.5)"
            value={password}
            onChangeText={setPassword}
            keyboardType="password"
            secureTextEntry
          />

          <TextInput
            style={styles.input}
            placeholder=" Confirm Password"
            placeholderTextColor="rgba(255,255,255,0.5)"
            value={confirmpass}
            onChangeText={setConfirmPass}
            secureTextEntry
          />

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
            <Text style={styles.buttonText}>
              {loading ? "Creating Account" : "Sign Up"}
            </Text>
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
