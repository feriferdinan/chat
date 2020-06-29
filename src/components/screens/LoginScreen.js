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

function LoginScreen({ navigation, setUser }) {
    secondTextInput = createRef()
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [icEye, setIcEye] = useState('visibility-off');
    const [showPassword, setShowPassword] = useState(true);
    const [isLoading, setLoading] = useState(false);

    changePwdType = () => {
        setShowPassword(!showPassword)
        setIcEye(showPassword ? "visibility" : "visibility-off")
        setPassword(password)
    }

    toast = text => ToastAndroid.showWithGravityAndOffset(text, ToastAndroid.LONG, ToastAndroid.BOTTOM, 0, 200);

    handleLogin = () => {
        if (!email || !password) return toast("Email or password cannot be empty!");
        setLoading(true)
        Axios.post(`auth/login`, {
            email: email,
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
                <Text style={styles.title}>CHAT YUK</Text>
                <View style={styles.inputBox} >
                    <TextInput
                        value={email}
                        autoCompleteType='email'
                        keyboardType="email-address"
                        placeholder="Input your Email"
                        placeholderTextColor="grey"
                        returnKeyType={"next"}
                        onSubmitEditing={() => secondTextInput.focus()}
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
                <View style={[styles.wrapperInputPassword, styles.inputBox]} >
                    <TextInput
                        value={password}
                        placeholder="Input your Password"
                        secureTextEntry={showPassword}
                        ref={(input) => { secondTextInput = input; }}
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
                <TouchableOpacity disabled={isLoading} activeOpacity={0.5} style={[styles.button, { backgroundColor: isLoading ? "#ccc" : config.BASE_COLOR }]} onPress={handleLogin}>
                    <Text style={styles.buttonText}>{isLoading ? "Loading..." : "LOGIN"}</Text>
                </TouchableOpacity>
            </View>
            <View style={{ justifyContent: 'center', alignItems: 'center', position: "absolute", bottom: 20 }}>
                <Text>Don't have an account yet?</Text>
                <TouchableOpacity disabled={isLoading}>
                    <Text
                        onPress={() => navigation.navigate('Register')}
                        style={{ color: config.BASE_COLOR, fontWeight: "bold" }} >SIGN UP NOW!</Text>
                </TouchableOpacity>
            </View>
        </View>
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


// Map Dispatch To Props (Dispatch Actions To Reducers. Reducers Then Modify The Data And Assign It To Your Props)
const mapDispatchToProps = (dispatch) => {
    return {
        setUser: data => dispatch(createAction("SET_USER", data))
    };
};

// Exports
export default connect(null, mapDispatchToProps)(LoginScreen);