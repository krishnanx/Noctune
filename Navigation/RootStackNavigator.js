import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MainTab from "./MainTab";
import Playlist from "../src/pages/Playlist";
const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainTab} />
      <Stack.Screen name="Playlist" component={Playlist} />
      {/* You can add more screens here */}
    </Stack.Navigator>
  );
};

export default RootNavigator;
