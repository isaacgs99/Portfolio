import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Login from '../../screens/User/Login';
import Signup from '../../screens/User/Signup';
import Loading from '../../screens/Loading';
import Notifications from '../../screens/Notifications';

const Stack = createStackNavigator();

export default function StackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName='Login'
      screenOptions={{
        headerShown: false,
        animationEnabled: false,
      }}
    >
      <Stack.Screen name='Login' component={Login} options={{ title: 'Login' }} />
      <Stack.Screen name='Signup' component={Signup} options={{ title: 'Signup' }} />
      <Stack.Screen name='Loading' component={Loading} options={{ title: 'Loading' }} />
      <Stack.Screen name='Notifications' component={Notifications} options={{ title: 'Notifications' }} />
    </Stack.Navigator>
  );
};