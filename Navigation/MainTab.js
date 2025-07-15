import React, { useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Home from "../src/pages/TabPages/Home";
import Player from "../src/pages/Player";
import Settings from "../src/pages/TabPages/Settings";
import Search from "../src/pages/TabPages/Search";
import { useSelector, useDispatch } from "react-redux";
import { Keyboard } from "react-native";
import Playlist from "../src/pages/Playlist";
import Library from "../src/pages/TabPages/Library";
import { changeState } from "../Store/KeyboardSlice";
const Tab = createBottomTabNavigator();

const MainTab = () => {
  const dispatch = useDispatch();
  //----------------------------------------------------
  const { status } = useSelector((state) => state.key);

  const data = useSelector((state) => state.data.data);
  const isLoadedFromAsyncStorage = useSelector((state)=>state.data.isLoadedFromAsyncStorage)
  const playlistData = useSelector((state) => state.playlist.data); 

  const displayPlayer = (data && data.length > 0 ) || (playlistData && playlistData.length);
  //------------------------------------------------------------

  //const {isFirst } = useSelector((state) => state.user.isFirstTime);

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
  const keyboardDidShow = Keyboard.addListener("keyboardDidShow", () => {
    setKeyboardVisible(true);
    dispatch(changeState(true))
  });
  const keyboardDidHide = Keyboard.addListener("keyboardDidHide", () => {
    setKeyboardVisible(false);
    dispatch(changeState(false))
  });

  return () => {
    keyboardDidShow.remove();
    keyboardDidHide.remove();
  };
}, []);

  console.warn("isLoaded",isLoadedFromAsyncStorage)
  console.warn("keyboard: ",isKeyboardVisible)
  return (
    <>
      <Tab.Navigator
        screenOptions={({ route }) => {
          let iconName;
          if (route.name === "Home") iconName = "home-outline";
          else if (route.name === "Search") iconName = "magnify";
          else if (route.name === "Library")
            iconName = "music-box-multiple-outline";
          else if (route.name === "Settings") iconName = "cog-outline";

          return {
            
            tabBarIcon: ({ color, size }) => (
              <Icon name={iconName} size={size} color={color} />
            ),
            headerShown: false,
            //tabBarHideOnKeyboard: true,
            tabBarStyle: isKeyboardVisible
            
      ? { display: "none",height:0 } // Hides instantly
      : {
          height: 55,
          padding: "auto",
        },
          };
        }}
        initialRouteName="Search"
      >
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="Search" component={Search} />
        <Tab.Screen name="Library" component={Library} />
        <Tab.Screen name="Settings" component={Settings} />
      </Tab.Navigator>

      {displayPlayer && !isKeyboardVisible && isLoadedFromAsyncStorage && <Player />}

      {/* <Player /> */}
    </>
  );
};

export default MainTab;
