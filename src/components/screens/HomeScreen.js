import React, { useEffect } from 'react';
import { View } from "react-native";
import { Container, Content, List, ListItem, Left, Body, Right, Thumbnail, Text, Badge } from 'native-base';
import SocketIo from 'socket.io-client';
import Ionicons from 'react-native-vector-icons/Ionicons';
import IconFoundation from 'react-native-vector-icons/Foundation';
import IconAnt from 'react-native-vector-icons/AntDesign';
import IconFA5 from 'react-native-vector-icons/FontAwesome5';
import IconFA from 'react-native-vector-icons/FontAwesome';
import IconMCI from 'react-native-vector-icons/MaterialCommunityIcons';
import IconE from 'react-native-vector-icons/Entypo';
import config from '../../config';

import { connect } from 'react-redux'

function HomeScreen({ navigation, loginData }) {

    useEffect(() => {
        socket = SocketIo.connect(config.SOCKET_BASE_URL, {
            transports: ["websocket"],
            query: {
                username: "feri_mobile",
            },
            secure: true,
        });
        socket.on("connected", () => {
            console.log("connected");
        });
        socket.on('connect', () => console.log('connected'))
        socket.on('error', (e) => console.log(e))
        socket.on('connect_error', (e) => console.log(e))
    })

    changeRoom = (room_id, user_id) => {
        socket.emit("changeRoom", {
            user_id,
            room_id,
        });
    }

    console.log(loginData, 'loginData');

    return (
        <Container background=" ">
            <Content>
                <List>
                    <ListItem avatar button={true} onPress={() => navigation.navigate("ChatScreen")}>
                        <Left button={true} onPress={() => alert("avatar")}>
                            <Thumbnail style={{ width: 50, height: 50 }} source={{ uri: 'https://upload.wikimedia.org/wikipedia/id/d/d5/Aang_.jpg' }} />
                        </Left>
                        <Body height={70} >
                            <View style={{ flexDirection: "row", alignItems: "center", }}>
                                <Text style={{ fontWeight: "bold" }}>Kumar Pratik </Text>
                                <IconE style={{ fontWeight: "500", left: -10 }} color="grey" name="sound-mute" />
                            </View>
                            <Text note>Doing what you like will always keep you happy . .</Text>
                        </Body>
                        <Right >
                            <Text primary note>3:44 PM</Text>
                            <Badge style={{ height: 20 }} primary>
                                <Text>1</Text>
                            </Badge>
                        </Right>
                    </ListItem>
                </List>
            </Content>
        </Container >
    );
}

const mapStateToProps = (state) => {
    return {
        loginData: state.authReducer,
    };
};

const mapDispatchToProps = null

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);