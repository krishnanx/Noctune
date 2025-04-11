import 'react-native-gesture-handler';
import { registerRootComponent } from 'expo';
import { Provider } from 'react-redux';
import store from "./Store/store";
import App from './App';
import { PaperProvider } from 'react-native-paper';

// Wrap App inside Provider
const ReduxApp = () => (
    <Provider store={store}>
        <PaperProvider>
            <App />
        </PaperProvider>
    </Provider>
);


// Register the wrapped App
registerRootComponent(ReduxApp);
