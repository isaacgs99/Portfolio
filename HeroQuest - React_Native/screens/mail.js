import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, ImageBackground, TextInput, Button } from 'react-native';

const imageBg = require('../assets/images/wallpaper2.jpg');
const logo = require('../assets/images/heroQuestLogo.png');

export default function mail() {
  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />
      <ImageBackground source={imageBg} style={styles.background} imageStyle={styles.backgroundImage} >
      <View style = {styles.formContainer}>
        <View>
          <Text>
            Contact Us
          </Text>
        </View>
        <View>
          <Text style = {styles.subTitles}>
            Asunto
          </Text>
          <View style={styles.horizontalRule} />
          <TextInput
            style = {styles.inputField}
          />
          <Text style = {styles.subTitles}>
            Descripcion
          </Text>
          <View style={styles.horizontalRule} />
          <TextInput
            style = {styles.inputField1}
          />
        </View>
        <Button title = 'SEND' style = {styles.buttonDarker} />
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
  item: {
    width: 300,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#6698d6',
    marginBottom: 10
  },
  title: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 15
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -70
  },
  horizontalRule: {
    borderBottomColor: '#fff',
    borderBottomWidth: 1,
    width: 300,
    marginBottom: 25
  },
  name: {
    marginTop: 325,
    padding: 40,
    alignItems: "center"
  },
  inputField: {
    backgroundColor: '#fff',
    width: 250,
    padding: 10,
    borderRadius: 10,
    marginBottom: 25,
    fontSize: 15
  },
  inputField1: {
    backgroundColor: '#fff',
    width: 350,
    height: 150,
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 15
  },
  subTitles: {
    padding: 40,
    alignItems: "center"
  },
  buttonDarker: {
    width: 250,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#6698d6',
    marginBottom: 25
  },
});
