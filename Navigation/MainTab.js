import React, { useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Home from "../src/pages/Home";
import Player from "../src/pages/Player";
import Settings from "../src/pages/Settings";
import Search from "../src/pages/Search";
import { useSelector, useDispatch } from "react-redux";
import { Keyboard } from "react-native";
import Playlist from "../src/pages/Playlist";
import Library from "../src/pages/Library";
import { setAnimationTargetY } from ".././Store/MusicSlice";

const Tab = createBottomTabNavigator();

const MainTab = () => {
  const dispatch = useDispatch();
  //----------------------------------------------------
  const { status } = useSelector((state) => state.key);

  const data = useSelector((state) => state.data.data);

  const displayPlayer = data && data.length > 0;
  //------------------------------------------------------------

  //const {isFirst } = useSelector((state) => state.user.isFirstTime);

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  useEffect(() => {
    const keybaordDidShow = Keyboard.addListener("keyboardDidShow", () => {
      console.warn("keyboard is active");
      setKeyboardVisible(true);
    });
    const keyboardDidHide = Keyboard.addListener("keyboardDidHide", () => {
      console.warn("keyboard is inactive");
      setKeyboardVisible(false);
      dispatch(setAnimationTargetY(0));
    });
    return () => {
      keybaordDidShow.remove();
      keyboardDidHide.remove();
    };
  }, []);

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
            tabBarHideOnKeyboard: true,
            tabBarStyle: {
              height: 55, // <== custom height in pixels
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

      {displayPlayer && !isKeyboardVisible && <Player />}

      {/* <Player /> */}
    </>
  );
};

export default MainTab;
