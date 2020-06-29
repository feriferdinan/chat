import React, { useEffect, useState } from 'react';
import { View, FlatList, ToastAndroid } from "react-native";
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
import Axios from '../../utils/Axios'
import { createAction } from '../../utils/createAction'
let socket
function HomeScreen({ navigation, userData, messageData, setMessage }) {
    const [isLoading, setLoading] = useState(false);
    useEffect(() => {
        getMessage()
    }, [])
    useEffect(() => {
        socket = SocketIo.connect(config.SOCKET_BASE_URL, {
            transports: ["websocket"],
            query: {
                username: userData.data.email,
            },
            secure: true,
        });
        messageData.data.map(e => {
            socket.emit("join", e._id);
        })
        socket.on("new message", (message) => {
            messageData.data.map(el => {
                if (el._id == message.room_id) {
                    el.messages = [message, ...el.messages]
                }
            })
            setMessage(messageData.data)
        });
    }, []);

    toast = text => ToastAndroid.showWithGravityAndOffset(text, ToastAndroid.LONG, ToastAndroid.BOTTOM, 0, 200);

    getMessage = () => {
        Axios.get(`message`)
            .then(async res => {
                setLoading(false)
                setMessage(res.data.data)
            })
            .catch(err => {
                setLoading(false)
                if (err.response?.status <= 404) {
                    toast(err.response.data.message);
                } else {
                    toast(err.message);
                }
            })
    }

    return (
        <Container background="">
            <Content>
                <List>
                    {
                        messageData.data.map((item, index) => {
                            return (<MyListItem key={index} item={item} navigation={navigation} index={index} />)
                        })
                    }
                </List>
            </Content>
        </Container >
    );
}

function MyListItem({ item, index, navigation }) {
    return (
        <ListItem avatar button={true} onPress={() => navigation.navigate("ChatScreen", {
            data: item
        })} key={index} >
            <Left button={true} onPress={() => alert("avatar")}>
                <Thumbnail style={{ width: 50, height: 50 }} source={{ uri: 'https://lh3.googleusercontent.com/proxy/ZYjs1CrEnp03V6323GZFNSKiOl5wAihFPrUouj6touxMlBmdT416WwMGTqopA0FPbyCdH5se6vQgoLJU1bJO7l0AtTqWTgzW3Idi34xvqZohlGHiLK2XwGB1nhC9DpOQ2zSRGesc' }} />
            </Left>
            <Body height={70} >
                <View style={{ flexDirection: "row", alignItems: "center", }}>
                    <Text style={{ fontWeight: "bold" }}>{item.name}</Text>
                    {/* <IconE style={{ fontWeight: "500", left: -10 }} color="grey" name="sound-mute" /> */}
                </View>
                <Text >{item?.messages[0].user.name}: <Text note>{item?.messages[0].text}</Text></Text>
            </Body>
            <Right >
                <Text primary note>3:44 PM</Text>
                {/* <Badge style={{ height: 20 }} primary>
                    <Text>1</Text>
                </Badge> */}
            </Right>
        </ListItem>
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
        setMessage: data => dispatch(createAction("SET_MESSAGE", data)),
    };
};

// Exports
export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);