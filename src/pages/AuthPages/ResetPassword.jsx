import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@env";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const route = useRoute();
  const navigation = useNavigation();

  console.log("ResetPassword Screen Opened");

  const token = route.params?.token;

  useEffect(() => {
    if (!token) {
      Alert.alert("Error", "Invalid or missing token.");
      navigation.navigate("signin");
    }
  }, [token]);

  const handlePasswordReset = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert("Error", "Please fill in both fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    setLoading(true);

    //const { data, error } = await supabase.auth.updateUser(
    //  { password: newPassword },
     // { accessToken: token }
   // );

   const { error: sessionError } = await supabase.auth.setSession({
  access_token: token,
  refresh_token: '', // leave it empty; not required for password reset
});

if (sessionError) {
  Alert.alert("Error", sessionError.message);
  setLoading(false);
  return;
}

const { data, error } = await supabase.auth.updateUser({
  password: newPassword,
});


    setLoading(false);

    if (error) {
      Alert.alert("Error", error.message);
    } else {
      Alert.alert("Success", "Password updated successfully.");
      navigation.navigate("signin");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Reset Your Password</Text>

      <TextInput
        placeholder="New Password"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
        style={styles.input}
      />
      <TextInput
        placeholder="Confirm New Password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        style={styles.input}
      />

      <TouchableOpacity
        onPress={handlePasswordReset}
        style={styles.button}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Update Password</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default ResetPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#141414",
  },
  heading: {
    fontSize: 22,
    color: "wheat",
    textAlign: "center",
    marginBottom: 30,
    fontWeight: "bold",
  },
  input: {
    backgroundColor: "#222",
    padding: 15,
    borderRadius: 10,
    color: "#fff",
    marginBottom: 15,
  },
  button: {
    backgroundColor: "wheat",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#141414",
    fontWeight: "bold",
    fontSize: 16,
  },
});
