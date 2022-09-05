import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Image, ImageBackground, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import firebase from '../../database/firebase';
import * as Google from 'expo-google-app-auth';

import { AntDesign } from '@expo/vector-icons';

const imageBg = require('../../assets/images/wallpaper2.jpg');
const logo = require('../../assets/images/heroQuestLogo.png');

export default function Login() {
  // Navigation Hook
  const navigation = useNavigation();

  // TextInput States
  const [email, onChangeEmail] = useState('');
  const [password, onChangePassword] = useState('');

  // Google Log In / Sign Up
  function isUserEqual(googleUser, firebaseUser) {
    if (!firebaseUser) return false;

    const providerData = firebaseUser.providerData;
    for (let i = 0; i < providerData.length; i++) {
      // If true, We don't need to reauth the Firebase connection.
      if (providerData[i].providerId === firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
        providerData[i].uid === googleUser.getBasicProfile().getId()) return true;
    }

    return false;
  };

  function onSignIn(googleUser) {
    // console.log('Google Auth Response', googleUser);
    // We need to register an Observer on Firebase Auth to make sure auth is initialized.
    const unsubscribe = firebase.auth().onAuthStateChanged(firebaseUser => {
      unsubscribe();
      
      // Check if we are already signed-in Firebase with the correct user.
      if (isUserEqual(googleUser, firebaseUser)) return console.log('User already signed-in Firebase.');
      
      // Build Firebase credential with the Google ID token.
      const credential = firebase.auth.GoogleAuthProvider.credential(
        googleUser.idToken,
        googleUser.accessToken
      );

      // Sign in with credential from the Google user.
      firebase.auth().signInWithCredential(credential)
        .then( userCredential => console.log('User Signed In!'))
        .catch( e => console.error('Error: ', e) );
    });
  };

  async function signInWithGoogleAsync() {
    try {
      const result = await Google.logInAsync({
        behavior: 'web',
        androidClientId: '589079479295-6ei8nf3ekt1utf1o0iget2el1c3mn07e.apps.googleusercontent.com',
        iosClientId: '589079479295-qcu75kvc959budcf2c43qggp3fnpps3h.apps.googleusercontent.com',
        scopes: ['profile', 'email'],
      });
  
      if (result.type === 'success') {
        onSignIn(result);
        return result.accessToken;
      } else {
        return { cancelled: true };
      }
    } catch (e) {
      return { error: true };
    }
  };

  // Email Log In
  /** @todo Show validation error instead of printing to console */
  function validateEmail(email) {
    if (email && email.length < 6) return { success: false, msg: 'Email is too short' };
    if (email.length > 48) return { success: false, msg: 'Email is too long' };

    const regex = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/g;
    if (!email.match(regex)) return { success: false, msg: 'Invalid Email' };

    return { success: true, msg: 'Email validated!' };
  };

  /** @todo Show validation error instead of printing to console */
  function validatePassword(password) {
    if (password && password.length < 8) return { success: false, msg: 'Password must be at least 8 characters long' };

    return { success: true, msg: 'Password validated!' };
  };
  
  function handleLogin() {
    const vEmail = validateEmail(email).success;
    const vPassword = validatePassword(password).success;

    if (!vEmail || !vPassword) return console.error('Validation Error');

    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(userCredential => {
        console.log('Signed In: ', userCredential.user.email);
        return navigation.navigate('Loading');
      })
      .catch( e => console.error('Error: ', e) );
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />
      <ImageBackground source={imageBg} style={styles.background} imageStyle={styles.backgroundImage} >
          <View style={styles.formContainer}>
              <Image source={logo} style={styles.logo} />
              <View>
              <TextInput 
                  style={styles.inputField}
                  onChangeText={onChangeEmail}
                  value={email}
                  placeholder='Email'
              />
              <TextInput 
                  style={styles.inputField}
                  onChangeText={onChangePassword}
                  value={password}
                  placeholder='Password'
                  secureTextEntry={true}
              />
              <Pressable 
                  style={styles.buttonDarker}
                  onPress={handleLogin}
              >
                  <Text style={styles.buttonText}>Log In</Text>
              </Pressable>
              </View>
              
              <View style={styles.horizontalRule} />

              <View>
              <Pressable 
                  style={styles.buttonFlex}
                  onPress={signInWithGoogleAsync}
              >
                  <AntDesign name="google" size={24} style={styles.buttonImageFlex} />
                  <Text style={styles.buttonText}>Sign in with Google</Text>
              </Pressable>
              <Pressable 
                  style={styles.buttonLighter}
                  onPress={ _ => navigation.navigate('Signup') }
              >
                  <Text style={styles.buttonText}>Sign up with Email</Text>
              </Pressable>
              </View>
          </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  background: {
    flex: 1,
    justifyContent: 'center',
  },
  backgroundImage: {
    // position: 'absolute',
    // left: -570,
    // width: '300%'
    resizeMode: 'cover'
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -70
  },
  logo: { 
    width: 300,
    height: 300,
    resizeMode: 'contain',
    marginHorizontal: 30,
    marginBottom: -20
  },
  inputField: {
    backgroundColor: '#fff',
    width: 250,
    padding: 10,
    borderRadius: 10,
    marginBottom: 25,
    fontSize: 15
  },
  horizontalRule: {
    borderBottomColor: '#fff',
    borderBottomWidth: 1,
    width: 300,
    marginBottom: 25
  },
  buttonDarker: {
    width: 250,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#6698d6',
    marginBottom: 25
  },
  buttonLighter: {
    width: 250,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#adc8e9',
    marginBottom: 25
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 15
  },
  buttonFlex: {
    width: 250,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#6698d6',
    marginBottom: 25,
    flex: -1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row'
  },
  buttonImageFlex: {
    color: '#fff',
    marginRight: 27
  }
});
