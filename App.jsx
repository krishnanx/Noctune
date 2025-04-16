import { StyleSheet, View, StatusBar, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import UniversalNavi from './Navigation/Universal';
import { darkTheme } from './Theme/darkTheme';
import { lightTheme } from './Theme/lightTheme';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import Websocket from './src/Websocket/Websocket';
import { FetchMetadata } from './Store/MusicSlice';
import { useEffect } from 'react';
import { Text } from 'react-native';
export default function App() {
  const { Mode } = useSelector((state) => state.theme);
  const { data,status } = useSelector((state) => state.data);
  const dispatch = useDispatch();
   useEffect(() => {
    const fetchData = async () => {
      try {
        // Dispatch the action to fetch metadata
        await dispatch(FetchMetadata({ text: "https://www.youtube.com/watch?v=pQq9eP5OFhw" })).unwrap();
      } catch (error) {
        console.error("❌ Error occurred while fetching metadata:", error);
        // Handle error within the component (e.g., set an error state)
        // You can use local state or display a message in the UI
      }
    };

    fetchData();
  }, [dispatch]);

  if (status === "loading") {
    return <Text>Loading...</Text>;
  }

  if (status === "error") {
    return <Text>Something went wrong while fetching data.</Text>;
  }

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
      <Websocket />
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
