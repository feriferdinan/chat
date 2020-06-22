import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { MainStackNavigator, AuthStackNavigator } from './navigators'
import { SplashScreen } from './components/screens';
import { AuthContext, UserContext, ThemeContext } from './contexts'

import { lightTheme } from './theme/light'
import { darkTheme } from './theme/dark'

import { useAuth } from './hooks/useAuth'

const RootStack = createStackNavigator();

export default function () {
    const { auth, state } = useAuth();
    const [isDarkMode, setIsDarkMode] = React.useState(false);
    const switchTheme = React.useCallback(() => {
        setIsDarkMode(!isDarkMode);
    }, [isDarkMode]);

    function renderScreens() {
        if (state.loading) {
            return <RootStack.Screen name={'Splash'} component={SplashScreen} />;
        }
        return state.user ? (
            <RootStack.Screen name={'MainStack'}>
                {() => (
                    <UserContext.Provider value={state.user}>
                        <MainStackNavigator />
                    </UserContext.Provider>
                )}
            </RootStack.Screen>
        ) : (
                <RootStack.Screen name={'AuthStack'} component={AuthStackNavigator} />
            );
    }

    return (
        <ThemeContext.Provider value={switchTheme}>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
            <AuthContext.Provider value={auth}>
                <NavigationContainer theme={isDarkMode ? darkTheme : lightTheme}>
                    <RootStack.Navigator
                        screenOptions={{
                            headerShown: false,
                            animationEnabled: false,
                        }}>
                        {renderScreens()}
                    </RootStack.Navigator>
                </NavigationContainer>
            </AuthContext.Provider>
        </ThemeContext.Provider>
    );
}