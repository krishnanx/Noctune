import React, { useState, useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import AuthStack from "./AuthStack";
import MainTab from "./MainTab";
import RootNavigator from "./RootStackNavigator";
import { useSelector } from 'react-redux'; // Import useSelector

import { User } from "react-native-feather";
const Stack = createStackNavigator();
const UniversalNavi = () => {

  const { user } = useSelector((state) => state.user)

  return (
    <Stack.Navigator>
      {user ? (
        <Stack.Screen
          name="RootNavigator"
          component={RootNavigator}
          options={{ headerShown: false }}
        />
      ) : (
        <Stack.Screen
          name="Auth"
          component={AuthStack}
          options={{ headerShown: false }}
        />
      )}
    </Stack.Navigator>
  );
};
export default UniversalNavi;
