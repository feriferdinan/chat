import React from 'react';
import { List, Avatar, Divider, Text } from 'react-native-paper';

function ListContact({ item, index }) {
    return (
        <>
            <List.Item
                onPress={() => alert("ok")}
                key={index}
                title={item.name}
                description={"online"}
                left={props => item.avatar ? < Avatar.Image size={40} source={{ uri: item.avatar }} /> : <Avatar.Text size={40} label={item.name} />}
            />
            <Divider />
        </>
    );
}

export default ListContact