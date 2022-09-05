import React, { useState, useEffect } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

import { AntDesign } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';

import firebase from '../../database/firebase';

import Loading from '../Loading';

export default function Campaigns({ navigation: { navigate } }) {
    const [userCampaignIds, updateUserCampaignIds] = useState([]);
    const [userCampaigns, updateUserCampaigns] = useState([]);

    const [isLoading, setIsLoading] = useState(true);

    useEffect(function getUserCampaignIds() { 
        const campaignsRef = firebase.database().ref(`/users/${firebase.auth().currentUser.uid}/campaigns`); 
        
        const unsubscribe = campaignsRef.on('value', snapshot => {
            const campaignIds = snapshot.val();
            if (!campaignIds) return setIsLoading(false);
            
            firebase.database().ref('/campaigns').get()
                .then(snapshot => {
                    const allCampaigns = snapshot.val();
                    const campaigns = campaignIds.map(id => {
                        return { id, ...allCampaigns[id] }
                    });
                    
                    updateUserCampaignIds(campaignIds);
                    updateUserCampaigns(campaigns);
                    setIsLoading(false);
                })
                .catch(e => console.error('Error Retrieving User Campaigns: ', e));
        });

        return () => campaignsRef.off('value', unsubscribe);
    }, []);
    
    return(
        <>
            { isLoading ? <Loading color='white' /> :
                <View style={styles.container}>
                    <Pressable
                        style={styles.newButton}
                        onPress={() => navigate('NewCampaign', { userCampaignIds } )}
                    >
                        <AntDesign name="plus" size={24} color="#00000088" style={styles.buttonIcon} />
                        <Text style={styles.newButtonText}>Add a new campaign</Text>
                    </Pressable>
                    <FlatList
                        style={styles.flatList}
                        data={userCampaigns}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) => (
                            <Pressable 
                                key={index}
                                style={styles.button}
                                onPress={() => navigate('CampaignInfo', { campaign: item } )}
                            >
                                { !item.info.photo ? <FontAwesome5 name="dragon" size={24} color="#00000088" style={styles.buttonIcon} />
                                    : <Image style={{ ...styles.buttonIcon, ...styles.buttonImg }} source={{ uri: item.info.photo }} /> }
                                <Text style={styles.buttonText}>{item.info.name}</Text>
                            </Pressable>
                        )}
                    />
                </View>
            }
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 30,
        alignItems: 'center'
    },
    newButton: {
        width: '90%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#E0E0E0',
        padding: 15,
        borderRadius: 10,
        position: 'relative'
    },
    newButtonText: {
        fontSize: 16,
        color: '#00000088'
    },
    buttonIcon: {
        position: 'absolute',
        left: 15
    },
    flatList: {
        width: '90%',
        marginTop: 40,
        marginBottom: 60
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#E0E0E0',
        padding: 15,
        borderRadius: 10,
        position: 'relative',
        marginBottom: 20
    },
    buttonImg: {
        width: 35,
        height: 35,
        borderRadius: 50
    },
    buttonText: {
        fontSize: 18
    }
});