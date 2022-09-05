import React, { useState, useEffect } from 'react';
import { StyleSheet, Pressable, Text, View, Image, Modal, TextInput, StatusBar } from 'react-native';

import firebase from '../../database/firebase';

import { Ionicons } from '@expo/vector-icons';
import { SimpleLineIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';

import Loading from '../Loading';

const logo = require('../../assets/images/heroQuestLogo.png');

export default function UserProfile() {

    const [updateInfoVisible, setUpdateInfoVisible] = useState(false);

    const [user, updateUser] = useState({});
    const [username, updateUsername] = useState('');
    const [email, updateEmail] = useState('');
    const [userPhoto, updateUserPhoto] = useState('');
    const [password, updatePassword] = useState('');
    const [askForPassword, updateAskForPassword] = useState(false);

    const [isLoading, updateLoadingStatus] = useState(true);

    useEffect(_ => {
        if (!firebase.auth().currentUser) return console.log('No user');

        const userRef = firebase.database().ref(`/users/${firebase.auth().currentUser.uid}`);
        userRef.get().then(snapshot => {
            const userSnap = snapshot.val();
            updateUser(userSnap);
            updateUsername(userSnap.username);
            updateEmail(userSnap.email);
            updateUserPhoto(userSnap.photo);

            updateLoadingStatus(false);
        });
    }, []);

    function handleCloseUpdateInfo() {
        if (email != user.email) {
            if (!password) return;

            const credential = firebase.auth.EmailAuthProvider.credential(user.email, password);
            firebase.auth().currentUser.reauthenticateWithCredential(credential)
                .then(_ => {
                    const userCopy = user;
                    firebase.auth().currentUser.updateEmail(email);
                    firebase.database().ref(`/users/${user.uid}/email`).set(email);
                    userCopy.email = email;

                    if (username != user.username) {
                        firebase.auth().currentUser.updateProfile({
                            displayName: username,
                        });
                        firebase.database().ref(`/users/${user.uid}/username`).set(username);
                        userCopy.username = username;
                    }

                    if (userPhoto != user.photoURL) {
                        firebase.auth().currentUser.updateProfile({
                            photoURL: userPhoto
                        });
                        firebase.database().ref(`/users/${user.uid}/photo`).set(userPhoto);
                        userCopy.photo = userPhoto;
                    }

                    updateUser(userCopy);
                    updatePassword('');
                    updateAskForPassword(false);
                    return setUpdateInfoVisible(false);
                })
                .catch(e => console.error('Change Email: ', e));
        } else if (username != user.username) {
            const userCopy = user;
            firebase.auth().currentUser.updateProfile({
                displayName: username,
            });
            firebase.database().ref(`/users/${user.uid}/username`).set(username);
            userCopy.username = username;

            if (userPhoto != user.photoURL) {
                firebase.auth().currentUser.updateProfile({
                    photoURL: userPhoto
                });
                firebase.database().ref(`/users/${user.uid}/photo`).set(userPhoto);
                userCopy.photo = userPhoto;
            }
            updateUser(userCopy);
            return setUpdateInfoVisible(false);
        } else if (userPhoto != user.photoURL) {
            firebase.auth().currentUser.updateProfile({
                photoURL: userPhoto
            });
            firebase.database().ref(`/users/${user.uid}/photo`).set(userPhoto);
            updateUser({ ...user, photo: userPhoto });

            return setUpdateInfoVisible(false);
        } else {
            return setUpdateInfoVisible(false);
        }
    };

    function handleEmailChange() {
        if (email === user.email) return updateAskForPassword(false);
        updateAskForPassword(true);
    }

    return (
        <>
            { isLoading ? <Loading color={'white'} /> :
                <View style={styles.container}>
                    <Modal
                        animationType="slide"
                        transparent={false}
                        visible={updateInfoVisible}
                        onRequestClose={_ => setUpdateInfoVisible(false)}
                    >
                        <View style={updateInfo.container}>
                            <StatusBar hidden={true} />
                            <Pressable
                                onPress={handleCloseUpdateInfo}
                            >
                                <FontAwesome name="times" size={35} color="white" />
                            </Pressable>
                            <View style={updateInfo.fields}>
                                <Image source={logo} style={styles.logo} />
                                <TextInput
                                    style={styles.inputField}
                                    onChangeText={updateUsername}
                                    value={username}
                                    placeholder='Username'
                                />
                                {firebase.auth().currentUser.providerData[0].providerId === 'password' ?
                                    <TextInput
                                        style={styles.inputField}
                                        onChangeText={updateEmail}
                                        onBlur={handleEmailChange}
                                        value={email}
                                        placeholder='Email'
                                    />
                                    : []}
                                <TextInput
                                    style={styles.inputField}
                                    onChangeText={updateUserPhoto}
                                    value={userPhoto}
                                    placeholder='Photo URL'
                                />
                                {askForPassword ?
                                    <>
                                        <Text style={updateInfo.passwordText}>To edit your email, your password is needed.</Text>
                                        <TextInput
                                            style={styles.inputField}
                                            onChangeText={updatePassword}
                                            value={password}
                                            secureTextEntry={true}
                                            placeholder='Password'
                                        />
                                    </>
                                    : []}
                            </View>
                        </View>
                    </Modal>


                    <View style={basicInfo.container}>
                        <Pressable
                            onPress={() => { }}
                        >
                            <Image style={basicInfo.userImage} source={{ uri: user.photo ? user.photo : 'https://palmbayprep.org/wp-content/uploads/2015/09/user-icon-placeholder.png' }} />
                        </Pressable>
                        <View style={basicInfo.basicInfo}>
                            <Text style={basicInfo.username}>{user.username}</Text>
                            <Text style={basicInfo.email}>{user.email}</Text>
                        </View>
                    </View>
                    <View style={settings.container}>
                        <Pressable
                            style={settings.option}
                            onPress={_ => setUpdateInfoVisible(true)}
                        >
                            <Ionicons style={settings.optionIcon} name="settings-sharp" size={24} />
                            <Text style={settings.optionText}>Update Information</Text>
                        </Pressable>
                        <Pressable
                            style={settings.option}
                            onPress={_ => firebase.auth().signOut()}
                        >
                            <SimpleLineIcons style={settings.optionIcon} name="logout" size={24} />
                            <Text style={settings.optionText}>Log Out</Text>
                        </Pressable>
                    </View>
                </View>
            }
        </>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        margin: 20
    },
    logo: {
        width: 300,
        height: 300,
        resizeMode: 'contain',
        marginHorizontal: 30,
        marginBottom: -30
    },
    inputField: {
        backgroundColor: '#fff',
        width: 250,
        padding: 10,
        borderRadius: 10,
        marginBottom: 25,
        fontSize: 15
    },
});

const basicInfo = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    userImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderColor: '#2E578A',
        borderWidth: 2,
        marginRight: 20
    },
    basicInfo: {
        flex: 1
    },
    username: {
        fontSize: 25,
        fontWeight: 'bold',
        color: '#002960'
    },
    email: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#888E97'
    }
});

const settings = StyleSheet.create({
    container: {
        flex: 4,
        width: '100%',
        marginTop: 20
    },
    option: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#A1B0C4',
        borderWidth: 1,
        borderRadius: 5,
        maxHeight: 50,
        marginBottom: 10,
        padding: 5
    },
    optionIcon: {
        color: '#2E578A',
        marginRight: 10
    },
    optionText: {
        fontSize: 17,
        color: '#002960'
    }
});

const updateInfo = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#3c70b0',
        padding: 20
    },
    fields: {
        flex: 1,
        alignItems: 'center',
    },
    passwordText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20
    }
});

/*
Ge7vqJVRj9UxMHPBtAmAVkRuwVm2
    email: "attacktitan@gmail.com"
    meta
        created_at: 1620075763692
        last_logged_in: 1620515153800
    uid: "Ge7vqJVRj9UxMHPBtAmAVkRuwVm2"
    username: "attacktitan"
    photo: "url"
*/