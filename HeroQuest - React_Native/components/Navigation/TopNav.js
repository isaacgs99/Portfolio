import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

const logo = require('../../assets/images/heroQuestLogo.png');

export default function TopNav() {
    return(
        <View style={headerStyles.headerWrapper}>
            <View style={headerStyles.headerContainer}>
                <View style={headerStyles.header}>
                    <Image source={logo} style={headerStyles.logo} />
                </View>
            </View>
        </View>
    )
};

const headerStyles = StyleSheet.create({
    headerWrapper: {
        zIndex: 100,
        position: 'relative',
        top: 0,
        left: 0,
        width: '100%',
        overflow: 'hidden',
        paddingBottom: 5
    },
    headerContainer: {
        height: 100,
        backgroundColor: '#2d578a',
        shadowColor: '#000',
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.4,
        shadowRadius: 3,
        elevation: 5,
    },
    header: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 30,
        justifyContent: 'center',
    },
    logo: {
        width: 120,
        height: 120,
        resizeMode: 'contain',
        // marginLeft: 69
    },
    sidebar: {
        marginLeft: 20
    }
});