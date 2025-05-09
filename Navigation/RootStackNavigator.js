import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MainTab from "./MainTab";
import Playlist from "../src/pages/Playlist";
import PlaylistChoose from "../src/pages/PlaylistChoose"
import MigratePlaylist from "../src/pages/MigratePlaylist";
const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainTab} />
      <Stack.Screen name="Playlist" component={Playlist} />
      <Stack.Screen name="Playchoose" component={PlaylistChoose} />
      <Stack.Screen name="Migrate" component={MigratePlaylist} />
      {/* You can add more screens here */}
    </Stack.Navigator>
  );
};

export default RootNavigator;
