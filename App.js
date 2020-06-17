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
  FlatList
} from 'react-native';
import SocketIo from 'socket.io-client';



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
      this.setState({ data: [...this.state.data, data] })
    });

    this.socket.on("received", (data) => {
      console.log(data);
      this.setState({ data: [...this.state.data, data] })
    });

    console.log("end didmount");
  }

  tesEmit = () => {
    this.socket.emit("send message", {
      from: "feri_mobile",
      to: "feri_html",
      message: "tes dari feri_mobile",
      author: "feri_mobile_1",
      rid: 1,
      files: "",
    });
    this.socket.emit("received", {
      from: "feri_mobile",
      to: "feri_html",
      message: "tes dari feri_mobile",
      author: "feri_mobile_1",
      rid: 1,
      files: "",
    });
    console.log("pressed");

  }
  render() {
    return (
      <View style={{ flex: 1, padding: 16 }}>
        <FlatList
          data={this.state.data}
          keyExtractor={(item, index) => "key" + index.toString()}
          renderItem={({ item, index }) => {
            return (<Text>{item.from}: {item.message}</Text>)
          }}
        />
        <View style={{ alignContent: "center" }}>
          <TouchableOpacity style={{ padding: 20, backgroundColor: "green", borderRadius: 50, position: "absolute", bottom: 20 }} onPress={this.tesEmit}>
            <Text style={{ color: "white" }}>send</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}


export default App;
