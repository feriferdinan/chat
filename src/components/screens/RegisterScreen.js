import React, { useState, createRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, TextInput, ToastAndroid, ScrollView } from 'react-native'
import config from '../../config'
import Icon from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux';
import Axios from '../../utils/Axios'
import { createAction } from '../../utils/createAction'
import AsyncStorage from '@react-native-community/async-storage';

const regemail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);

function RegisterScreen({ navigation, setUser }) {
    phoneNumberRef = createRef()
    emailRef = createRef()
    passwordRef = createRef()
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [icEye, setIcEye] = useState('visibility-off');
    const [showPassword, setShowPassword] = useState(true);
    const [isLoading, setLoading] = useState(false);

    changePwdType = () => {
        setShowPassword(!showPassword)
        setIcEye(showPassword ? "visibility" : "visibility-off")
        setPassword(password)
    }

    toast = text => ToastAndroid.showWithGravityAndOffset(text, ToastAndroid.LONG, ToastAndroid.BOTTOM, 0, 200);

    handleRegister = () => {
        if (!name || !email || !password || !phoneNumber) return toast("Name, Email, Phone Number or password cannot be empty!");
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
    }

    return (
        <View style={styles.container}>
            <View style={styles.wrapperForm} >
                <Text style={styles.title}>Register New Account</Text>
                <View style={styles.inputBox} >
                    <TextInput
                        value={name}
                        placeholder="Input your name"
                        placeholderTextColor="grey"
                        returnKeyType={"next"}
                        onSubmitEditing={() => emailRef.focus()}
                        onChangeText={(text) => setName(text)}
                    />
                    <Icon
                        style={{ position: "absolute", left: 12, top: 15 }}
                        name="person"
                        size={16}
                        color="rgba(0,0,0,0.5)"
                    />
                </View>
                <View style={styles.inputBox} >
                    <TextInput
                        value={email}
                        autoCompleteType='email'
                        keyboardType="email-address"
                        placeholder="Input your email address"
                        placeholderTextColor="grey"
                        returnKeyType={"next"}
                        onSubmitEditing={() => phoneNumberRef.focus()}
                        ref={(input) => { emailRef = input; }}
                        onChangeText={(email) => setEmail(email)}
                    />
                    <Icon
                        style={{ position: "absolute", left: 12, top: 15 }}
                        name="email"
                        size={16}
                        color="rgba(0,0,0,0.5)"
                    />
                </View>
                {
                    (regemail.test(email) == 1 || email == "") ? null :
                        <Text style={{ color: 'red', alignSelf: "flex-start", paddingHorizontal: 46 }}>Email not valid!</Text>
                }
                <View style={styles.inputBox} >
                    <TextInput
                        value={phoneNumber}
                        autoCompleteType='email'
                        keyboardType="numeric"
                        placeholder="Input your phone number"
                        placeholderTextColor="grey"
                        returnKeyType={"next"}
                        ref={(input) => { phoneNumberRef = input; }}
                        onSubmitEditing={() => passwordRef.focus()}
                        onChangeText={(text) => setPhoneNumber(text)}
                    />
                    <Icon
                        style={{ position: "absolute", left: 12, top: 15 }}
                        name="phone"
                        size={16}
                        color="rgba(0,0,0,0.5)"
                    />
                </View>
                <View style={[styles.wrapperInputPassword, styles.inputBox]} >
                    <TextInput
                        value={password}
                        placeholder="Input your password"
                        secureTextEntry={showPassword}
                        ref={(input) => { passwordRef = input; }}
                        returnKeyType={"go"}
                        placeholderTextColor="grey"
                        onChangeText={(text) => setPassword(text)}
                    />
                    <Icon
                        style={{ position: "absolute", left: 12, top: 15 }}
                        name="lock"
                        size={16}
                        color="rgba(0,0,0,0.5)"
                    />
                    <TouchableOpacity activeOpacity={0.5} style={styles.icon} onPress={changePwdType}>
                        <Icon
                            name={icEye}
                            size={25}
                            color={"#aeaeae"}

                        />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity disabled={isLoading} activeOpacity={0.5} style={[styles.button, { backgroundColor: isLoading ? "#ccc" : config.BASE_COLOR }]} onPress={handleRegister}>
                    <Text style={styles.buttonText}>{isLoading ? "Loading..." : "REGISTER NOW"}</Text>
                </TouchableOpacity>
            </View>
        </View >
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
        fontSize: 20,
        fontWeight: "700",
        color: config.BASE_COLOR,
        margin: 10,

    },
    inputBox: {
        width: screenWidth - screenWidth * 13 / 100,
        borderRadius: 25,
        paddingHorizontal: 16,
        paddingLeft: 30,
        fontSize: 16,
        color: 'grey',
        marginVertical: 10,
        backgroundColor: "#ffff",
        borderColor: config.BASE_COLOR,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,
        elevation: 9,
    },
    wrapperForm: {
        width: "100%",
        backgroundColor: 'rgba(86,130,163,0)',
        flexDirection: "column",
        alignItems: "center",
        borderRadius: 20,
        padding: 10,

    },
    wrapperInputPassword: {
        flexDirection: "row",
    },
    icon: {
        position: 'absolute',
        top: 11,
        right: 15
    },
    button: {
        width: "90%",
        backgroundColor: config.BASE_COLOR,
        borderRadius: 25,
        marginVertical: 10,
        paddingVertical: 13,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#ffffff',
        textAlign: 'center'
    }

});

const mapDispatchToProps = (dispatch) => {
    return {
        setUser: data => dispatch(createAction("SET_USER", data))
    };
};

export default connect(null, mapDispatchToProps)(RegisterScreen);