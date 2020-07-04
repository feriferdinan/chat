import React, { useState, useEffect, useRef } from 'react';
import {
    View,
} from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat'
import SocketIo from 'socket.io-client';
import config from '../config';
import { connect } from 'react-redux'
import Axios from '../utils/Axios'
import { createAction } from '../utils/createAction'
import Toast from '../components/Toast'
import Sound from 'react-native-sound'

let socket;

function ChatScreen({ navigation, route, userData, messageData, setMessageRedux }) {
    const roomProps = route.params.data
    const willMount = useRef(true);
    const [messages, setMessage] = useState([])
    const [progress, setProgress] = useState(0);
    sound = new Sound('new_message_on_screen.mp3');
    playSound = () => {
        sound.play()
    }
    if (willMount.current) {
        roomProps.messages.map(m => {
            m.sent = true
            m.pending = false
            // m.received = true
            if (!m.user.avatar) {
                delete m.user.avatar
            }
        })
        setMessage(roomProps.messages)
        socket = SocketIo.connect(config.SOCKET_BASE_URL, {
            transports: ["websocket"],
            query: {
                username: userData.data.email,
            },
            secure: true,
        });
        socket.emit("join", roomProps._id);
        willMount.current = false;
    }


    useEffect(() => {
        socket.on("new message", (message) => {
            if (message.user._id != userData.data._id) {
                setMessage(previousState => [message, ...previousState])
                playSound()
            }
        });
        return () => {
            setProgress(0);
        };
    }, [])

    onSend = (message = {}) => {
        message.room_id = roomProps._id
        message.user.name = userData.data.name
        if (userData.data.avatar) {
            message.user.avatar = userData.data.avatar
        }
        message.pending = true
        setMessage(previousState => [message, ...previousState])
        Axios.post(`message`, {
            _id: message._id,
            room_id: message.room_id,
            text: message.text
        }).then(res => {
            message.sent = true
            message.pending = false
            message.received = false
            socket.emit("send message", message);
            messageData.data.map(el => {
                if (el._id == message.room_id) {
                    el.messages = [message, ...el.messages]
                }
            })
            setMessageRedux(messageData.data)
        }).catch(err => {
            if (err.response?.status <= 404) {
                Toast(err.response.data.message);
            } else {
                Toast(err.message);
            }
        })
    }


    getMessagePaginate = () => {

    }

    return (
        <View style={{ flex: 1, backgroundColor: "white" }}>
            <GiftedChat
                messages={messages}
                onSend={message => onSend(message[0])}
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
