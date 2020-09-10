import React, { useState, useEffect } from 'react';
// import component
import { TouchableOpacity, StyleSheet, Text, View, StatusBar, Linking, Keyboard } from 'react-native';
import Background from '../components/Background';
import Logo from '../components/Logo';
import Button from '../components/Button';
import TextInput from '../components/TextInput';
import Title from '../components/Title';
// import utils
import { theme } from '../utils/theme';
import { createAction } from '../utils/createAction'
import { emailValidator, passwordValidator } from '../utils/validators';
import Axios from '../utils/Axios'

// import dependencies
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage'
// import { showMessage } from 'react-native-flash-message';



const LoginScreen = ({ navigation, setUser }) => {

    const [email, setEmail] = useState({ value: '', error: '' });
    const [password, setPassword] = useState({ value: '', error: '' });
    const [isLoading, setLoading] = useState(false);
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);

    const _onLoginPressed = () => {
        const emailError = emailValidator(email.value);
        const passwordError = passwordValidator(password.value);

        if (emailError || passwordError) {
            setEmail({ ...email, error: emailError });
            setPassword({ ...password, error: passwordError });
            return;
        }
        setLoading(true)
        Axios.post(`auth/login`, {
            email: email.value,
            password: password.value
        }).then(async res => {
            setLoading(false)
            await AsyncStorage.setItem("token", res.data.token)
            setUser(res.data.data)
        }).catch(err => {
            setLoading(false)
            if (err.response?.status <= 404) {
                Toast(err.response.data.message);
            } else {
                Toast(err.message);
            }
        })


    };


    return (
        // <View style={{ flex: 1 }}>
        <Background>

            <Title>CHAT YUK</Title>

            <TextInput
                label="Email"
                returnKeyType="next"
                value={email.value}
                onChangeText={text => setEmail({ value: text, error: '' })}
                error={!!email.error}
                errorText={email.error}
                autoCapitalize="none"
                autoCompleteType="email"
                textContentType="emailAddress"
                keyboardType="email-address"
            />

            <TextInput
                label="Password"
                returnKeyType="done"
                value={password.value}
                onChangeText={text => setPassword({ value: text, error: '' })}
                error={!!password.error}
                errorText={password.error}
                secureTextEntry
            />

            <View style={styles.forgotPassword}>
                <TouchableOpacity onPress={() => navigation.navigate('ForgotPasswordScreen')}>
                    <Text style={styles.label}>Forgot your password?</Text>
                </TouchableOpacity>
            </View>

            <Button mode="contained" loading={isLoading} disabled={isLoading} onPress={_onLoginPressed}>
                Login
      </Button>

            <View style={styles.row}>
                <Text style={styles.label}>Don’t have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('RegisterScreen')}>
                    <Text style={styles.link}>Sign up</Text>
                </TouchableOpacity>
            </View>

        </Background>

        // </View>
    );
};

const styles = StyleSheet.create({
    forgotPassword: {
        width: '100%',
        alignItems: 'flex-end',
        marginBottom: 24,
    },
    row: {
        flexDirection: 'row',
        marginTop: 4,
    },
    label: {
        color: theme.colors.secondary,
    },
    link: {
        fontWeight: 'bold',
        color: theme.colors.primary,
    },
});

// Map Dispatch To Props (Dispatch Actions To Reducers. Reducers Then Modify The Data And Assign It To Your Props)
const mapDispatchToProps = (dispatch) => {
    return {
        setUser: data => dispatch(createAction("SET_USER", data))
    };
};

// Exports
export default connect(null, mapDispatchToProps)(LoginScreen);