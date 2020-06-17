/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

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
import SocketIo from 'socket.io-client';
import { GiftedChat } from 'react-native-gifted-chat'




class App extends Component {
  constructor() {
    super()
    this.state = {
      data: []
    }
    this.socket = SocketIo.connect(`http://10.10.10.22:3000/`, {
      transports: ["websocket"],
      query: {
        username: "feri_mobile",
      },
      reconnect: true,
      secure: true,

    });
  }
  componentDidMount() {
    this.socket.emit("join", 1);
    // this.socket.emit("changeRoom", {
    //   user: 123,
    //   rid: 1,
    // });
    this.socket.on("connected", () => {
      console.log("connected");
      // debugger;

    });
    this.socket.on('connect', () => console.log('connected'))
    this.socket.on('error', (e) => console.log(e))
    this.socket.on('connect_error', (e) => console.log(e))

    this.socket.on("new message", (data) => {
      console.log(data);
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

    console.log("end didmount");
  }
  onSend(messages = []) {
    messages[0].rid = 1
    messages[0].user.name = "feri_mobile"
    console.log(messages, 'messages');
    // this.setState(previousState => ({
    //   data: GiftedChat.append(previousState.data, messages),
    // }))
    this.socket.emit("send message", messages[0]);
    this.socket.emit("received", messages[0]);
  }

  scrollToEnd = () => {
    this.flatList.scrollToEnd({ animated: true });
  }
  render() {
    return (
      <View style={{ flex: 1 }}>
        <GiftedChat
          messages={this.state.data}
          onSend={messages => this.onSend(messages)}
          scrollToBottom={true}
          isTyping={true}
          user={{
            _id: 1,
          }}
        />
        {/* {
          Platform.OS === 'android' && <KeyboardAvoidingView behavior="padding" />
        } */}
      </View>
    )
  }
}


export default App;
