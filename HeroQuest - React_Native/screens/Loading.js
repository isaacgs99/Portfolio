import React from 'react';
import { ActivityIndicator, StatusBar, StyleSheet, View, Image } from 'react-native';

const logo = require('../assets/images/heroQuestLogo.png');

export default function Loading({ color }) {

    const bgColor = color === 'white' ? '#fff' : '#3c70b0'

    return (
        <View style={{...styles.container, backgroundColor: bgColor}} >
            <StatusBar hidden={true} />
            <Image source={logo} style={styles.logo} />
            <ActivityIndicator style={styles.loadingIndicator} size='large' color='#114277' />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#3c70b0'
    },
    logo: {
        flex: 1,
        width: 300,
        height: 300,
        resizeMode: 'contain',
        marginHorizontal: 30
    },
    loadingIndicator: {
        flex: 1,
        justifyContent: 'flex-start'
    }
})