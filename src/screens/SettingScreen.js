import React from 'react';
import { Alert } from 'react-native'
import { Container, Header, Content, Button, ListItem, Text, Icon, Left, Body, Right, Switch } from 'native-base';
import { connect } from 'react-redux'
import { createAction } from '../utils/createAction'
import AsyncStorage from '@react-native-community/async-storage';
function SettingScreen({ navigation, logout }) {



    handleLogout = () => {
        Alert.alert(
            'Log out',
            'You will be returned to the login screen.',
            [

                {
                    text: 'Cancel',
                    onPress: () => { },
                    style: 'cancel'
                },
                {
                    text: 'Log out', onPress: () => {
                        AsyncStorage.clear().then(() => {
                            logout()
                        })
                    }
                }
            ],
            { cancelable: true }
        );
    }

    return (
        <Container>
            <Content>
                <ListItem icon button={true} onPress={() => alert("ok")}>
                    <Left>
                        <Button style={{ backgroundColor: "#007AFF" }}>
                            <Icon active name="wifi" />
                        </Button>
                    </Left>
                    <Body>
                        <Text>Wi-Fi</Text>
                    </Body>
                    <Right>
                        <Icon name="arrow-forward" />
                    </Right>
                </ListItem>
                <ListItem icon button={true} onPress={handleLogout}>
                    <Left>
                        <Button style={{ backgroundColor: "red" }}>
                            <Icon active name="ios-log-out" />
                        </Button>
                    </Left>
                    <Body>
                        <Text>Logout</Text>
                    </Body>
                    <Right>
                        <Icon name="arrow-forward" />
                    </Right>
                </ListItem>
            </Content>
        </Container>
    );
}


const mapDispatchToProps = (dispatch) => {
    return {
        logout: () => dispatch(createAction("REMOVE_USER", null)),
    };
};

export default connect(null, mapDispatchToProps)(SettingScreen);