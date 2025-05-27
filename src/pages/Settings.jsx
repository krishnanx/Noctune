import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Switch, 
  ScrollView, 
  TouchableOpacity, 
  Image 
} from 'react-native';
import { useDispatch } from "react-redux";
import { signOut } from "../../Store/AuthThunk";
import { Ionicons } from '@expo/vector-icons';

const Settings = ({ navigation }) => {
  const [darkMode, setDarkMode] = useState(true);
  const [offlineMode, setOfflineMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const dispatch = useDispatch();

  // Mock user data - replace with actual user data from your state/context
  const userProfilePicture = 'https://via.placeholder.com/40/1DB954/FFFFFF?text=JD';

  const handleSignOut = () => {
    dispatch(signOut());
  };

  const navigateToAccount = () => {
    navigation.navigate('Account');
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ minHeight: 900 }}
    >
      {/* Header with Profile Picture */}
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Settings</Text>
        <TouchableOpacity onPress={navigateToAccount} style={styles.profileButton}>
          <Image source={{ uri: userProfilePicture }} style={styles.headerProfilePicture} />
        </TouchableOpacity>
      </View>

      <Section title="Playback">
        <SettingItem
          label="Offline mode"
          value={offlineMode}
          onToggle={setOfflineMode}
        />
      </Section>

      <Section title="Preferences">
        <SettingItem
          label="Dark Mode"
          value={darkMode}
          onToggle={setDarkMode}
        />
        <SettingItem
          label="Notifications"
          value={notifications}
          onToggle={setNotifications}
        />
      </Section>

      <Section title="Account">
        <NavItem 
          label="Account Info" 
          onPress={navigateToAccount}
          icon="person-outline"
        />
        <NavItem 
          label="Change Password" 
          icon="lock-closed-outline"
        />
      </Section>

      <Section title="Support">
        <NavItem 
          label="Help Center" 
          icon="help-circle-outline"
        />
        <NavItem 
          label="Privacy Policy" 
          icon="shield-outline"
        />
        <NavItem 
          label="Log Out" 
          onPress={handleSignOut}
          icon="log-out-outline"
          isDestructive={true}
        />
      </Section>
    </ScrollView>
  );
};

const Section = ({ title, children }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

const SettingItem = ({ label, value, onToggle }) => (
  <View style={styles.item}>
    <Text style={styles.itemText}>{label}</Text>
    <Switch
      value={value}
      onValueChange={onToggle}
      thumbColor="#1DB954"
    />
  </View>
);

const NavItem = ({ label, onPress, icon, isDestructive = false }) => (
  <TouchableOpacity style={styles.item} onPress={onPress}>
    <View style={styles.navItemContent}>
      {icon && (
        <Ionicons 
          name={icon} 
          size={20} 
          color={isDestructive ? "#ff4444" : "#888"} 
          style={styles.navIcon} 
        />
      )}
      <Text style={[styles.itemText, isDestructive && styles.destructiveText]}>
        {label}
      </Text>
    </View>
    <Ionicons name="chevron-forward" size={20} color="#888" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  header: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  profileButton: {
    padding: 5,
  },
  headerProfilePicture: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "white",
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    color: '#888',
    fontSize: 14,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  item: {
    backgroundColor: '#1e1e1e',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemText: {
    color: '#fff',
    fontSize: 16,
  },
  navItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navIcon: {
    marginRight: 12,
  },
  destructiveText: {
    color: '#ff4444',
  },
});

export default Settings;