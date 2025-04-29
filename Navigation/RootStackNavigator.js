import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MainTab from "./MainTab";
import Playlist from "../src/pages/Playlist";
import PlaylistChoose from "../src/pages/PlaylistChoose"
const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainTab} />
      <Stack.Screen name="Playlist" component={Playlist} />
      <Stack.Screen name="Playchoose" component={PlaylistChoose} />
      {/* You can add more screens here */}
    </Stack.Navigator>
  );
};

export default RootNavigator;
