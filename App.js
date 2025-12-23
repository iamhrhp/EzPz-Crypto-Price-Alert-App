import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { CurrencyProvider } from './src/utils/currencyContext';
import HomeScreen from './src/screens/HomeScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import AlertScreen from './src/screens/AlertScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <CurrencyProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#0B0E11',
              borderBottomWidth: 1,
              borderBottomColor: '#2B3139',
            },
            headerTintColor: '#F0B90B',
            headerTitleStyle: {
              fontWeight: 'bold',
              color: '#EAECEF',
            },
          }}
        >
          <Stack.Screen 
            name="Home" 
            component={HomeScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="Settings" 
            component={SettingsScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="Alerts" 
            component={AlertScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </CurrencyProvider>
  );
}

