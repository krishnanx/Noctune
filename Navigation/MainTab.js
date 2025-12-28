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
import Playlist from "../src/pages/PlaylistChoose";
import Library from "../src/pages/TabPages/Library";
import { changeState } from "../Store/KeyboardSlice";
import EQTester from "../src/pages/TabPages/EQTester";
const Tab = createBottomTabNavigator();

const MainTab = () => {
  const dispatch = useDispatch();
  //----------------------------------------------------
  const { status } = useSelector((state) => state.key);

  const data = useSelector((state) => state.data.data);
  const isLoadedFromAsyncStorage = useSelector((state)=>state.data.isLoadedFromAsyncStorage)
  const playlistData = useSelector((state) => state.playlistload.song); 

  const displayPlayer = (data && data.length > 0 ) || (playlistData && playlistData.length > 0);
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

  //console.warn("isLoaded",isLoadedFromAsyncStorage)
  //console.warn("keyboard: ",isKeyboardVisible)
  //console.warn("displayPlayer", displayPlayer)
  //console.warn("data:",data)
  //console.warn("playlistData",playlistData)
  // //console.warn("isKeyboardVisible", isKeyboardVisible)
  // //console.warn("isLoadedFromAsyncStorage", isLoadedFromAsyncStorage)
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
          height: 60,
          padding: "auto",
        },
          };
        }}
        initialRouteName="Home"
      >
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="Search" component={Search} />
        <Tab.Screen name="Library" component={Library} />
        <Tab.Screen name="Settings" component={EQTester} />
      </Tab.Navigator>

      {displayPlayer && !isKeyboardVisible && <Player />}
      

      {/* <Player /> */}
    </>
  );
};

export default MainTab;
