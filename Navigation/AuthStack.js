import { createStackNavigator } from "@react-navigation/stack";
import SignIn from "../src/pages/AuthPages/SignIn";
import SignUp from "../src/pages/AuthPages/SignUp";
import GetStarted from "../src/pages/GetStarted";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState,useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
const AuthStack = () => {
const Stack = createStackNavigator();
const [initialRoute, setInitialRoute] = useState(null); 

  useEffect(() => {
    const check = async () => {
      try {
        const seen = await AsyncStorage.getItem('hasSeenGetStarted');
        console.warn("seen:",seen);
        if (seen === 'true') {
          setInitialRoute('signin');
        } else {
          setInitialRoute('getstarted');
        }
      } catch (e) {
        console.error('Error reading AsyncStorage', e);
        setInitialRoute('getstarted');
      }
    };
    check();
  }, []);

  if (!initialRoute) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#a027d8" />
      </View>
    );
  }

  return (
    <Stack.Navigator initialRouteName={initialRoute}>
      <Stack.Screen
        name="getstarted"
        component={GetStarted}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="signin"
        component={SignIn}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="signup"
        component={SignUp}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
export default AuthStack