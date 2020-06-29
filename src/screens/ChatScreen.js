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

let socket;

function ChatScreen({ navigation, route, userData, messageData, setMessageRedux }) {
    const roomProps = route.params.data
    const willMount = useRef(true);
    const [messages, setMessage] = useState([])
    const [progress, setProgress] = useState(0);
    if (willMount.current) {
        setMessage(roomProps.messages)
        socket = SocketIo.connect(config.SOCKET_BASE_URL, {
            transports: ["websocket"],
            query: {
                username: userData.data.email,
            },
            secure: true,
        });
        willMount.current = false;
    }


    useEffect(() => {
        socket.on("new message", (message) => {
            if (message.user._id != userData.data._id) {
                setMessage(previousState => [message, ...previousState])
            }
        });
        return () => {
            setProgress(0);
        };
    }, [])

    onSend = (message = {}) => {
        message.room_id = roomProps._id
        message.user.name = userData.data.name
        setMessage(previousState => [message, ...previousState])
        Axios.post(`message`, {
            _id: message._id,
            room_id: message.room_id,
            text: message.text
        }).then(res => {
            socket.emit("send message", message);
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
