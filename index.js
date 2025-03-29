import 'react-native-gesture-handler';
import { registerRootComponent } from 'expo';
import { Provider } from 'react-redux';
import store from "./Store/store";
import App from './App';

// Wrap App inside Provider
const ReduxApp = () => (
    <Provider store={store}>
        <App />
    </Provider>
);

// Register the wrapped App
registerRootComponent(ReduxApp);
