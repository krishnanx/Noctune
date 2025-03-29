import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Home from '../src/pages/Home';
import Settings from '../src/pages/Settings';
const Tab = createBottomTabNavigator();
const MainTab = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                    let iconName;
                    if (route.name === 'Home') iconName = 'home-outline';

                    else if (route.name === 'Settings') iconName = 'cog-outline';

                    return <Icon name={iconName} size={size} color={color} />;
                },
            })}
            initialRouteName="Home"
        >
            <Tab.Screen name="Home" component={Home} options={{ headerShown: false }} />
            <Tab.Screen name="Settings" component={Settings} options={{ headerShown: false }} />
        </Tab.Navigator>
    );
}
export default MainTab