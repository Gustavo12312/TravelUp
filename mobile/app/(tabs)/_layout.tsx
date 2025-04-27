import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { View } from 'react-native';
import Menu from '../../components/Menu';

export default function TabLayout() {
  return (
    
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#ffd33d',
        headerStyle: {
          backgroundColor: '#25292e',
        },
        headerShadowVisible: false,
        headerTintColor: '#fff',
        tabBarStyle: {
          backgroundColor: '#25292e',
        },
        headerRight: () => (
          <View style={{ marginRight: 10 }}>
            <Menu />
          </View>
        ),
      }}
    >
      <Tabs.Screen
        name="Homepage"
        options={{
          title: 'Homepage',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'home-sharp' : 'home-outline'}
              color={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="RequestList"
        options={{
          title: 'Requests',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
            name={focused ? 'airplane' : 'airplane-outline'}
              color={color}
              size={24}
            />
          ),
        }}
      />
    </Tabs>
    
  );
}
