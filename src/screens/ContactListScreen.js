import React from 'react';
import { PermissionsAndroid } from 'react-native';
import { Container, Header, Content, List, ListItem, Left, Body, Right, Thumbnail, Text } from 'native-base';
import Contacts from 'react-native-contacts';

export default function ContactListScreen({ navigation }) {

    getContact = () => {
        PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
            {
                'title': 'Contacts',
                'message': 'This app would like to view your contacts.',
                'buttonPositive': 'Please accept bare mortal'
            }
        ).then(() => {
            Contacts.getAll((err, contacts) => {
                if (err === 'denied') {
                    // error
                } else {
                    console.log(contacts);
                }
            })
        })
    }
    return (
        <Container>
            <Content>
                <List>
                    <ListItem avatar>
                        <Left>
                            <Thumbnail source={{ uri: 'Image URL' }} />
                        </Left>
                        <Body>
                            <Text>Kumar Pratik</Text>
                            <Text note>Doing what you like will always keep you happy . .</Text>
                        </Body>
                        <Right>
                            <Text note>3:43 pm</Text>
                        </Right>
                    </ListItem>
                </List>
            </Content>
        </Container>
    );
}