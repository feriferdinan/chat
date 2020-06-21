import React, { Component } from 'react';
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


class ChatScreen extends Component {
    constructor() {
        super()
        this.state = {
            data: []
        }
    }

    componentDidMount() {
        this.socket = SocketIo.connect(config.SOCKET_BASE_URL, {
            transports: ["websocket"],
            query: {
                username: "feri_mobile",
            },
            secure: true,
        });
        this.socket.emit("join", 1);
        this.socket.on("new message", (data) => {
            this.setState(previousState => ({
                data: GiftedChat.append(previousState.data, [data]),
            }))
        });
        this.socket.on("received", (data) => {
            console.log(data);
            this.setState(previousState => ({
                data: GiftedChat.append(previousState.data, [data]),
            }))
        });
    }

    onSend(messages = []) {
        messages[0].room_id = 1
        messages[0].user.name = "feri_mobile"
        this.socket.emit("send message", messages[0]);
        this.socket.emit("received", messages[0]);
    }


    render() {
        return (
            <View style={{ flex: 1, backgroundColor: "white" }}>
                <GiftedChat
                    messages={this.state.data}
                    onSend={messages => this.onSend(messages)}
                    scrollToBottom={true}
                    user={{
                        _id: 1,
                    }}
                />
            </View>
        )
    }
}


export default ChatScreen;
