import { createStackNavigator } from "@react-navigation/stack";
import SignIn from "../src/pages/SignIn";
import SignUp from "../src/pages/SignUp";
import GetStarted from "../src/pages/GetStarted";
const AuthStack = () => {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator>
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