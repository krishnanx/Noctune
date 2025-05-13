import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, ScrollView, TouchableOpacity,Button } from 'react-native';

import { useDispatch } from "react-redux";
import { signOut } from "../../Store/AuthThunk";

const Settings = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [offlineMode, setOfflineMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
{
  /*--------------------------*/
}
   const dispatch = useDispatch();

   const handleSignOut = () => {
     dispatch(signOut());
   };
{
  /*--------------------------*/
}
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ minHeight: 900 }}
    >
      ----------------
      <View style={{ padding: 20 }}>
        <TouchableOpacity onPress={handleSignOut}>
          <Text style={{ color: "red", fontWeight: "bold", fontSize: 16 }}>
            Sign Out
          </Text>
        </TouchableOpacity>
      </View>
      -----------------------------
      <Text style={styles.header}>Settings</Text>
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
        <NavItem label="Account Info" />
        <NavItem label="Change Password" />
      </Section>
      <Section title="Support">
        <NavItem label="Help Center" />
        <NavItem label="Privacy Policy" />
        <NavItem label="Log Out" onPress={() => console.log("Logged Out")} />
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

const NavItem = ({ label, onPress }) => (
  <TouchableOpacity style={styles.item} onPress={onPress}>
    <Text style={styles.itemText}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: '#121212',
    paddingHorizontal: 20,
    paddingTop: 20,


  },
  header: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
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
});

export default Settings;
