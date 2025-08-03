import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MainTab from "./MainTab"; // this is your entry point, so keep it loaded normally

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Entry screen – keep eager */}
      <Stack.Screen name="MainTabs" component={MainTab} />

      {/* Lazy-loaded screens */}
      <Stack.Screen
        name="Playlist"
        getComponent={() => require("../src/pages/Playlist").default}
      />
      <Stack.Screen
        name="Playchoose"
        getComponent={() => require("../src/pages/PlaylistChoose").default}
      />
      <Stack.Screen
        name="Migrate"
        getComponent={() => require("../src/pages/MigratePlaylist").default}
      />
      <Stack.Screen
        name="Download"
        getComponent={() => require("../src/pages/DownloadPage").default}
      />
      <Stack.Screen
        name="Account"
        getComponent={() => require("../src/pages/Account").default}
      />
      <Stack.Screen
        name="PlaylistEdit"
        getComponent={() => require("../src/pages/PlaylistEdit").default}
      />
      <Stack.Screen
        name="PlayerStack"
        getComponent={() => require("../src/pages/PlayerStack").default}
      />
      <Stack.Screen
        name="InviteCollab"
        getComponent={() => require("../src/pages/InviteCollab").default}
      />
      <Stack.Screen
        name="Notification"
        getComponent={() => require("../src/pages/Notification").default}
      />
    </Stack.Navigator>
  );
};

export default RootNavigator;
