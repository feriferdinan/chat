import 'react-native-gesture-handler';
import React, { useState, useCallback, useEffect } from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { MainStackNavigator, AuthStackNavigator } from './navigators'
import { SplashScreen } from './components/screens';
import { ThemeContext } from './contexts'

import { lightTheme } from './theme/light'
import { darkTheme } from './theme/dark'

import { connect } from 'react-redux'

const RootStack = createStackNavigator();

function App({ userData }) {
    const [load, setLoad] = useState(true);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const switchTheme = useCallback(() => {
        setIsDarkMode(!isDarkMode);
    }, [isDarkMode]);


    useEffect(() => {
        if (userData) {
            setTimeout(() => {
                setLoad(false)
            }, 100);
        }
    }, []);


    function renderScreens() {
        if (load) return <RootStack.Screen name={'Splash'} component={SplashScreen} />;

        return userData.isLogin ? (
            <RootStack.Screen name={'MainStack'} component={MainStackNavigator} />
        ) : (<RootStack.Screen name={'AuthStack'} component={AuthStackNavigator} />);
    }

    return (
        <ThemeContext.Provider value={switchTheme}>
            <NavigationContainer theme={isDarkMode ? darkTheme : lightTheme}>
                <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
                <RootStack.Navigator
                    screenOptions={{
                        headerShown: false,
                        animationEnabled: false,
                    }}>
                    {renderScreens()}
                </RootStack.Navigator>
            </NavigationContainer>
        </ThemeContext.Provider>
    );
}

const mapStateToProps = (state) => {
    return {
        userData: state.userReducer,
    };
};

export default connect(mapStateToProps, null)(App);