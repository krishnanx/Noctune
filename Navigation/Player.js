import React from "react";
import { createStackNavigator, TransitionPresets } from "@react-navigation/stack";
import PlayerStack from "../src/pages/PlayerStack";

const Stack = createStackNavigator();

const PlayerNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        cardOverlayEnabled: true,
        ...TransitionPresets.ModalSlideFromBottomIOS,
      }}
    >
      <Stack.Screen
        name="PlayerStack"
        getComponent={()=>PlayerStack}
      />
    </Stack.Navigator>
  );
};

export default PlayerNavigator;
