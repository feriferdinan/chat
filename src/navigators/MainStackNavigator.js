import React from 'react';
import { View, Text } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Ionicons from 'react-native-vector-icons/Ionicons';
import IconFoundation from 'react-native-vector-icons/Foundation';
import IconAnt from 'react-native-vector-icons/AntDesign';
import IconFA5 from 'react-native-vector-icons/FontAwesome5';
import IconFA from 'react-native-vector-icons/FontAwesome';
import IconMCI from 'react-native-vector-icons/MaterialCommunityIcons';
import IconE from 'react-native-vector-icons/Entypo';

const MainStack = createStackNavigator();
const Tab = createBottomTabNavigator();

import { HomeScreen, ChatScreen, SettingScreen, ContactListScreen } from '../screens';
import config from '../config'


function MainTab() {
    return (
        <Tab.Navigator
            initialRouteName="Chat"
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    size = 30;
                    switch (route.name) {
                        case 'Chat':
                            return <Ionicons name="ios-chatboxes" size={size} color={color} />;
                        case 'Setting':
                            return <Ionicons name="ios-settings" size={size} color={color} />;
                        case 'Contact':
                            size = 32
                            return <Ionicons name="md-contact" size={size} color={color} />;

                    }
                },
            })}
            tabBarOptions={{
                activeTintColor: config.BASE_COLOR,
                inactiveTintColor: 'gray',
            }}>
            <Tab.Screen name="Contact" component={ContactListScreen} />
            <Tab.Screen name="Chat" component={HomeScreen} />
            <Tab.Screen name="Setting" component={SettingScreen} />
        </Tab.Navigator >
    );
}
export default function MainStackNavigator() {
    return (
        <MainStack.Navigator>
            <MainStack.Screen
                name="MainTab"
                component={MainTab}
                options={{ headerShown: false }}
            />
            <MainStack.Screen
                name="ChatScreen"
                component={ChatScreen}
                options={{ headerShown: true }}
            />
        </MainStack.Navigator>
    );
}