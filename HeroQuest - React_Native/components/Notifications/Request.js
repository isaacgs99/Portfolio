import React, { useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
} from "react-native";

import { Feather } from "@expo/vector-icons";

import firebase from '../../database/firebase';
import { _sendRequest } from "../../screens/Notifications";

export const Request = (props) => {

    const [data, setData] = useState(props.data);

    const _onPressButtonDel = () => {
        const senderCopy = data.userId;

        firebase.database().ref(`/users/${senderCopy}/notifications`).push(_sendRequest(false, 0))
        firebase.database().ref(`/users/${firebase.auth().currentUser.uid}/notifications/${data.id}`).remove()


        firebase.database().ref(`/users/${firebase.auth().currentUser.uid}/notifications`).get()
            .then(snapshot => {
                const notifications = snapshot.val()
                firebase.database().ref(`/users/${firebase.auth().currentUser.uid}/notifications`).remove()
                    .then(firebase.database().ref(`/users/${firebase.auth().currentUser.uid}/notifications`).set(notifications))
            })
    };

    const _onPressButtonAcc = () => {
        const senderUser = data.userId;
        const senderCampaign = data.campaignId;

        const currentUserRef = firebase.database().ref(`/users/${firebase.auth().currentUser.uid}`);
        
        firebase.database().ref(`/users/${senderUser}/notifications`).push(_sendRequest(true, 0));
        currentUserRef.child(`/notifications/${data.id}`).remove();

        currentUserRef.child('/campaigns').get()
            .then(snapshot => {
                const campaignIds = snapshot.val();
                const tmpCampaigns = campaignIds ? campaignIds : [];
                tmpCampaigns.push(senderCampaign);
                currentUserRef.child('/campaigns').set(tmpCampaigns);

                const campaignUsersRef = firebase.database().ref(`/campaigns/${senderCampaign}/users`);
                campaignUsersRef.get().then(snapshot => {
                    const campaignUsers = snapshot.val();
                    campaignUsers.push(firebase.auth().currentUser.uid);
                    campaignUsersRef.set(campaignUsers);
                }).catch(e => console.error('Error appending user to campaign: ', e));
            })
            .catch(e => console.error('Error appending new campaign: ', e));

        currentUserRef.child(`/notifications`).get()
            .then(snapshot => {
                const notifications = snapshot.val()
                firebase.database().ref(`/users/${firebase.auth().currentUser.uid}/notifications`).remove()
                    .then(firebase.database().ref(`/users/${firebase.auth().currentUser.uid}/notifications`).set(notifications))
            })
    }

    return (
        <>
            <View>
                <View style={styles.notification}>
                    <Text style={{ fontWeight: 'bold' }}>
                        {data.username}
                        {`\nsent you a request to join ${data.campaignName}!`}

                    </Text>
                    <View style={styles.icons}>
                        <TouchableHighlight onPress={_onPressButtonDel} underlayColor="white">
                            <Feather name="x" size={20} color="rgb(110,110,110)" />
                        </TouchableHighlight>
                        <TouchableHighlight onPress={_onPressButtonAcc} underlayColor="white">
                            <Feather name="check" size={20} color="rgb(110,110,110)" />
                        </TouchableHighlight>
                    </View>
                </View>
            </View>
        </>
    )
};
const styles = StyleSheet.create({
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
    icons: {
        flexDirection: "column"
    }
})