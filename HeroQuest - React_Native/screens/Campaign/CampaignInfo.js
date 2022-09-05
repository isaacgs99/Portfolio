import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, Image, Pressable, View, Modal, TextInput, Switch, StatusBar } from 'react-native';
import { FlatList, ScrollView } from 'react-native-gesture-handler';

import { FontAwesome5 } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';

import firebase from '../../database/firebase';
import { _sendRequest } from '../Notifications';

export default function CampaignInfo({ navigation, route: { params: { campaign } } }) {

    const [isEditModalVisible, setEditModalVisible] = useState(false);
    const [isNewChartModalVisible, setNewCharModalVisible] = useState(false);
    const [isInviteModalVisible, setInviteModalVisible] = useState(false);
    const [isCharModalVisible, setCharModalVisible] = useState(false);
    const [isEditCharModalVisible, setEditCharModalVisible] = useState(false);

    const [photo, updatePhoto] = useState(campaign.info.photo || '');
    const [name, updateName] = useState(campaign.info.name || '');
    const [description, updateDescription] = useState(campaign.info.description || '');
    const [isPrivate, updateIsPrivate] = useState(campaign.info.isPrivate);

    const [charPhoto, updateCharPhoto] = useState('');
    const [charName, updateCharName] = useState('');
    const [charDesc, updateCharDesc] = useState('');

    const [characters, updateCharacters] = useState([]);
    const [selectedChar, updateSelectedChar] = useState({});

    const [users, updateUsers] = useState([]);
    const [campaignUsers, updateCampaignUsers] = useState([]);

    const campaignRef = firebase.database().ref(`/campaigns/${campaign.id}`);

    useEffect(function listenCharacters() {
        const unsubscribe = campaignRef.child('/characters').on('value', snapshot => {
            const charactersDB = snapshot.val();
            if (!charactersDB) return;
            const characterIds = Object.keys(charactersDB);
            const characters = characterIds.map(id => {
                return { id, ...charactersDB[id] }
            }).sort((a, b) => {
                if(a.name < b.name) return -1;
                if(a.name > b.name) return 1;
                return 0;
            });

            updateCharacters(characters);
        });

        return () => campaignRef.child('/characters').off('value', unsubscribe);
    }, []);
    
    useEffect(function listenUsers() {
        const unsubscribe = campaignRef.child('/users').on('value', snapshot => {
            const usersDB = snapshot.val();
            if (!usersDB.length) return;
            updateCampaignUsers(usersDB);
        });

        return () => campaignRef.child('/users').off('value', unsubscribe);
    }, []);

    function handleCloseEditModal() {
        const newCampaignInfo = { photo, name, description, isPrivate };
        campaignRef.child('/info').set(newCampaignInfo)
            .catch(e => console.error('Error updating campaign info: ', e));
        setEditModalVisible(false)
    };

    function handleCloseNewCharModal() {
        updateCharPhoto('');
        updateCharName('');
        updateCharDesc('');
        setNewCharModalVisible(false);
    };

    function handleCreateCharacter() {
        const newCharacter = { photo: charPhoto, name: charName, description: charDesc };
        const newCharacterRef = campaignRef.child('/characters').push();
        newCharacterRef.set(newCharacter)
            .then(handleCloseNewCharModal)
            .catch(e => console.error('Error creating new character: ', e));
    };

    function handleOpenInviteModal() {
        firebase.database().ref('/users').get()
        .then(snapshot => {
            const usersDB = snapshot.val();
            if (!usersDB) return;
            const usersIds = Object.keys(usersDB);
            const users = usersIds.map(id => {
                return { id, username: usersDB[id].username, photo: usersDB[id].photo, selected: false };
            }).filter(user => !campaignUsers.includes(user.id));
            // }).filter(user => user.id != firebase.auth().currentUser.uid);

            updateUsers(users);
            setInviteModalVisible(true);
        })
        .catch(e => console.error('Error fetching users: ', e));
    };

    function handleCloseInviteModal() {
        const selectedUsers = users.filter(user => user.selected);
        const notification = _sendRequest(false, 1, campaign.id, campaign.info.name);
        selectedUsers.forEach(user => firebase.database().ref(`/users/${user.id}/notifications`).push(notification));
        updateUsers([]);
        setInviteModalVisible(false);
    };

    function handleViewChar(character) {
        updateSelectedChar(character);
        setCharModalVisible(true);
    };

    function handleCloseCharModal() {
        updateSelectedChar({});
        setCharModalVisible(false);
    };

    function handleDeleteCharacter() {
        campaignRef.child(`/characters/${selectedChar.id}`).set({})
            .then(handleCloseCharModal)
            .catch(e => console.error('Error deleting character: ', e));
    };

    function handleCloseEditCharModal() {
        campaignRef.child(`/characters/${selectedChar.id}`).set({ ...selectedChar, id: null })
            .catch(e => console.error('Error updating character: ', e));
        setEditCharModalVisible(false);
    };
    
    return(
        <>
            <Modal
                visible={isEditModalVisible}
                animationType={'slide'}
                transparent={false}
                onRequestClose={_ => setEditModalVisible(false)}
            >
                <View style={modal.container}>
                    <StatusBar hidden={true} />
                    <Pressable
                        onPress={handleCloseEditModal}
                        style={ modal.closeButton }
                    >
                        <FontAwesome name="times" size={35} color="#9D9D9D" />
                    </Pressable>

                    <TextInput
                        value={photo}
                        placeholder={'URL of campaign photo'}
                        onChangeText={updatePhoto}
                        style={ modal.nameInput }
                    />       
                    <TextInput
                        value={name}
                        placeholder={'Campaign Name'}
                        onChangeText={updateName}
                        style={ modal.nameInput }
                    />
                    <TextInput
                        multiline={true}
                        value={description}
                        placeholder={'Campaign Description'}
                        onChangeText={updateDescription}
                        style={ modal.nameInput }
                    />

                    <View style={ modal.privacyContainer }>
                        <Switch
                            style={{ transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }] }}
                            trackColor={{ false: "#767577", true: "#2E578A" }}
                            thumbColor={isPrivate ? "#408F96" : "#f4f3f4"}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={_ => updateIsPrivate(!isPrivate)}
                            value={isPrivate}
                        />
                        <Text style={{ fontSize: 18, marginLeft: 10, color: '#fff' }}>{isPrivate ? 'Private' : 'Public'}</Text>
                    </View>
                </View>
            </Modal>
            <Modal
                visible={isNewChartModalVisible}
                animationType={'slide'}
                transparent={false}
                onRequestClose={_ => setNewCharModalVisible(false)}
            >
                <View style={modal.container}>
                    <StatusBar hidden={true} />
                    <Pressable
                        onPress={handleCloseNewCharModal}
                        style={modal.closeButton}
                    >
                        <FontAwesome name="times" size={35} color="#9D9D9D" />
                    </Pressable>
                    
                    <TextInput
                        value={charPhoto}
                        placeholder={'URL of character photo'}
                        onChangeText={updateCharPhoto}
                        style={modal.nameInput}
                    />
                    <TextInput
                        value={charName}
                        placeholder={'Character Name'}
                        onChangeText={updateCharName}
                        style={modal.nameInput}
                    />
                    <TextInput
                        multiline={true}
                        value={charDesc}
                        placeholder={'Character Description'}
                        onChangeText={updateCharDesc}
                        style={modal.nameInput}
                    />
                    <Pressable
                        style={modal.createButton}
                        onPress={handleCreateCharacter}
                    >
                        <Text style={{ color: '#fff', fontSize: 20 }}>Create Character</Text>
                    </Pressable>
                </View>
            </Modal>
            <Modal
                visible={isInviteModalVisible}
                animationType={'slide'}
                transparent={false}
                onRequestClose={_ => setInviteModalVisible(false)}
            >
                <View style={modal.container}>
                    <StatusBar hidden={true} />
                    <Pressable
                        onPress={handleCloseInviteModal}
                        style={modal.closeButton}
                    >
                        <FontAwesome name="times" size={35} color="#9D9D9D" />
                    </Pressable>

                    <Text style={ { ...styles.campaignName, color: '#fff' } }>Invite Players</Text>
                    <FlatList
                        style={modal.flatList}
                        data={users}
                        keyExtractor={(item, index) => index.toString()}
                        // extraData={users}
                        renderItem={({ item, index }) => (
                            <Pressable 
                                key={index}
                                style={{...styles.charButton, width: '100%', backgroundColor: item.selected ? '#8DB387' : 'white'}}
                                // onPress={() => users[index].selected = !users[index].selected}
                                onPress={() => {
                                    const tmpUsers = users;
                                    tmpUsers[index].selected = !tmpUsers[index].selected;
                                    updateUsers([...tmpUsers])
                                }}
                            >
                                { !item.photo ? <FontAwesome5 name="user" size={24} color="#00000088" style={styles.buttonIcon} />
                                    : <Image style={{ ...styles.buttonIcon, ...styles.charButtonImg }} source={{ uri: item.photo }} /> }
                                <Text style={{...styles.charButtonText, fontSize: 15}}>{item.username}</Text>
                            </Pressable>
                        )}
                    />
                </View>
            </Modal>
            <Modal
                visible={isCharModalVisible}
                animationType={'slide'}
                transparent={false}
                onRequestClose={_ => setCharModalVisible(false)}
            >
                <View style={modal.container}>
                    <StatusBar hidden={true} />
                    <Pressable
                        onPress={handleCloseCharModal}
                        style={modal.closeButton}
                    >
                        <FontAwesome name="times" size={35} color="#9D9D9D" />
                    </Pressable>

                    { !selectedChar.photo 
                        ? <FontAwesome5 name="dragon" size={55} color="#00000088" />
                        : <Image style={styles.imageContainer} source={{ uri: selectedChar.photo }} />
                    }

                    <Text style={ { ...styles.campaignName, color: '#fff'} }>{selectedChar.name}</Text>
                    <Text style={ { ...styles.campaignDesc, color: '#fff'} }>{selectedChar.description}</Text>
                    
                    <Pressable
                        style={{...modal.createButton, paddingVertical: 10, marginBottom: 15}}
                        onPress={_ => setEditCharModalVisible(true)}
                    >
                        <Text style={{ color: '#fff', fontSize: 20 }}>Edit Character</Text>
                    </Pressable>
                    <Pressable
                        style={{...modal.createButton, paddingVertical: 10}}
                        onPress={handleDeleteCharacter}
                    >
                        <Text style={{ color: '#fff', fontSize: 20 }}>Delete Character</Text>
                    </Pressable>
                </View>
            </Modal>
            <Modal
                visible={isEditCharModalVisible}
                animationType={'slide'}
                transparent={false}
                onRequestClose={_ => setEditModalVisible(false)}
            >
                <View style={modal.container}>
                    <StatusBar hidden={true} />
                    <Pressable
                        onPress={handleCloseEditCharModal}
                        style={modal.closeButton}
                    >
                        <FontAwesome name="times" size={35} color="#9D9D9D" />
                    </Pressable>
                    
                    <TextInput
                        value={selectedChar.photo}
                        placeholder={'URL of character photo'}
                        onChangeText={photo => updateSelectedChar({ ...selectedChar, photo })}
                        style={modal.nameInput}
                    />
                    <TextInput
                        value={selectedChar.name}
                        placeholder={'Character Name'}
                        onChangeText={name => updateSelectedChar({ ...selectedChar, name })}
                        style={modal.nameInput}
                    />
                    <TextInput
                        multiline={true}
                        value={selectedChar.description}
                        placeholder={'Character Description'}
                        onChangeText={description => updateSelectedChar({ ...selectedChar, description })}
                        style={modal.nameInput}
                    />
                </View>
            </Modal>
            <ScrollView
                contentContainerStyle={ { alignItems: 'center' } } 
                style={ styles.container }
            >
                { !photo 
                    ? <FontAwesome5 name="dragon" size={55} color="#00000088" />
                    : <Image style={styles.imageContainer} source={{ uri: photo }} />
                }

                <Text style={ styles.campaignName }>{name}</Text>
                <Text style={ styles.campaignDesc }>{description}</Text>
                
                <View style={styles.horizontalRule} />
                
                <Pressable
                    style={styles.newButton}
                    onPress={()=> setEditModalVisible(true)}
                >
                    <AntDesign name="plus" size={24} color="#00000088" style={styles.buttonIcon} />
                    <Text style={styles.newButtonText}>Edit campaign</Text>
                </Pressable>
                <Pressable
                    style={styles.newButton}
                    onPress={() => setNewCharModalVisible(true)}
                >
                    <AntDesign name="plus" size={24} color="#00000088" style={styles.buttonIcon} />
                    <Text style={styles.newButtonText}>Add a new character</Text>
                </Pressable>
                <Pressable
                    style={{...styles.newButton, marginBottom: 0}}
                    onPress={handleOpenInviteModal}
                >
                    <AntDesign name="plus" size={24} color="#00000088" style={styles.buttonIcon} />
                    <Text style={styles.newButtonText}>Invite players</Text>
                </Pressable>
                
                <View style={styles.horizontalRule} />
                
                <Text style={ { ...styles.campaignName, fontSize: 20, marginBottom: 20 } }>Characters</Text>

                {characters.map((character, idx) => (
                    <Pressable 
                        key={idx}
                        style={styles.charButton}
                        onPress={_ => handleViewChar(character)}
                    >
                        { !character.photo ? <FontAwesome5 name="dragon" size={24} color="#00000088" style={styles.buttonIcon} />
                            : <Image style={{ ...styles.buttonIcon, ...styles.charButtonImg }} source={{ uri: character.photo }} /> }
                        <Text style={styles.charButtonText}>{character.name}</Text>
                    </Pressable>
                ))}
            </ScrollView>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 20
    },
    imageContainer: {
        backgroundColor: '#E0E0E0',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 50,
        borderRadius: 100,
        marginBottom: 20
    },
    campaignName: {
        fontWeight: 'bold',
        fontSize: 24
    },
    campaignDesc: {
        marginVertical: 20,
        width: '90%',
        textAlign: 'justify'
    },
    newButton: {
        width: '90%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#E0E0E0',
        padding: 15,
        borderRadius: 10,
        position: 'relative',
        marginBottom: 10
    },
    newButtonText: {
        fontSize: 16,
        color: '#00000088'
    },
    buttonIcon: {
        position: 'absolute',
        left: 15
    },
    horizontalRule: {
        borderBottomColor: '#9D9D9D',
        borderBottomWidth: 1,
        width: '90%',
        marginVertical: 20
    },
    charButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#E0E0E0',
        padding: 15,
        borderRadius: 10,
        position: 'relative',
        marginBottom: 20,
        width: '90%'
    },
    charButtonImg: {
        width: 35,
        height: 35,
        borderRadius: 50
    },
    charButtonText: {
        fontSize: 18
    }
});

