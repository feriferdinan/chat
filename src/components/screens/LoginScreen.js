import React, { useState, useContext, createRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, TextInput, ToastAndroid } from 'react-native'
import { AuthContext } from '../../contexts';
const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);
import config from '../../config'
import Icon from 'react-native-vector-icons/MaterialIcons';
import { TouchableHighlight } from 'react-native-gesture-handler';
const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

export default function LoginScreen({ navigation }) {
    const { login } = useContext(AuthContext);
    const [email, setEmail] = useState('user2@gmail.com');
    const [password, setPassword] = useState('123');
    const [icEye, setIcEye] = useState('visibility-off');
    const [showPassword, setShowPassword] = useState(true);
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState('');
    changePwdType = () => {
        if (showPassword) {
            setShowPassword(false)
            setIcEye("visibility")
            setPassword(password)
        } else {
            setShowPassword(true)
            setIcEye("visibility-off")
            setPassword(password)
        }
    }
    handleLogin = () => {
        // if (!email || !password) {
        //     ToastAndroid.showWithGravityAndOffset(
        //         "Email & Password is required!",
        //         ToastAndroid.LONG,
        //         ToastAndroid.BOTTOM,
        //         0,
        //         200
        //     );
        // } else {
        try {
            setLoading(true);
            login({ email, password })
        } catch (e) {
            console.log(e, "error");
            setLoading(false);
            setError(e.message);
        }
        // }
    }
    secondTextInput = createRef()
    return (

        <View style={styles.container}>
            <View style={styles.wrapperForm} >
                <Text style={styles.title}>CHAT YUK</Text>
                <View style={styles.inputBox} >
                    <TextInput
                        value={email}
                        autoCompleteType='email'
                        keyboardType="email-address"
                        placeholder="Masukan Email Anda"
                        placeholderTextColor="grey"
                        returnKeyType={"next"}
                        autoFocus={true}
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
                    (reg.test(email) == 1 || email == "") ? null :
                        <Text style={{ color: 'red', alignSelf: "flex-start", paddingHorizontal: 46 }}>Email not valid!</Text>
                }
                <View style={[styles.wrapperInputPassword, styles.inputBox]} >
                    <TextInput
                        value={password}
                        placeholder="Masukan Password Anda"
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
                <TouchableOpacity>
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