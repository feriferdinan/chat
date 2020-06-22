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
    Platform
} from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat'
import SocketIo from 'socket.io-client';
import config from '../../config';

let socket;


function ChatScreen({ navigation }) {
    const [messages, setMessage] = useState([])
    const [progress, setProgress] = useState(0);


    useEffect(() => {
        socket = SocketIo.connect(config.SOCKET_BASE_URL, {
            transports: ["websocket"],
            query: {
                username: "feri_mobile",
            },
            secure: true,
        });
        socket.emit("join", 1);
    }, [])
    useEffect(() => {
        socket.on("new message", (message) => {
            setMessage(previousState => [...previousState, message])
        });
        socket.on("received", (message) => {
            setMessage(previousState => [...previousState, message])
        });
        return () => {
            setProgress(0);
        };
    }, [])

    onSend = (message = []) => {
        message[0].room_id = 1
        message[0].user.name = "feri_mobile"
        socket.emit("send message", message[0]);
        socket.emit("received", message[0]);
    }


    return (
        <View style={{ flex: 1, backgroundColor: "white" }}>
            <GiftedChat
                messages={messages}
                onSend={message => onSend(message)}
                scrollToBottom={true}
                user={{
                    _id: 1,
                }}
            />
        </View>
    )
}


export default ChatScreen;
