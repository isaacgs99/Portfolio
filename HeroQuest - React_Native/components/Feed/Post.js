import React, { useState, useEffect } from "react";
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableHighlight,
    Modal,
    TextInput,
    FlatList
} from "react-native";

import { Feather, Entypo } from "@expo/vector-icons";

import firebase from '../../database/firebase';

export const Post = (props) => {

    const [data, setData] = useState(props.data);

    const [image, setImage] = useState(props.data.user_photo);

    const [username, setUsername] = useState(props.data.username);

    const [like, setLike] = useState(false);

    const [likeNum, setLikeNum] = useState(props.data.like_number);

    const [modalVisible, setModalVisible] = useState(false);

    const [text, onChangeText] = useState("");

    const [comments, setComments] = useState([]);

    const [commentsNum, setCommentsNum] = useState(0);

    const [likedPosts, setLikedPosts] = useState([]);


    /**
    * Creates new comments for each post
    */
    const _sendData = () => {
        let commentsArr = comments;
        if (text.length >= 1) {
            let newComment =
            {

                "userId": firebase.auth().currentUser.uid,
                "username": firebase.auth().currentUser.displayName,
                "comment": text
            };

            commentsArr.push(newComment)
            firebase.database().ref(`/posts/${data.id}/comment_list`).set(commentsArr, () => {
                onChangeText("");
            })
        }
    };

    /**
    * Updates the number of likes and updates the user that liked the post
    * 
    */
    const _onPressButton = () => {
        const dataCopy = data;
        let likePostsCopy = likedPosts;
        let likeCopy = !like;

        // Sets the new state of the like icon
        setLike(likeCopy);

        let object = firebase.auth().currentUser.uid;

        if (likeCopy) {
            dataCopy.like_number += 1;
            likePostsCopy.push(object);
        } else {
            dataCopy.like_number -= 1;

            // It filters out the user that disliked the post
            const arrLikedPostsCopy = likePostsCopy.filter(element => element !== object)
            likePostsCopy = arrLikedPostsCopy;
        }

        setLikedPosts(likePostsCopy);

        setData(dataCopy);
        setLikeNum(data.like_number);

        firebase.database().ref(`posts/${data.id}/likedPosts`).set(likePostsCopy)
        firebase.database().ref(`posts/${data.id}/like_number`).set(data.like_number);
    };

    /**
    * Use Effect method for the likes and comments of a post
    * @return {boolean} returns a boolean in the like state
    * @return {(Object|Array)} returns an array of objects in the comments state 
    */
    useEffect(() => {

        firebase.database().ref(`posts/${data.id}/likedPosts`).get()
            .then(snapshot => {
                const likedPostsFire = snapshot.val();
                let likedPostCopy = likedPostsFire;

                if (likedPostCopy === null) {
                    setLike(false);

                } else {
                    // Checks if current user liked the post before to set it true or false
                    setLikedPosts(likedPostCopy);
                    const hasMatch = likedPostCopy.filter(val => val === firebase.auth().currentUser.uid).length > 0;

                    if (hasMatch === null || hasMatch === false) {
                        setLike(hasMatch);
                    } else {
                        setLike(hasMatch);
                    }

                }

            })

        const OnLoadingListener = firebase.database().ref(`/posts/${data.id}/comment_list`).on('value', snapshot => {
            const commentsFire = snapshot.val();
            if (commentsFire) {
                setComments(commentsFire);
                // console.log(Object.keys(commentsFire));
                setCommentsNum(Object.keys(commentsFire).length);
                // console.log(commentsNum);
            } else {
                setComments([]);
            }
        });

        const imageListener = firebase.database().ref(`/users/${data.userId}/photo`).on('value', snapshot => {
            const imageFire = snapshot.val();
            let imageCopy = imageFire;
            firebase.database().ref(`/posts/${data.id}/user_photo`).set(imageFire);
            setImage(imageCopy)
        });

        const usernameListener = firebase.database().ref(`/users/${data.userId}/username`).on('value', snapshot => {
            const usernameFire = snapshot.val();
            let usernameCopy = usernameFire;
            firebase.database().ref(`/posts/${data.id}/username`).set(usernameCopy);
            setUsername(usernameCopy)
        });
        return () => {
            firebase.database().ref(`/posts/${data.id}/comment_list`).off('value', OnLoadingListener)
            firebase.database().ref(`/user/${data.id}/photo`).off('value', imageListener)
            firebase.database().ref(`/user/${data.id}/username`).off('value', usernameListener)
        };
    }, []);

    return (
        <>
            {/*  Modal for comments in a post */}
            {

                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={modalVisible}
                    onRequestClose={() => {
                        setModalVisible(!modalVisible);
                    }}
                >
                    <View style={styles.containerModal}>
                        <View style={styles.card}>
                            <View style={styles.headerContainer}>
                                <Image source={{ uri: image ? image : 'https://palmbayprep.org/wp-content/uploads/2015/09/user-icon-placeholder.png' }} style={styles.imageIcon} />
                                <Text style={styles.text}>{username}</Text>
                            </View>
                            <Text style={styles.titleText}>{data.title}</Text>
                            <Text style={styles.descriptionText}>{data.description}</Text>
                            <View style={styles.imageReactionContainer}>
                                <TouchableHighlight onPress={_onPressButton} underlayColor="white">
                                    <View style={styles.likeContainer}>
                                        {like ? (
                                            <Entypo name="thumbs-up" size={20} color="blue" />
                                        ) : (
                                            <Entypo name="thumbs-up" size={20} color="rgb(110,110,110)" />

                                        )}
                                        <Text style={styles.text}>{data.like_number}</Text>
                                    </View>
                                </TouchableHighlight>
                                <View style={styles.commentContainer}>
                                    <Feather name="message-circle" size={20} color="rgb(110,110,110)" onPress={() => setModalVisible(!modalVisible)} />
                                    <Text style={styles.text}> {commentsNum} </Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.listContainer}>
                            <FlatList
                                data={comments}
                                style={styles.list}
                                contentContainerStyle={{ flexDirection: 'column-reverse' }}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item, index }) => (
                                    <View style={styles.comment}>
                                        <Text>
                                            <Text key={{ index }} style={{ fontWeight: 'bold' }}>
                                                {item.username}{"\n"}
                                            </Text>
                                            {item.comment}
                                        </Text>
                                    </View>


                                )}
                            />
                        </View>
                        <View style={styles.commentPostContainer}>
                            <TextInput
                                style={styles.textInput}
                                placeholder="Comment..."
                                clearTextOnFocus={true}
                                multiline
                                numberOfLines={2}
                                maxLength={80}
                                textBreakStrategy='balanced'
                                onChangeText={onChangeText}
                                value={text}
                            />
                            <View style={styles.button}>
                                <TouchableHighlight onPress={() => _sendData()} underlayColor="white">
                                    <Feather name="send" size={20} color="rgb(110,110,110)" />
                                </TouchableHighlight>
                            </View>
                        </View>
                    </View>
                </Modal>
            }
            {/* Represents an individual post with a like button and comment button */}
            <View style={styles.card}>
                <View style={styles.headerContainer}>
                    <Image source={{ uri: image ? image : 'https://palmbayprep.org/wp-content/uploads/2015/09/user-icon-placeholder.png' }} style={styles.imageIcon} />
                    <Text style={styles.text}>{username}</Text>
                </View>
                <Text style={styles.titleText}>{data.title}</Text>
                {/* <View style={styles.headerContainer}>
                    {data.user_photo ? (
                        <Image source={{ uri: data.user_photo }} style={styles.postIcon} />
                    ) : (

                        <View></View>
                    )}
                </View> */}
                <Text style={styles.descriptionText}>{data.description}</Text>
                <View style={styles.imageReactionContainer}>
                    <TouchableHighlight onPress={_onPressButton} underlayColor="white">
                        <View style={styles.likeContainer}>
                            {like ? (
                                <Entypo name="thumbs-up" size={20} color="blue" />
                            ) : (
                                <Entypo name="thumbs-up" size={20} color="rgb(110,110,110)" />
                            )}
                            <Text style={styles.text}>{data.like_number}</Text>
                        </View>
                    </TouchableHighlight>
                    <View style={styles.commentContainer}>
                        <Feather name="message-circle" size={20} color="rgb(110,110,110)" onPress={() => setModalVisible(!modalVisible)} />
                        <Text style={styles.text}>{commentsNum}</Text>
                    </View>
                </View>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    containerModal: {
        flex: 1,
        paddingTop: 15,
        paddingBottom: 15,
        paddingTop: 20,
        backgroundColor: '#3D70B0',
        alignItems: 'center'
    },
    comment: {
        borderColor: "black",
        backgroundColor: "#fffffb",
        padding: 10,
        margin: 10,
        borderWidth: 0,
        borderRadius: 5,
        shadowOffset: { width: 10, height: 10, },
        shadowColor: 'gray',
        shadowOpacity: 0.3,
    },
    commentPostContainer: {
        width: '90%',
        flexDirection: 'row',
        bottom: 50,
        borderWidth: 1,
        borderRadius: 10,
        backgroundColor: 'white',
        // padding: 2

    },
    listContainer: {
        flex: 1,
        marginBottom: 90,
        width: '90%'
    },
    card: {
        borderColor: "black",
        backgroundColor: "#ffffff",
        padding: 20,
        margin: 20,
        borderWidth: 0,
        borderRadius: 10,
        width: '90%'
    },
    headerContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 10,
    },
    text: {
        fontFamily: "sans-serif-light",
        fontSize: 20,
        color: "black",
    },
    titleText: {
        fontSize: 21,
        fontWeight: "bold",
        margin: 8,
    },
    descriptionText: {
        margin: 8,
    },
    textInput: {
        fontSize: 15,
        width: 330,
        color: 'black',
        padding: 2
    },
    imageIcon: {
        marginTop: 5,
        marginLeft: 16,
        marginRight: 16,
        width: 30,
        height: 30,
        borderRadius: 40,
        borderWidth: 1,
    },
    postIcon: {
        marginTop: 5,
        marginLeft: 100,
        width: 100,
        height: 100,
    },
    imageReactionContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
    },
    likeContainer: {
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 10,
    },
    commentContainer: {
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 10
    },
    imageReaction: {
        marginLeft: 16,
        width: 30,
        height: 30,
    },
    container: {
        flex: 1,
        justifyContent: "center",
    },
    text: {
        fontSize: 16,
    },
    wrapperCustom: {
        borderRadius: 8,
        padding: 6,
    },
    logBox: {
        padding: 20,
        margin: 10,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: "#f0f0f0",
        backgroundColor: "#f9f9f9",
    },
    button: {
        borderRadius: 20,
        padding: 10,
        backgroundColor: '#cbcbcb',
        position: 'absolute',
        right: 10,
    },
    buttonOpen: {
        backgroundColor: "#F194FF",
    },
    buttonClose: {
        backgroundColor: "#2196F3",
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
    },
});
