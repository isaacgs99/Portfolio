import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, ImageBackground } from 'react-native';

const imageBg = require('../assets/images/wallpaper2.jpg');
const logo = require('../assets/images/heroQuestLogo.png');

const DATA = [
  {
    id: '1',
    title: 'Question and answer 1',
  },
  {
    id: '2',
    title: 'Question and answer 2',
  },
  {
    id: '3',
    title: 'Question and answer 3',
  }
];

function Item({ id, title, selected, onSelect }) {
  return (
    <TouchableOpacity
      onPress={() => onSelect(id)}
      style={[
        styles.item,
      ]}
    >
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
}

export default function qanda() {
  const [selected, setSelected] = React.useState(new Map());

  const onSelect = React.useCallback(
    id => {
      const newSelected = new Map(selected);
      newSelected.set(id, !selected.get(id));

      setSelected(newSelected);
    },
    [selected],
  );
  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />
      <ImageBackground source={imageBg} style={styles.background} imageStyle={styles.backgroundImage} >
      <View style = {styles.formContainer}>
        <View>
          
        </View>
        <View style={styles.name}>
          <Text>Categoria Selecionada</Text>
        </View>
        <View style={styles.horizontalRule} />
        <View style = {{marginBottom: 275}}>
          <FlatList
            data={DATA}
            renderItem={({ item }) => (
            <Item
              id={item.id}
              title={item.title}
              selected={!!selected.get(item.id)}
              onSelect={onSelect}
            />
            )}
            keyExtractor={item => item.id}
            extraData={selected}
          />
          <Pressable 
                  style={styles.buttonLighter}
                  onPress={() => onSelect(id)}
              >
                  <Text style={styles.buttonText}>Contact Us</Text>
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
  }
});
