import React from 'react';
import { List, Avatar, Divider, Text } from 'react-native-paper';
import formatDate from '../utils/formatDate'


function ListChat({ item, index, navigation, userData }) {
    let avatar, roomName
    if (item.type) {
        // isGroup
        item.avatar = item?.avatar ? item.avatar : "https://lh3.googleusercontent.com/proxy/ZYjs1CrEnp03V6323GZFNSKiOl5wAihFPrUouj6touxMlBmdT416WwMGTqopA0FPbyCdH5se6vQgoLJU1bJO7l0AtTqWTgzW3Idi34xvqZohlGHiLK2XwGB1nhC9DpOQ2zSRGesc"
        avatar = item.avatar
        roomName = item.name

    } else {
        // private
        item.participants.map(e => {
            if (e.user._id != userData.data._id) {
                item.avatar = e.user?.avatar || null
                avatar = item.avatar
                roomName = e.user.name
            }
        })
    }

    return (
        <>
            <List.Item
                onPress={() => navigation.navigate("ChatScreen", { data: item })}
                key={index}
                title={roomName}
                description={`${item.type ? item?.messages[0].user.name + ": " : ""}${item?.messages[0].text}`}
                left={props => avatar ? < Avatar.Image size={40} source={{ uri: avatar }} /> : <Avatar.Text size={40} label={roomName} />}
                right={props => <Text>{formatDate(item?.messages[0].createdAt)}</Text>}
            />
            <Divider />
        </>
    )
}


// Exports
export default ListChat;