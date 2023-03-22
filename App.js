import React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './components/HomeScreen';
import WelcomeScreen from './components/WelcomeScreen';
import SettingsScreen from './components/SettingsScreen';
import ResponseScreen from './components/ResponseScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Welcome" component={WelcomeScreen} options={{headerShown: false}}/>
        <Stack.Screen name="Home" component={HomeScreen} options={{headerLeft: null}}/>
        <Stack.Screen name="Settings" component={SettingsScreen}/>
        <Stack.Screen name="Response" component={ResponseScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
