import { StyleSheet, View, StatusBar, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import UniversalNavi from './Navigation/Universal';
import { darkTheme } from './Theme/darkTheme';
import { lightTheme } from './Theme/lightTheme';
import { useSelector } from 'react-redux';

export default function App() {
  const { Mode } = useSelector((state) => state.theme);

  return (
    <SafeAreaProvider>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
          <StatusBar
            barStyle={Mode === 'light' ? "dark-content" : "light-content"}
            backgroundColor={Mode === 'light' ? "#ffffff" : "#141414"}
            translucent={false}
          />

          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={{ flex: 1 }}
          >
            <NavigationContainer
              theme={Mode === 'light' ? lightTheme : darkTheme}
            >
              <UniversalNavi />
            </NavigationContainer>
          </KeyboardAvoidingView>

        </View>
      </TouchableWithoutFeedback>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#141414',
    width: "100%",
  },
});
