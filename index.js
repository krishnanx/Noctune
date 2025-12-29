import 'react-native-gesture-handler';
import { registerRootComponent } from 'expo';
import { Provider } from 'react-redux';
import store from "./Store/store";
import App from './App';
import { Provider as PaperProvider } from "react-native-paper";
import { enableScreens } from 'react-native-screens';
import TrackPlayer from 'react-native-track-player';
import playbackService from "./src/functions/service.js"
enableScreens();
// Wrap App inside Provider

console.warn("🔥 index.js EXECUTED");
try {
  TrackPlayer.registerPlaybackService(() => playbackService);
} catch (e) {
  console.error("RNTP registerPlaybackService failed:", e);
}
const ReduxApp = () => (
    <Provider store={store}>
        <PaperProvider>
            <App />
        </PaperProvider>
    </Provider>
);


// Register the wrapped App
registerRootComponent(ReduxApp);
