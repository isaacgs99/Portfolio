import React, { useState } from 'react';
import { Image, Modal, Pressable, StyleSheet, Switch, Text, View } from 'react-native';

import { AntDesign } from '@expo/vector-icons';
import { TextInput } from 'react-native-gesture-handler';
import { FontAwesome } from '@expo/vector-icons';

import firebase from '../../database/firebase';

export default function NewCampaign({ navigation, route: { params: { userCampaignIds } } }) {
    const [name, updateName] = useState('');
    const [description, updateDescription] = useState('');
    const [photo, updatePhoto] = useState('');
    const [isPrivate, updateIsPrivate] = useState(false);

    const [isModalVisible, setModalVisible] = useState(false);

    function handleCreateCampaign() {
        const newCampaignRef = firebase.database().ref('/campaigns').push();
        newCampaignRef.set({ info: { name, description, photo, isPrivate }, users: [firebase.auth().currentUser.uid] })
            .then(_ => {
                const userCampaignsRef = firebase.database().ref(`/users/${firebase.auth().currentUser.uid}/campaigns`);
                const userCampaignIdsCopy = userCampaignIds;
                userCampaignIdsCopy.push(newCampaignRef.toString().split('/campaigns/')[1]);
                userCampaignsRef.set(userCampaignIdsCopy)
                    .catch(e => console.error('Error Appending Campaign to User: ', e));
                navigation.pop();
            })
            .catch(e => console.error('Error Creating Campaign: ', e));
    };

    return(
        <>
            <Modal
                visible={isModalVisible}
                animationType={'fade'}
                transparent={true}
                onRequestClose={_ => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modal}>
                        <Pressable
                            style={styles.modalClose}
                            onPress={_ => setModalVisible(false)}
                        >
                            <FontAwesome name="times" size={24} color="white" />
                        </Pressable>
                        <TextInput
                            style={styles.photoInput}
                            placeholder={'Image URL'}
                            value={photo}
                            onChangeText={updatePhoto}
                        />
                    </View>
                </View>
            </Modal>
            <View style={styles.container}>
                <Pressable
                    style={!photo ? styles.imageContainer : {}}
                    onPress={_ => setModalVisible(true)}
                >
                    { !photo 
                        ? <AntDesign name="plus" size={24} color="#00000088" />
                        : <Image style={styles.imageContainer} source={{ uri: photo }} />
                    }
                </Pressable>
                <TextInput
                    value={name}
                    placeholder={'Campaign Name'}
                    onChangeText={updateName}
                    style={styles.nameInput}
                />
                <TextInput
                    multiline={true}
                    value={description}
                    placeholder={'Campaign Description'}
                    onChangeText={updateDescription}
                    style={styles.nameInput}
                />
                <View style={styles.privacyContainer}>
                    <Switch
                        style={{ transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }] }}
                        trackColor={{ false: "#767577", true: "#2E578A" }}
                        thumbColor={isPrivate ? "#408F96" : "#f4f3f4"}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={_ => updateIsPrivate(!isPrivate)}
                        value={isPrivate}
                    />
                    <Text style={{ fontSize: 18, marginLeft: 10 }}>{isPrivate ? 'Private' : 'Public'}</Text>
                </View>
                <Pressable
                    style={styles.createButton}
                    onPress={handleCreateCampaign}
                >
                    <Text style={{ color: '#fff', fontSize: 20 }}>Create Campaign</Text>
                </Pressable>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
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
    }
});