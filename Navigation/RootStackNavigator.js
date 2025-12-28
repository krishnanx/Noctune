import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MainTab from "./MainTab"; // this is your entry point, so keep it loaded normally
import {
  TransitionPresets,
  createStackNavigator
} from '@react-navigation/stack';
import PlayerNavigator from "./Player.js";
const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Entry screen – keep eager */}
      <Stack.Screen name="MainTabs" component={MainTab} />

      {/* Lazy-loaded screens */}
      <Stack.Screen
        name="Playlist"
        options={{animation:"fade"}}
        getComponent={() => require("../src/pages/Playlist").default}
      />
      <Stack.Screen
        name="Playchoose"
        options={{animation:"fade"}}
        getComponent={() => require("../src/pages/PlaylistChoose").default}
      />
      <Stack.Screen
        name="Migrate"
        options={{animation:"fade"}}
        getComponent={() => require("../src/pages/MigratePlaylist").default}
      />
      <Stack.Screen
        name="Download"
        options={{animation:"fade"}}
        getComponent={() => require("../src/pages/DownloadPage").default}
      />
      <Stack.Screen
        name="Account"
        options={{animation:"fade"}}
        getComponent={() => require("../src/pages/Account").default}
      />
      <Stack.Screen
        name="PlaylistEdit"
        options={{animation:"fade"}}
        getComponent={() => require("../src/pages/PlaylistEdit").default}
      />
      <Stack.Screen
        name="PlayerModal"
        component={PlayerNavigator}
        options={{
          presentation: "transparentModal",
          animation: "none", // let JS stack handle animation
        }}
      />
      <Stack.Screen
        name="InviteCollab"
        options={{animation:"fade"}}
        getComponent={() => require("../src/pages/InviteCollab").default}
      />
      <Stack.Screen
        name="Notification"
        options={{animation:"fade"}}
        getComponent={() => require("../src/pages/Notification").default}
      />
    </Stack.Navigator>
  );
};

export default RootNavigator;
