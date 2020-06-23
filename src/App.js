import 'react-native-gesture-handler';
import React, { useState } from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { MainStackNavigator, AuthStackNavigator } from './navigators'
import { SplashScreen } from './components/screens';
import { AuthContext, UserContext, ThemeContext } from './contexts'

import { lightTheme } from './theme/light'
import { darkTheme } from './theme/dark'

// import { useAuth } from './hooks/useAuth'
import { connect } from 'react-redux'

const RootStack = createStackNavigator();

function App({ loginData }) {
    // const { auth, state } = useAuth();
    const [load, setLoad] = React.useState(true);
    const [isDarkMode, setIsDarkMode] = React.useState(false);
    const switchTheme = React.useCallback(() => {
        setIsDarkMode(!isDarkMode);
    }, [isDarkMode]);
    React.useEffect(() => {
        if (loginData) {
            setTimeout(() => {
                setLoad(false)
            });
        }
    }, []);
    function renderScreens() {
        if (load) {
            return <RootStack.Screen name={'Splash'} component={SplashScreen} />;
        }
        return loginData.isLogin ? (
            <RootStack.Screen name={'MainStack'} component={MainStackNavigator}>
                {/* {() => (
                    // <UserContext.Provider value={state.user}>
                            <MainStackNavigator />
                    //  </UserContext.Provider>
                )} */}
            </RootStack.Screen>
        ) : (
                <RootStack.Screen name={'AuthStack'} component={AuthStackNavigator} />
            );
    }

    return (
        <ThemeContext.Provider value={switchTheme}>
            {/* <AuthContext.Provider value={auth}> */}
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
            {/* </AuthContext.Provider> */}
        </ThemeContext.Provider>
    );
}

const mapStateToProps = (state) => {
    return {
        loginData: state.authReducer,
    };
};


// Exports
export default connect(mapStateToProps, null)(App);