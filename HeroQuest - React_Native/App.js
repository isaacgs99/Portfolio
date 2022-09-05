import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useEffect, useState } from 'react';

import firebase from './database/firebase';

import StackNavigator from './components/Navigation/StackNavigator';
import TabNavigator from './components/Navigation/TabNavigator';

// Disable warnings
console.disableYellowBox = true;

export default function App() {
  // Login Status Hook
  const [isLoggedIn, updateLoginStatus] = useState(false);

  useEffect(function checkIfLoggedIn() {
    const unsubscribe = firebase.auth().onAuthStateChanged(user => {
      user
        ? updateLoginStatus(true)
        : updateLoginStatus(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <NavigationContainer>
      {!isLoggedIn ? (<StackNavigator />) : (<TabNavigator />)}
    </NavigationContainer>
  );
};