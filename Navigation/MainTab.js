import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Home from '../src/pages/Home';
import Settings from '../src/pages/Settings';
import Search from '../src/pages/Search';
const Tab = createBottomTabNavigator();
const MainTab = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                    let iconName;
                    if (route.name === 'Home') iconName = 'home-outline';
                    else if (route.name === 'Search') iconName = "magnify"
                    else if (route.name === 'Settings') iconName = 'cog-outline';

                    return <Icon name={iconName} size={size} color={color} />;
                },
            })}
            initialRouteName="Search"
        >
            <Tab.Screen name="Home" component={Home} options={{ headerShown: false }} />
            <Tab.Screen name="Search" component={Search} options={{ headerShown: false }} />
            <Tab.Screen name="Settings" component={Settings} options={{ headerShown: false }} />
        </Tab.Navigator>
    );
}
export default MainTab