const modal = StyleSheet.create({
    container: {
        alignItems: 'center',
        height: '100%',
        backgroundColor: '#3c70b0',
        paddingTop: 80
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        left: 10
    },
    nameInput: {
        backgroundColor: '#E0E0E0',
        padding: 20,
        borderRadius: 10,
        width: '90%',
        fontSize: 16,
        marginBottom: 20
    },
    privacyContainer: {
        width: '90%',
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 30,
        marginBottom: 50
    },
    createButton: {
        backgroundColor: '#2E578A',
        paddingVertical: 30,
        width: '90%',
        alignItems: 'center',
        borderRadius: 20
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#00000044'
    },
    modal: {
        backgroundColor: '#2E578A',
        width: '80%',
        height: 200,
        position: 'relative',
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center'
    },
    modalClose: {
        position: 'absolute',
        top: 10,
        left: 10
    },
    photoInput: {
        backgroundColor: '#fff',
        padding: 10,
        width: '80%',
        borderRadius: 10
    },
    nameInput: {
        backgroundColor: '#E0E0E0',
        padding: 20,
        borderRadius: 10,
        width: '90%',
        fontSize: 16,
        marginBottom: 20
    },
    privacyContainer: {
        width: '90%',
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 30,
        marginBottom: 50
    },
    createButton: {
        backgroundColor: '#2E578A',
        paddingVertical: 30,
        width: '90%',
        alignItems: 'center',
        borderRadius: 20
    },
    flatList: {
        width: '90%',
        marginTop: 40,
    },
});