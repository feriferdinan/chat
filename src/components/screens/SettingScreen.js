import React, { useContext } from 'react';
import { Container, Header, Content, Button, ListItem, Text, Icon, Left, Body, Right, Switch } from 'native-base';
// import { AuthContext } from '../../contexts'
import { logout } from '../../redux/actions/authAction'
import { connect } from 'react-redux'
function SettingScreen({ navigation, loginAction }) {
    // const { logout } = useContext(AuthContext);

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
                <ListItem icon button={true} onPress={loginAction}>
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


const mapStateToProps = (state) => {
    return {
        loginData: state.authReducer,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        loginAction: () => dispatch(logout()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SettingScreen);