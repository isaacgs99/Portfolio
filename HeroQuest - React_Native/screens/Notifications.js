import React, { useState } from "react";
import { FlatList, View, Text, StyleSheet } from "react-native";

import firebase from '../database/firebase';

import { useEffect } from "react";

import Loading from "../screens/Loading";
import { Push } from '../components/Notifications/Push';
import { Request } from "../components/Notifications/Request";


export default function Notifications() {

    const [notifications, updateNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    /**
    * Use Effect method for the posts in FB.
    * @return {(Object|Array)} returns an array of objects in the feed state 
    */
    useEffect(() => {
        const user = firebase.auth().currentUser.uid;
        const OnLoadingListener = firebase.database().ref(`/users/${user}/notifications`).on('value', snapshot => {
            setIsLoading(true);
            const notificationsFire = snapshot.val();
            if (notificationsFire) {
                updateNotifications([]);
                var objects = [];
                snapshot.forEach(function (childSnapshot) {
                    const object = childSnapshot.val();
                    object.id = childSnapshot.key;
                    objects.push(object);
                    updateNotifications(notif => [...notif, object]);
                });
            } else {
                updateNotifications([]);
            }
            setIsLoading(false);

        });

        return () => {
            firebase.database().ref(`/users/${user}/notifications`).off('value', OnLoadingListener)
        };
    }, []);

    return (
        <>
            { isLoading ? <Loading color={'white'} /> :
                <View>
                    <View style={styles.list}>
                        {
                            notifications.length ?
                                <FlatList
                                    data={notifications}
                                    style={styles.list}
                                    keyExtractor={(item, index) => index.toString()}
                                    contentContainerStyle={{ flexDirection: 'column-reverse' }}
                                    renderItem={({ item, index }) => (
                                        item.type === 0 ?
                                            <View>
                                                <Push data={item} />
                                            </View>
                                            : <Request data={item} />

                                    )}
                                />

                                : <Text> No Notifications... </Text>
                        }
                    </View>
                </View>
            }
        </>
    );
};

const styles = StyleSheet.create({
    list: {
        marginBottom: 10
    }
})

/**
 * Creates a notification request object.
 * @param {Boolean} request - If user has accepted/rejected the request notification 
 * @param {Number} type - Notification type 0: Push Notification, 1: Request Notification
 * @param {String} campaignId - Campaign Id
 * @param {String} campaignName - Campaign Name
 * @returns 
 */
export const _sendRequest = (request, type, campaignId, campaignName) => {
    return { 
        request, 
        type, 
        campaignId: campaignId || '',
        campaignName: campaignName || '',
        userId: firebase.auth().currentUser.uid, 
        username: firebase.auth().currentUser.displayName
    };
};