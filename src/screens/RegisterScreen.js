import React, { memo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Background from '../components/Background';
import Logo from '../components/Logo';
import Title from '../components/Title';
import Button from '../components/Button';
import TextInput from '../components/TextInput';
import BackButton from '../components/BackButton';
import { theme } from '../utils/theme';
import {
    emailValidator,
    passwordValidator,
    nameValidator,
} from '../utils/validators';
import { connect } from 'react-redux';


const RegisterScreen = ({ navigation }) => {
    const [name, setName] = useState({ value: '', error: '' });
    const [email, setEmail] = useState({ value: '', error: '' });
    const [password, setPassword] = useState({ value: '', error: '' });
    const [phoneNumber, setPhoneNumber] = useState({ value: '', error: '' });
    const [isLoading, setLoading] = useState(false);

    _onSignUpPressed = () => {
        const nameError = nameValidator(name.value);
        const emailError = emailValidator(email.value);
        const passwordError = passwordValidator(password.value);
        const phoneNumberError = !phoneNumber.value;

        if (emailError || passwordError || nameError || phoneNumberError) {
            setName({ ...name, error: nameError });
            setEmail({ ...email, error: emailError });
            setPassword({ ...password, error: passwordError });
            setPhoneNumber({ ...phoneNumber, error: "Phone Number cannot be empty" });
            return;
        }

        setLoading(true)
        Axios.post(`auth/register`, {
            name: name,
            email: email,
            phone_number: phoneNumber,
            password: password
        }).then(async res => {
            setLoading(false)
            await AsyncStorage.setItem("token", res.data.token)
            setUser(res.data.data)
        }).catch(err => {
            setLoading(false)
            if (err.response?.status <= 404) {
                toast(err.response.data.message);
            } else {
                toast(err.message);
            }
        })
    };

    return (
        <Background>
            {/* <BackButton goBack={() => navigation.navigate('HomeScreen')} /> */}


            <Title>Create Account</Title>

            <TextInput
                label="Name"
                returnKeyType="next"
                value={name.value}
                onChangeText={text => setName({ value: text, error: '' })}
                error={!!name.error}
                errorText={name.error}
            />

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
                label="Phone Number"
                returnKeyType="next"
                value={phoneNumber.value}
                onChangeText={text => setPhoneNumber({ value: text, error: '' })}
                error={!!phoneNumber.error}
                errorText={phoneNumber.error}
                autoCapitalize="none"
                keyboardType="numeric"
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

            <Button mode="contained" loading={isLoading} onPress={_onSignUpPressed} style={styles.button}>
                Sign Up
            </Button>

            <View style={styles.row}>
                <Text style={styles.label}>Already have an account? </Text>
                <TouchableOpacity onPress={() => navigation.goBack('')}>
                    <Text style={styles.link}>Login</Text>
                </TouchableOpacity>
            </View>
        </Background>
    );
};

const styles = StyleSheet.create({
    label: {
        color: theme.colors.secondary,
    },
    button: {
        marginTop: 24,
    },
    row: {
        flexDirection: 'row',
        marginTop: 4,
    },
    link: {
        fontWeight: 'bold',
        color: theme.colors.primary,
    },
});

const mapDispatchToProps = (dispatch) => {
    return {
        setUser: data => dispatch(createAction("SET_USER", data))
    };
};

export default connect(null, mapDispatchToProps)(RegisterScreen);