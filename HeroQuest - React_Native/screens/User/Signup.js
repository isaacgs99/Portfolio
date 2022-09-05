import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Image, ImageBackground, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import firebase from '../../database/firebase';

const imageBg = require('../../assets/images/wallpaper2.jpg');
const logo = require('../../assets/images/heroQuestLogo.png');

export default function Signup() {
  // Navigation Hook
  const navigation = useNavigation();

  // TextInput States
  const [email, onChangeEmail] = useState('');
  const [password, onChangePassword] = useState('');
  const [confirm_password, onChangeConfirmPassword] = useState('');
  const [urlImage, onChangeUrlImage] = useState('');

  /** @todo Show validation error instead of printing to console */
  function validateEmail() {
    if (email && email.length < 6) return console.error('Email is too short');
    if (email.length > 48) return console.error('Email is too long');

    const regex = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/g;
    if (!email.match(regex)) return console.error('Invalid Email');

    return console.log('Email validated!');
  };

  /** @todo Show validation error instead of printing to console */
  function validatePassword() {
    if (password && password.length < 8) return console.error('Password must be at least 8 characters long');

    return console.log('Password validated!');
  };

  /** @todo Show validation error instead of printing to console */
  function validateConfirmPassword() {
    if (confirm_password && confirm_password !== password) return console.error('Passwords do not match');

    return console.log('Confirm password validated!');
  };

  /** 
   * @todo Show validation error instead of printing to console
   */
  function handleSignup() {
    if (!email || !password || !confirm_password) return console.error('All fields must be filled');

    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(userCredentials => {
        const user = userCredentials.user;
        const url = urlImage;
        // firebase.database().ref(`/users/${firebase.auth().currentUser.uid}/photo`).set(urlImage);
        user.updateProfile({
          displayName: email.split('@')[0],
          photoURL: url
        })
          .then(_ => console.log('User display name updated successfully!'))
          .catch(e => console.error('Error: ', e));

        console.log(`User ${user.email} created successfully!`);

        firebase.auth().signInWithEmailAndPassword(email, password)
          .then(userCredential => {
            console.log('Signed In: ', userCredential.user.email);
            return navigation.navigate('Loading');
          })
          .catch(e => console.error('Error: ', e));
      })
      .catch(e => console.error('Error: ', e));
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />
      <ImageBackground source={imageBg} style={styles.background} imageStyle={styles.backgroundImage} >
        <View style={styles.formContainer}>
          <Image source={logo} style={styles.logo} />
          <View>
            <Text style={styles.loginHeader} >Sign Up</Text>
            <TextInput
              style={styles.inputField}
              onChangeText={onChangeEmail}
              onBlur={validateEmail}
              value={email}
              placeholder='Email'
            />
            <TextInput
              style={styles.inputField}
              onChangeText={onChangePassword}
              onBlur={validatePassword}
              value={password}
              placeholder='Password'
              secureTextEntry={true}
            />
            <TextInput
              style={styles.inputField}
              onChangeText={onChangeConfirmPassword}
              onBlur={validateConfirmPassword}
              value={confirm_password}
              placeholder='Confirm Password'
              secureTextEntry={true}
            />
            <TextInput
              style={styles.inputField}
              onChangeText={onChangeUrlImage}
              value={urlImage}
              placeholder='URL for profile pic'
            />
            <Pressable
              style={styles.buttonDarker}
              onPress={handleSignup}
            >
              <Text style={styles.buttonText}>Sign Up</Text>
            </Pressable>
          </View>

          <View style={styles.horizontalRule} />

          <View>
            <Pressable
              style={styles.buttonLighter}
              onPress={_ => navigation.goBack()}
            >
              <Text style={styles.buttonText}>{'< Back to Log In'}</Text>
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
  loginHeader: {
    color: '#fff',
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 25,
    marginTop: -50,
    fontSize: 25,
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2
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
