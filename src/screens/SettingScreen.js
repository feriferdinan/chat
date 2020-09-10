import React from 'react';
import { Alert } from 'react-native'
import { createAction } from '../utils/createAction'
import AsyncStorage from '@react-native-community/async-storage';
import { List, Divider } from 'react-native-paper';
import { connect } from 'react-redux'

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
                    text: 'Log out', onPress: () => AsyncStorage.clear().then(logout)
                }
            ],
            { cancelable: true }
        );
    }

    return (
        <>
            <List.Item
                onPress={handleLogout}
                title={"Logout"}
            // left={props => item.avatar ? < Avatar.Image size={40} source={{ uri: item.avatar }} /> : <Avatar.Text size={40} label={item.name} />}
            />
            <Divider />
        </>)

}


const mapDispatchToProps = (dispatch) => {
    return {
        logout: () => dispatch(createAction("REMOVE_USER", null)),
    };
};

export default connect(null, mapDispatchToProps)(SettingScreen);