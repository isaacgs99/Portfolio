import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, TextInput, TouchableHighlight, } from 'react-native';

import firebase from '../../database/firebase';

import * as ImagePicker from 'expo-image-picker';
import { Feather } from "@expo/vector-icons";

export const UserPost = () => {

    const [text, onChangeText] = useState("");

    const [titleText, onChangeTitleText] = useState("");

    const [user, updateUser] = useState({});

    const [image, setImage] = useState("");

    /**
    * Use Effect method for updating a user.
    * @return {Object} returns an object in the user state 
    */
    useEffect(() => {
        const user = firebase.auth().currentUser.uid

        firebase.database().ref(`users/${user}`).get()
            .then(snapshot => {
                const user = snapshot.val();
                updateUser(user)
            });
        const OnLoadingListener = firebase.database().ref(`users/${user}/photo`).on('value', snapshot => {
            const imageFire = snapshot.val();
            let imageCopy = imageFire;
            // setData({ ...data, imageCopy })
            setImage(imageCopy)
        });
        return () => {
            firebase.database().ref(`users/${user}/photo`).off('value', OnLoadingListener)
        };

    }, []);


    /**
    * Creates a new post object and post it in FB
    * 
    */
    const _onPressButton = () => {
        if (titleText && text) {
            let newPost =
            {
                "userId": user.uid || "",
                "username": user.username || "",
                "title": titleText,
                "user_photo": user.photo || "",
                // "post_image": image,
                "description": text,
                "like_number": 0,
                // "comments_number": 0,
                "comment_list": []
            };
            console.log("New Post ", newPost);
            firebase.database().ref(`/posts`).push({ ...newPost }, () => {
                onChangeText("");
                onChangeTitleText("");
                // setImage(null);
            })
        }
    };

    return (
        <>
            {/* The header of the feed, to create posts from current user */}
            <View style={styles.container}>
                <View style={styles.TopElements}>
                    <Image
                        source={{ uri: image ? image : 'https://palmbayprep.org/wp-content/uploads/2015/09/user-icon-placeholder.png' }}
                        style={styles.imageIcon}
                    />
                    <View style={styles.inputs}>
                        <TextInput
                            style={styles.titleInput}
                            placeholder="Title..."
                            clearTextOnFocus={true}
                            multiline
                            numberOfLines={2}
                            maxLength={80}
                            textBreakStrategy='balanced'
                            onChangeText={onChangeTitleText}
                            value={titleText}
                        />
                        <TextInput
                            style={styles.textInput}
                            placeholder="What's your thought?"
                            clearTextOnFocus={true}
                            multiline
                            numberOfLines={2}
                            maxLength={80}
                            textBreakStrategy='balanced'
                            onChangeText={onChangeText}
                            value={text}
                        />
                        {/* <View style={styles.photoPicker}>
                            <TouchableHighlight underlayColor="green">
                                <View>
                                    <Feather name="camera" size={20} color="black" />
                                </View>
                            </TouchableHighlight>
                        </View> */}
                        <View style={styles.button}>
                            <TouchableHighlight onPress={_onPressButton} underlayColor="white">
                                <Feather name="send" size={20} color="rgb(110,110,110)" />
                            </TouchableHighlight>
                        </View>
                    </View>
                </View>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 15,
        marginTop: -25
    },
    TopElements: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 15,
        paddingBottom: 15,
        marginTop: 20,
        borderBottomColor: 'grey',
        borderBottomWidth: 2,
        width: '100%'
    },
    textInput: {
        fontSize: 15,
        width: 330,
        color: 'black',
    },
    inputs: {
        flexDirection: 'column',
    },
    photoPicker: {
        marginTop: 5,
        alignItems: 'flex-start',
    },
    imageIcon: {
        marginLeft: 5,
        marginRight: 5,
        width: 30,
        height: 30,
        borderRadius: 40,
    },
    button: {
        alignItems: 'flex-end'
    }
});