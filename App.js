import React from 'react';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { CurrencyProvider } from './src/utils/currencyContext';
import HomeScreen from './src/screens/HomeScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import AlertScreen from './src/screens/AlertScreen';
import { colors } from './src/utils/colors';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <CurrencyProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <Tab.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerShown: false,
            tabBarStyle: {
              backgroundColor: colors.backgroundSecondary,
              borderTopWidth: 1,
              borderTopColor: colors.border,
              height: 75,
              paddingBottom: 15,
              paddingTop: 8,
              elevation: 8,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
            },
            tabBarActiveTintColor: colors.binanceYellow,
            tabBarInactiveTintColor: colors.textSecondary,
            tabBarLabelStyle: {
              fontSize: 11,
              fontWeight: '600',
              marginTop: 2,
              marginBottom: 0,
            },
            tabBarIconStyle: {
              marginTop: 0,
              marginBottom: 0,
            },
            tabBarItemStyle: {
              paddingVertical: 4,
            },
          }}
        >
          <Tab.Screen 
            name="Home" 
            component={HomeScreen}
            options={{
              tabBarLabel: 'Markets',
              tabBarIcon: ({ color, focused }) => (
                <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.6 }}>📊</Text>
              ),
            }}
          />
          <Tab.Screen 
            name="Alerts" 
            component={AlertScreen}
            options={{
              tabBarLabel: 'Alerts',
              tabBarIcon: ({ color, focused }) => (
                <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.6 }}>🔔</Text>
              ),
            }}
          />
          <Tab.Screen 
            name="Settings" 
            component={SettingsScreen}
            options={{
              tabBarLabel: 'Settings',
              tabBarIcon: ({ color, focused }) => (
                <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.6 }}>⚙️</Text>
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </CurrencyProvider>
  );
}

