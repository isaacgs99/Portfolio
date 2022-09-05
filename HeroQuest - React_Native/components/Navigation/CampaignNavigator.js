import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Campaigns from '../../screens/Campaign/Campaigns';
import NewCampaign from '../../screens/Campaign/NewCampaign';
import CampaignInfo from '../../screens/Campaign/CampaignInfo';

const CampaignStack = createStackNavigator();

export default function CampaignNavigator() {
    return(
        <CampaignStack.Navigator
            initialRouteName='Campaigns'
            screenOptions={{
                animationEnabled: false,
                gestureEnabled: true,
            }}
            mode={'card'}
            detachInactiveScreens={true}
        >
            <CampaignStack.Screen name='Campaigns' component={Campaigns} options={{ title: 'Campaigns', headerShown: false }} />
            <CampaignStack.Screen name='NewCampaign' component={NewCampaign} options={{ title: 'New Campaign', headerShown: false, animationEnabled: true }} />
            <CampaignStack.Screen name='CampaignInfo' component={CampaignInfo} options={{ title: 'Campaign Info', headerShown: false, animationEnabled: true }} />
        </CampaignStack.Navigator>
    );
};