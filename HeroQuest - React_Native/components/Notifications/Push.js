import React, { useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
} from "react-native";

import { Feather } from "@expo/vector-icons";

import firebase from '../../database/firebase';

export const Push = (props) => {

    const [data, setData] = useState(props.data);

    const _onPressButton = () => {
        firebase.database().ref(`/users/${firebase.auth().currentUser.uid}/notifications/${data.id}`).remove()

        firebase.database().ref(`/users/${firebase.auth().currentUser.uid}/notifications`).get()
            .then(snapshot => {
                const notifications = snapshot.val()
                firebase.database().ref(`/users/${firebase.auth().currentUser.uid}/notifications`).remove()
                    .then(firebase.database().ref(`/users/${firebase.auth().currentUser.uid}/notifications`).set(notifications))

            })

    };

    return (
        <>

            <View style={styles.listContainer}>
                <View style={styles.notification}>
                    <Text style={{ fontWeight: 'bold' }}>
                        {data.username}
                        {data.request ? " accepted you request! " : " denied you request! "}
                    </Text>
                    <TouchableHighlight onPress={_onPressButton} underlayColor="white">
                        <Feather name="x" size={20} color="rgb(110,110,110)" />
                    </TouchableHighlight>
                </View>
            </View>
        </>
    )
};
const styles = StyleSheet.create({
    listContainer: {
        marginBottom: 10
    },
    notification: {
        borderColor: "black",
        backgroundColor: "#fffffb",
        padding: 10,
        margin: 10,
        borderWidth: 0,
        borderRadius: 5,
        shadowColor: 'gray',
        shadowOpacity: 0.1,
        justifyContent: 'space-between',
        flexDirection: 'row'
    },
})