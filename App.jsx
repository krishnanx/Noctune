
import { StyleSheet, Text, View, SafeAreaView, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import UniversalNavi from './Navigation/Universal';
import { darkTheme } from './Theme/darkTheme';
import { lightTheme } from './Theme/lightTheme';
import { Provider, useSelector } from 'react-redux';
import store from './Store/store';
export default function App() {
  const { Mode } = useSelector((state) => state.theme)
  return (
    <SafeAreaProvider>

      <StatusBar
        barStyle={Mode == 'light' ? "dark-content" : "light-content"}// Options: "dark-content" or "light-content"
        backgroundColor={Mode == 'light' ? "#ffffff" : "#141414"} // Matches your dark theme
        translucent={false} // Set to true if you want content behind the status bar
      />
      <NavigationContainer theme={Mode == 'light' ? lightTheme : darkTheme}>
        <UniversalNavi />
      </NavigationContainer>



    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#141414',
    width: "100%",
    height: 100

  },
});
