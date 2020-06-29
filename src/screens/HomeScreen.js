import React, { useEffect, useState } from 'react';
import { View } from "react-native";
import { Container, Content, List, ListItem, Left, Body, Right, Thumbnail, Text, Badge } from 'native-base';
import SocketIo from 'socket.io-client';
import config from '../config';
import { connect } from 'react-redux'
import Axios from '../utils/Axios'
import { createAction } from '../utils/createAction'
import formatDate from '../utils/formatDate'
import Toast from '../components/Toast'

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
            if (message.user._id != userData.data._id) {
                messageData.data.map(el => {
                    if (el._id == message.room_id) {
                        el.messages = [message, ...el.messages]
                    }
                })
                setMessage(messageData.data)
            }
        });
    }, []);


    getMessage = () => {
        Axios.get(`message`)
            .then(async res => {
                setLoading(false)
                setMessage(res.data.data)
            })
            .catch(err => {
                setLoading(false)
                if (err.response?.status <= 404) {
                    Toast(err.response.data.message);
                } else {
                    Toast(err.message);
                }
            })
    }

    return (
        <Container background="">
            <Content>
                <List>
                    {
                        messageData.data.map((item, index) => {
                            return (<ListChat key={index} item={item} navigation={navigation} index={index} userData={userData} />)
                        })
                    }
                </List>
            </Content>
        </Container >
    );
}

function ListChat({ item, index, navigation, userData }) {
    let avatar, roomName
    if (item.type) {
        // isGroup
        avatar = item?.avatar || "https://lh3.googleusercontent.com/proxy/ZYjs1CrEnp03V6323GZFNSKiOl5wAihFPrUouj6touxMlBmdT416WwMGTqopA0FPbyCdH5se6vQgoLJU1bJO7l0AtTqWTgzW3Idi34xvqZohlGHiLK2XwGB1nhC9DpOQ2zSRGesc"
        roomName = item.name

    } else {
        // private
        item.participants.map(e => {
            if (e.user._id != userData.data._id) {
                avatar = e.user?.avatar || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                roomName = e.user.name
                // break;
            }
        })
    }
    return (
        <ListItem avatar button={true} onPress={() => navigation.navigate("ChatScreen", {
            data: item
        })} key={index} >
            <Left button={true} onPress={() => alert("avatar")}>
                <Thumbnail style={{ width: 50, height: 50 }} source={{ uri: avatar }} />
            </Left>
            <Body height={70} >
                <View style={{ flexDirection: "row", alignItems: "center", }}>
                    <Text style={{ fontWeight: "bold" }}>{roomName}</Text>
                    {/* <IconE style={{ fontWeight: "500", left: -10 }} color="grey" name="sound-mute" /> */}
                </View>
                <Text >{item.type ? item?.messages[0].user.name + ": " : ""}<Text note>{item?.messages[0].text}</Text></Text>
            </Body>
            <Right >
                <Text primary note>{formatDate(item?.messages[0].createdAt)}</Text>
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