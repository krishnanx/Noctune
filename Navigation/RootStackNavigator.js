import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MainTab from "./MainTab";
import Playlist from "../src/pages/Playlist";
import PlaylistChoose from "../src/pages/PlaylistChoose"
import MigratePlaylist from "../src/pages/MigratePlaylist";
import DownloadPage from "../src/pages/DownloadPage";
import Account from "../src/pages/Account";
import PlaylistEdit from "../src/pages/PlaylistEdit"
import PlayerStack from "../src/pages/PlayerStack"
import InviteCollab from "../src/pages/InviteCollab"
import Notification from "../src/pages/Notification";
const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainTab} />
      <Stack.Screen name="Playlist" component={Playlist} />
      <Stack.Screen name="Playchoose" component={PlaylistChoose} />
      <Stack.Screen name="Migrate" component={MigratePlaylist} />
      <Stack.Screen name="Download" component={DownloadPage} />
      <Stack.Screen name="Account" component={Account} />
      <Stack.Screen name="PlaylistEdit" component={PlaylistEdit} />
      <Stack.Screen name="PlayerStack" component={PlayerStack} />
      <Stack.Screen name="InviteCollab" component={InviteCollab} />
      <Stack.Screen name="Notification" component={Notification} />
      {/* You can add more screens here */}
    </Stack.Navigator>
  );
};

export default RootNavigator;
