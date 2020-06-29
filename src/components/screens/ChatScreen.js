import React, { useState, useEffect } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    StatusBar,
    TouchableOpacity,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    ToastAndroid
} from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat'
import SocketIo from 'socket.io-client';
import config from '../../config';
import { connect } from 'react-redux'
import Axios from '../../utils/Axios'
import { createAction } from '../../utils/createAction'

let socket;


function ChatScreen({ navigation, route, userData, messageData, setMessageRedux }) {
    const [messages, setMessage] = useState([])
    const [progress, setProgress] = useState(0);
    const roomProps = route.params.data

    useEffect(() => {
        socket = SocketIo.connect(config.SOCKET_BASE_URL, {
            transports: ["websocket"],
            query: {
                username: userData.data.email,
            },
            secure: true,
        });
        socket.emit("join", roomProps._id);
    }, [])

    useEffect(() => {
        messageData.data.map(el => {
            if (roomProps._id == el._id) {
                setMessage(el.messages)
            }
        })
    }, [messageData.data]);

    useEffect(() => {
        socket.on("new message", (message) => {
            if (message.user_id !== userData.data._id) {
                setMessage(previousState => [message, ...previousState])
            }
        });
        return () => {
            setProgress(0);
        };
    }, [])



    onSend = (message = []) => {
        message[0].room_id = roomProps._id
        message[0].user.name = userData.data.name
        setMessage(previousState => [message, ...previousState])
        Axios.post(`message`, {
            _id: message[0]._id,
            room_id: message[0].room_id,
            text: message[0].text
        })
            .then(async res => {
                socket.emit("send message", message[0]);
            })
            .catch(err => {
                if (err.response?.status <= 404) {
                    toast(err.response.data.message);
                } else {
                    toast(err.message);
                }
            })
    }

    toast = text => ToastAndroid.showWithGravityAndOffset(text, ToastAndroid.LONG, ToastAndroid.BOTTOM, 0, 200);

    getMessage = () => {

    }

    return (
        <View style={{ flex: 1, backgroundColor: "white" }}>
            <GiftedChat
                messages={messages}
                onSend={message => onSend(message)}
                scrollToBottom={true}
                user={{
                    _id: userData.data._id
                }}
            />
        </View>
    )
}


const mapStateToProps = (state) => {
    return {
        userData: state.userReducer,
        messageData: state.messageReducer
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setUser: data => dispatch(createAction("SET_USER", data)),
        setMessageRedux: data => dispatch(createAction("SET_MESSAGE", data)),
    };
};

// Exports
export default connect(mapStateToProps, mapDispatchToProps)(ChatScreen);
