import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useTheme, useNavigation } from "@react-navigation/native";
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@env";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const ForgotPassword = () => {
  const { colors } = useTheme();
  const navigation = useNavigation();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert("Missing Email", "Please enter your email.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email);
    setLoading(false);

    if (error) {
      Alert.alert("Error", error.message);
    } else {
      Alert.alert("Success", "Check your email for a reset link.");
      navigation.goBack(); // Go back to Sign In
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles(colors).container}>
        <Text style={styles(colors).title}>Reset Password</Text>

        <TextInput
          style={styles(colors).input}
          placeholder="Enter your email"
          placeholderTextColor="rgba(255,255,255,0.5)"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <TouchableOpacity style={styles(colors).button} onPress={handleResetPassword}>
          {loading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text style={styles(colors).buttonText}>Send Reset Link</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 20 }}>
          <Text style={{ color: "wheat", textAlign: "center" }}>← Back to Sign In</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ForgotPassword;

const styles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      justifyContent: "center",
    },
    title: {
      color: "wheat",
      fontSize: 30,
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: 30,
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
      marginTop: 10,
    },
    buttonText: {
      color: "black",
      fontSize: 16,
      fontWeight: "bold",
    },
  });
