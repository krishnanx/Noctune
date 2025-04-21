import { createStackNavigator } from "@react-navigation/stack";
import SignIn from "../src/pages/SignIn";
import SignUp from "../src/pages/SignUp";

const AuthStack = () => {
    const Stack = createStackNavigator();

    return (
      <Stack.Navigator>
        
        {/*<Stack.Screen
          name="signup"
          component={SignUp}
          options={{ headerShown: false }}
        />*/}
        <Stack.Screen
          name="signin"
          component={SignIn}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    );
}
export default AuthStack