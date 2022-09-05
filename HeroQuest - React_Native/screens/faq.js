import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Modal, Pressable, Image } from 'react-native';

const imageBg = require('../assets/images/wallpaper2.jpg');
const logo = require('../assets/images/heroQuestLogo.png');

import { FontAwesome } from '@expo/vector-icons';

const DATA = [
  {
    id: '1',
    title: 'Character Creation',
    questions: [{
      Answer: 'Q: Can I create as many characters I want? \nA: Yes, as many you can imagine.'
    },
    {
      Answer: 'Q: How do I create a character? \nA: Search for the add character button and fill the format.'
    }
    ]
  },
  {
    id: '2',
    title: 'Map Creation',
    questions: [{
      Answer: 'Q: Where can I create a map? \nA: The map creator will be implemented in about 3 months.'
    },
    {
      Answer: 'Q: How will the map creator work? \nA: The  map creator will give the ability to do your own dungeon maps.'
    }
    ]
  },
  {
    id: '3',
    title: 'Invite Players',
    questions: [{
      Answer: 'Q: Where can I invite players? \nA: You can invite them once you created a campaign and the request is accepted.'
    },
    {
      Answer: 'Q: How many players can I invite? \nA: As many friends as you have!.'
    }
    ]
  },
  {
    id: '4',
    title: 'Character Sheet PDF Creation',
    questions: [{
      Answer: 'Q: Where can I make the PDF sheet for my character? \nA: The PDF sheet creation will be implemented in about 3 months.'
    },
    {
      Answer: 'Q: Is there any place that I can do it? \nA: Of course, in the heroquest official webpage.'
    }
    ]
  },
  {
    id: '5',
    title: 'Inventory Tracker',
    questions: [{
      Answer: 'Q: Where is the inventory tracker? \nA: The inventory tracker will be implemented in about 3 months.'
    },
    {
      Answer: 'Q: How will the inventory tracker work? \nA: The inventory tracker will give the ability to your dungeon master to add items to all the players\' inventory.'
    }
    ]
  },
  {
    id: '6',
    title: 'In-game Chat Tracker',
    questions: [{
      Answer: 'Q: How will the in-game chat tracker work? \nA: The in-game tracker will allow you to chat, or "whisper", to other players during a campaign to be able to plan encounters.'
    },
    {
      Answer: 'Q: When will the in-game tracker be implemented? \nA: The in-game tracker will be implemented in about 3 months time.'
    }
    ]
  },
  {
    id: '7',
    title: 'Character Stats Tracker',
    questions: [{
      Answer: 'Q: Do you have a character stats tracker? \nA: At the moment, HeroQuest does not have a character stats tracker. However, you can still use the character stats tracker from DnDBeyond or SideQuestDnD home page.'
    },
    {
      Answer: 'Q: Will I be able to export my character stats to a PDF for printing? \nA: Yes! All of your character stats will be rendered into a PDF file that you can easily download and print, for usage while you play the game live.'
    }
    ]
  },
  {
    id: '8',
    title: 'Chat',
    questions: [{
      Answer: 'Q: Can I chat with other players? \nA: At the moment, you can not chat with other players. However, we\'re working on implementing a chat between players so that they can share their DnD experiences!'
    },
    {
      Answer: 'Q: What is the notifications section? \nA: The notifications section, at the moment, notifies you when you\'ve been invited to a DnD campaign by another user! You can accept/reject their request from there.'
    }
    ]
  },
  {
    id: '9',
    title: 'Campaign Progress Tracker',
    questions: [{
      Answer: 'Q: How can I track my campaign\'s progress? \nA: You can track your campaign\'s progress through the characters you add into a campaign and through the campaign description that you can edit.'
    },
    {
      Answer: 'Q: Will there be a better way of tracking my campaign\'s progress in the future? \nA: Absolutely! In the future, you will be able to add maps, heroes, stories, and more to your DnD campaign!'
    }
    ]
  },
  {
    id: '10',
    title: 'Forums',
    questions: [{
      Answer: 'Q: Where do I need to click to publish my comment? \nA: In the paper airplain symbol.'
    },
    {
      Answer: 'Q: How can I publish a foto at my post? \nA: This function is coming soon.'
    },
    ]
  },
  {
    id: '11',
    title: 'oAuth (Facebook, Google, etc ...)',
    questions: [{
      Answer: 'Q: Why my password is incorrect? \nA1: Check the network settings and ensure that you have conection. \nA2: Check the block mayus key. \nA3: Reset your password.'
    },
    {
      Answer: 'Q: Why I can´t conect with google? \nA1: Check the network settings and ensure that you have conection.'
    },
    {
      Answer: 'Q: Why I can´t register my account? \nA1: Check the network settings and ensure that you have conection.'
    },
    ]
  }
];
const _sendData = () => {
  // console.log(selected)
};

function Item({ id, title, onSelect }) {
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

export default function faq() {
  const [selected, setSelected] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const onSelect = (id) => {
    // console.log('clicked: ', id);
    setSelected(DATA[id - 1].questions);
    setModalVisible(true);
  };

  return (
    <>
      <View style={styles.container}>
        <Modal
          animationType="slide"
          transparent={false}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <Pressable
            onPress={() => setModalVisible(false)}
          >
            <FontAwesome name="arrow-left" size={35} color="black" />
          </Pressable>
          <View style={styles.container} >
            <View style={styles.modalView} >
              {selected.map((question, idx) => <Text key={idx} style={styles.item} >{question.Answer}</Text>)}
            </View>
          </View>
        </Modal>



        <StatusBar hidden={true} />
        <View style={styles.formContainer}>
          <View style={styles.name}>
            <Image
              style={styles.tinyLogo}
              source={require('../assets/images/faqimg.png')}
            />
          </View>
          <View style={styles.horizontalRule} />
          <View style={{ marginBottom: 275 }}>
            <FlatList
              data={DATA}
              renderItem={({ item }) => (
                <Item
                  onPress={() => _sendData()}
                  id={item.id}
                  title={item.title}
                  // selected={!!selected.get(item.id)}
                  onSelect={onSelect}
                />
              )}
              keyExtractor={item => item.id}
              extraData={selected}
            />
          </View>
        </View>
      </View>
    </>
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
    marginBottom: 10,
    color: 'white'
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
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    width: 300,
    marginBottom: 25
  },
  name: {
    marginTop: 325,
    padding: 40,
    alignItems: "center"

  },
  buttonLighter: {
    width: 250,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#adc8e9',
    marginBottom: 25
  },
  modalView: {
    margin: 30,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  tinyLogo: {
    width: 100,
    height: 100,
  },
});
