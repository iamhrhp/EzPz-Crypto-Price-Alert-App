import 'react-native-gesture-handler';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { CurrencyProvider } from './src/utils/currencyContext';
import HomeScreen from './src/screens/HomeScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import AlertScreen from './src/screens/AlertScreen';
import { colors } from './src/utils/colors';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
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
                <MaterialCommunityIcons 
                  name={focused ? "chart-line-stacked" : "chart-line"} 
                  color={color} 
                  size={24} 
                />
              ),
            }}
          />
          <Tab.Screen 
            name="Alerts" 
            component={AlertScreen}
            options={{
              tabBarLabel: 'Alerts',
              tabBarIcon: ({ color, focused }) => (
                <MaterialCommunityIcons 
                  name={focused ? "bell-plus" : "bell-plus-outline" } 
                  color={color} 
                  size={24} 
                />
              ),
            }}
          />
          <Tab.Screen 
            name="Settings" 
            component={SettingsScreen}
            options={{
              tabBarLabel: 'Settings',
              tabBarIcon: ({ color, focused }) => (
                <Ionicons 
                  name={focused ? "settings" : "settings-outline"} 
                  color={color} 
                  size={24} 
                />
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </CurrencyProvider>
    </GestureHandlerRootView>
  );
}


