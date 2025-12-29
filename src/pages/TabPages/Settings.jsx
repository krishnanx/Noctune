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
import { useSelector,useDispatch } from "react-redux";
import { signOut } from "../../../Store/AuthThunk";
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { clearSearchTextHistory } from "../../../Store/MusicSlice.js";
import FadeWrapper from '../../../Navigation/FadeWrapper.jsx';
import { changeTheme } from "../../../Store/ThemeSlice";
import { useTheme } from "@react-navigation/native";
import { LinearGradient } from 'expo-linear-gradient';
import Profile from '../../Components/Icons/Profile.jsx';


const Settings = ({ navigation }) => {
  //const [darkMode, setDarkMode] = useState(true);
  const {colors} = useTheme();
  const Mode = useSelector((state) => state.theme.Mode);
  const darkMode = Mode === "dark";
  //const [darkMode, setDarkMode] = useState(true);
  const [offlineMode, setOfflineMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const dispatch = useDispatch();

  // Mock user data - replace with actual user data from your state/context
  const userProfilePicture = 'https://via.placeholder.com/40/1DB954/FFFFFF?text=JD';

  const handleSignOut = async () => {
    await AsyncStorage.clear()
    dispatch(signOut());
    if (userId) {
    await AsyncStorage.removeItem(`searchHistory_${userId}`);
  }
  dispatch(clearSearchTextHistory());
  };

  const navigateToAccount = () => {
    //navigation.navigate('Account');
  };
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
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
      color: colors.text,
      fontSize: 28,
      
    },

    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    
    profileButton: {
      alignItems:"center",
      justifyContent:"center",
      paddingTop:5
    },
    headerProfilePicture: {
      width: 40,
      height: 40,
      borderRadius: 20,
      borderWidth: 2,
      borderColor: colors.text,
    },
    section: {
      marginBottom: 30,
    },
    sectionTitle: {
      color: colors.section,
      fontSize: 14,
      marginBottom: 10,
      textTransform: 'uppercase',
    },
    item: {
      backgroundColor: colors.card,
      paddingVertical: 15,
      paddingHorizontal: 15,
      borderRadius: 10,
      marginBottom: 10,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    itemText: {
      color: colors.text,
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
  return (
    <FadeWrapper>
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ minHeight: 900 }}
    >
      {/* Header with Bck button and Profile Picture */}
      <View style={styles.headerContainer}>
        <View style={styles.headerLeft}>
        {/* NEW BACK BUTTON */}
          <TouchableOpacity 
             onPress={() => navigation.goBack()} 
             style={{ marginRight: 15 }}
          >
             <Ionicons name="chevron-back" size={28} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.header}>Settings</Text>
        </View>
  
        <TouchableOpacity onPress={navigateToAccount} style={styles.profileButton}>
         <Profile width={35} height={35} fill={colors.text}/>
        </TouchableOpacity>
      </View>

      <Section title="Preferences" styles={styles}>
        <SettingItem
          label="Dark Mode"
          value={darkMode}
          onToggle={()=>dispatch(changeTheme(!darkMode))}
          styles={styles}
          colors = {colors}
        />
      </Section>

      <Section title="Account" styles={styles}>
        <NavItem
          label="Account Info"
          onPress={navigateToAccount}
          icon="person-outline"
          styles={styles}
        />
        <NavItem
          label="Change Password"
          icon="lock-closed-outline"
          styles={styles}
        />
      </Section>

      <Section title="Support" styles={styles}>
        <NavItem
          label="Help Center"
          icon="help-circle-outline"
           styles={styles}
        />
        <NavItem
          label="Privacy Policy"
          icon="shield-outline"
           styles={styles}
        />
        <NavItem
          label="Log Out"
          onPress={handleSignOut}
          icon="log-out-outline"
          isDestructive={true}
           styles={styles}
        />
      </Section>
    </ScrollView>
    </FadeWrapper>
  );
};

const Section = ({ title, children,styles }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

const SettingItem = ({ label, value, onToggle,styles,colors }) => (
  <View style={styles.item}>
    <Text style={styles.itemText}>{label}</Text>
    <Switch
      value={value}
      onValueChange={onToggle}
      thumbColor={colors.primary}
      trackColor={{ false: "#767577", true: colors.primary }}
    />
  </View>
);

const NavItem = ({ label, onPress, icon, isDestructive = false,styles }) => (
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

  // return (
   
  //   <ScrollView
  //     style={styles.container}
  //     contentContainerStyle={{ minHeight: 900 }}
  //   >
  //     {/* Header with Profile Picture */}
  //     <View style={styles.headerContainer}>
  //       <Text style={styles.header}>Settings</Text>
  //       <TouchableOpacity onPress={navigateToAccount} style={styles.profileButton}>
  //         <Image source={{ uri: userProfilePicture }} style={styles.headerProfilePicture} />
  //       </TouchableOpacity>
  //     </View>

  //     <Section title="Preferences">
  //       <SettingItem
  //         label="Dark Mode"
  //         value={darkMode}
  //         onToggle={() => dispatch(changeTheme(darkMode ? "light" : "dark"))}

  //       />
  //       <SettingItem
  //         label="Notifications"
  //         value={notifications}
  //         onToggle={setNotifications}
  //       />
  //     </Section>

  //     <Section title="Account">
  //       <NavItem
  //         label="Account Info"
  //         onPress={navigateToAccount}
  //         icon="person-outline"
  //       />
  //       <NavItem
  //         label="Change Password"
  //         icon="lock-closed-outline"
  //       />
  //     </Section>

  //     <Section title="Support">
  //       <NavItem
  //         label="Help Center"
  //         icon="help-circle-outline"
  //       />
  //       <NavItem
  //         label="Privacy Policy"
  //         icon="shield-outline"
  //       />
  //       <NavItem
  //         label="Log Out"
  //         onPress={handleSignOut}
  //         icon="log-out-outline"
  //         isDestructive={true}
  //       />
  //     </Section>
  //   </ScrollView>
    
  // );



export default Settings;