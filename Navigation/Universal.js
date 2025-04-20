import React, { useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import AuthStack from "./AuthStack";
import StackNav from "./MainTab";

const Stack = createStackNavigator();
const UniversalNavi = () => {
  return (
    <Stack.Navigator>
      {true ? (
        <Stack.Screen
          name="MainApp"
          component={StackNav}
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
