import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from '@expo/vector-icons';

const Account = ({ navigation }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState({
    username: 'john_doe',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phoneNumber: '+1 (555) 123-4567',
    profilePicture: 'https://via.placeholder.com/150/1DB954/FFFFFF?text=JD'
  });

  const [editedData, setEditedData] = useState({ ...userData });
  const [emailVerificationNeeded, setEmailVerificationNeeded] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedData({ ...userData });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedData({ ...userData });
    setEmailVerificationNeeded(false);
  };

  const handleSave = async () => {
    // Validate inputs
    if (!editedData.username.trim() || !editedData.email.trim() || !editedData.phoneNumber.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editedData.email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    // Phone validation
    const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
    if (!phoneRegex.test(editedData.phoneNumber)) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return;
    }

    setIsLoading(true);

    try {
      // Check if email changed
      if (editedData.email !== userData.email) {
        setEmailVerificationNeeded(true);
        Alert.alert(
          'Email Verification Required',
          'A verification email has been sent to your new email address. Please verify before the change takes effect.',
          [{ text: 'OK' }]
        );
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      setUserData({ ...editedData });
      setIsEditing(false);
      setIsLoading(false);

      Alert.alert('Success', 'Your account information has been updated successfully');
    } catch (error) {
      setIsLoading(false);
      Alert.alert('Error', 'Failed to update account information. Please try again.');
    }
  };

  const handleProfilePictureChange = () => {
    Alert.alert(
      'Change Profile Picture',
      'Choose an option',
      [
        { text: 'Camera', onPress: () => console.log('Open camera') },
        { text: 'Gallery', onPress: () => console.log('Open gallery') },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  return (
    <>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={["#141414", "#1c2c32"]}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <SafeAreaView style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Account</Text>
            <TouchableOpacity onPress={isEditing ? handleCancel : handleEdit} style={styles.editButton}>
              <Text style={styles.editButtonText}>
                {isEditing ? 'Cancel' : 'Edit'}
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollView} contentContainerStyle={{ paddingBottom: 30 }}>
            {/* Profile Picture Section */}
            <View style={styles.profileSection}>
              <TouchableOpacity 
                onPress={isEditing ? handleProfilePictureChange : null}
                style={[styles.profilePictureContainer, isEditing && styles.editableProfilePicture]}
              >
                <Image source={{ uri: userData.profilePicture }} style={styles.profilePicture} />
                {isEditing && (
                  <View style={styles.editOverlay}>
                    <Ionicons name="camera" size={24} color="#fff" />
                  </View>
                )}
              </TouchableOpacity>
              <Text style={styles.profileName}>{userData.name}</Text>
            </View>

            {/* Account Information */}
            <View style={styles.infoSection}>
              <Text style={styles.sectionTitle}>Account Information</Text>

              {/* Username */}
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>Username</Text>
                {isEditing ? (
                  <TextInput
                    style={styles.textInput}
                    value={editedData.username}
                    onChangeText={(text) => setEditedData({ ...editedData, username: text })}
                    placeholder="Enter username"
                    placeholderTextColor="#888"
                  />
                ) : (
                  <Text style={styles.fieldValue}>{userData.username}</Text>
                )}
              </View>

              {/* Name */}
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>Full Name</Text>
                <Text style={styles.fieldValue}>{userData.name}</Text>
                <Text style={styles.fieldNote}>Contact support to change your name</Text>
              </View>

              {/* Email */}
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>Email</Text>
                {isEditing ? (
                  <TextInput
                    style={styles.textInput}
                    value={editedData.email}
                    onChangeText={(text) => setEditedData({ ...editedData, email: text })}
                    placeholder="Enter email"
                    placeholderTextColor="#888"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                ) : (
                  <Text style={styles.fieldValue}>{userData.email}</Text>
                )}
                {emailVerificationNeeded && (
                  <Text style={styles.verificationNote}>Verification required for email change</Text>
                )}
              </View>

              {/* Phone Number */}
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>Phone Number</Text>
                {isEditing ? (
                  <TextInput
                    style={styles.textInput}
                    value={editedData.phoneNumber}
                    onChangeText={(text) => setEditedData({ ...editedData, phoneNumber: text })}
                    placeholder="Enter phone number"
                    placeholderTextColor="#888"
                    keyboardType="phone-pad"
                  />
                ) : (
                  <Text style={styles.fieldValue}>{userData.phoneNumber}</Text>
                )}
              </View>
            </View>

            {/* Save Button */}
            {isEditing && (
              <TouchableOpacity 
                style={[styles.saveButton, isLoading && styles.disabledButton]} 
                onPress={handleSave}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                )}
              </TouchableOpacity>
            )}
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingTop: 20,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  editButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#1DB954',
    borderRadius: 8,
  },
  editButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  profileSection: {
    alignItems: 'center',
    marginVertical: 30,
  },
  profilePictureContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  editableProfilePicture: {
    opacity: 0.8,
  },
  profilePicture: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#1DB954',
  },
  editOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileName: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  infoSection: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  sectionTitle: {
    color: '#8b9da5',
    fontSize: 14,
    marginBottom: 20,
    textTransform: 'uppercase',
  },
  fieldContainer: {
    marginBottom: 20,
  },
  fieldLabel: {
    color: '#8b9da5',
    fontSize: 14,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  fieldValue: {
    color: '#ffffff',
    fontSize: 16,
  },
  fieldNote: {
    color: '#8b9da5',
    fontSize: 12,
    marginTop: 4,
    fontStyle: 'italic',
  },
  textInput: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    color: '#ffffff',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  verificationNote: {
    color: '#FFA500',
    fontSize: 12,
    marginTop: 4,
    fontStyle: 'italic',
  },
  saveButton: {
    backgroundColor: '#1DB954',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 20,
  },
  disabledButton: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
export default Account;