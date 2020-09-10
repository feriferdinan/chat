import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { LoginScreen, RegisterScreen, ForgotPasswordScreen } from '../screens';
import config from '../config'

const AuthStack = createStackNavigator();
const LoginStack = createStackNavigator();

export default function AuthStackNavigator() {
    return (
        <AuthStack.Navigator
            mode={'modal'}
            screenOptions={{
                // headerShown: false,
            }}
        >
            <AuthStack.Screen name={'LoginStack'}
                options={{
                    headerShown: null,
                    headerStyle: {
                        backgroundColor: "red",
                        elevation: 0, // remove shadow on Android
                        shadowOpacity: 0 // remove shadow on iOS
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                }}
            >
                {() => (
                    <LoginStack.Navigator mode={'card'} >
                        <LoginStack.Screen name={'Login'} component={LoginScreen} />
                    </LoginStack.Navigator>
                )}
            </AuthStack.Screen>
            <AuthStack.Screen name={'RegisterScreen'} component={RegisterScreen}
                options={{
                    headerShown: true,
                    title: "",
                    headerStyle: {
                        backgroundColor: "#fff",
                        elevation: 0, // remove shadow on Android
                        shadowOpacity: 0 // remove shadow on iOS
                    },
                    headerTintColor: config.BASE_COLOR
                }} />
            <AuthStack.Screen name={'ForgotPasswordScreen'} component={ForgotPasswordScreen}
                options={{
                    headerShown: true,
                    title: "",
                    headerStyle: {
                        backgroundColor: "#fff",
                        elevation: 0, // remove shadow on Android
                        shadowOpacity: 0 // remove shadow on iOS
                    },
                    headerTintColor: config.BASE_COLOR
                }} />
        </AuthStack.Navigator>
    );
}