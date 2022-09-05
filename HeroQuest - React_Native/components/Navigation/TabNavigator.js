import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text } from 'react-native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

import firebase from '../../database/firebase';

import { FontAwesome } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import TopNav from './TopNav';
import Feed from '../../screens/Feed';
import UserProfile from '../../screens/User/UserProfile';
import Loading from '../../screens/Loading';
import Notifications from '../../screens/Notifications';
import faq from '../../screens/faq';

import CampaignNavigator from './CampaignNavigator';

const Tab = createMaterialBottomTabNavigator();

export default function TabNavigation() {

    const [user, updateUser] = useState({});
    const [isLoading, updateLoadingStatus] = useState(true);

    useEffect(_ => {
        if (!firebase.auth().currentUser) return;
        const userRef = firebase.database().ref(`/users/${firebase.auth().currentUser.uid}`);
        userRef.get().then(snapshot => {
            if (snapshot.val() === null) {
                const authUser = firebase.auth().currentUser;

                const user = {
                    uid: authUser.uid,
                    username: authUser.displayName || authUser.email.split('@')[0],
                    email: authUser.email,
                    photo: authUser.photoURL || 'https://palmbayprep.org/wp-content/uploads/2015/09/user-icon-placeholder.png'
                };

                if (!authUser.displayName) authUser.updateProfile({ displayName: user.username }).catch(e => console.error('Error: ', e));

                userRef.set(user).then(_ => {
                    updateUser(user);
                    updateLoadingStatus(false);
                })
                    .catch(e => console.error('User Creation Error: ', e));
            } else {
                const userSnap = snapshot.val();
                updateUser(userSnap);
                updateLoadingStatus(false);
            }
        })
        .catch(error => console.error(error));
    }, []);

    return (
        <>
            {
                isLoading ? <Loading /> :
            <>
                <TopNav />
                <Tab.Navigator
                    initialRouteName='Feed'
                    labeled={false}
                    activeColor='#fff'
                    barStyle={styles.bottomNav}
                >
                    <Tab.Screen 
                        name='Feed'
                        component={Feed}
                        options={{
                            tabBarIcon: ({ color }) => (
                                <FontAwesome name="feed" size={24} color={color} />
                            )
                        }}
                    />
                    <Tab.Screen
                        name='Notifications'
                        component={Notifications}
                        options={{
                            tabBarIcon: ({ color }) => (
                                <MaterialCommunityIcons name="bell" size={24} color={color} />
                            )
                        }}
                    />
                    <Tab.Screen
                        name='CampaignNavigator'
                        component={CampaignNavigator}
                        options={{
                            tabBarIcon: ({ color }) => (
                                <FontAwesome5 name="dice-d20" size={24} color={color} />
                            )
                        }}
                    />
                    <Tab.Screen
                        name='faq'
                        component={faq}
                        options={{
                            tabBarIcon: ({ color }) => (
                                <MaterialCommunityIcons name="frequently-asked-questions" size={24} color={color} />
                            )
                        }}
                    />
                    <Tab.Screen
                        name='UserProfile'
                        component={UserProfile}
                        options={{
                            tabBarIcon: ({ color }) => (
                                <Image
                                    source={{ uri: user.photo ? user.photo : 'https://palmbayprep.org/wp-content/uploads/2015/09/user-icon-placeholder.png' }}
                                    style={{...styles.imageIcon, backgroundColor: color}}
                                />
                            )
                        }}
                    />
                </Tab.Navigator>
            </>
        }
    </>
    )
};

const styles = StyleSheet.create({
    bottomNav: {
        backgroundColor: '#2d578a',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 1,
        shadowRadius: 3,
    },
    imageIcon: {
        marginLeft: 5,
        marginRight: 5,
        width: 30,
        height: 30,
        borderRadius: 40,
        backgroundColor: '#96ABC5'
    },
});