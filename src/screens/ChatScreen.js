import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import {
    View,
    Image,
    ActivityIndicator
} from 'react-native';
import BackButton from '../components/BackButton'
import { GiftedChat } from 'react-native-gifted-chat'
import SocketIo from 'socket.io-client';
import config from '../config';
import { connect } from 'react-redux'
import Axios from '../utils/Axios'
import { theme } from '../utils/theme'
import { createAction } from '../utils/createAction'
import Toast from '../components/Toast'
import Sound from 'react-native-sound'

let socket;

function ActionBarIcon({ roomProps }) {
    return (
        <Image
            source={{ uri: roomProps.avatar }}
            style={{ width: 40, height: 40, borderRadius: 40 / 2, marginRight: 16 }} />
    );
}


function ChatScreen({ navigation, route, userData }) {
    const roomProps = route.params.data
    const willMount = useRef(true);
    const [messages, setMessage] = useState([])
    const [nextPage, setNextPage] = useState(2)
    const [progress, setProgress] = useState(0);
    const [isLoading, setLoading] = useState(false);

    useLayoutEffect(() => {
        navigation.setOptions({
            title: roomProps?.name,
            headerRight: props => <ActionBarIcon {...{ roomProps, navigation }} />,
            headerStyle: {
                backgroundColor: theme.colors.primary,
                elevation: 0, // remove shadow on Android
                shadowOpacity: 0 // remove shadow on iOS
            },
            headerTintColor: theme.colors.white,
        });
    }, [navigation]);

    let sound = new Sound('new_message_on_screen.mp3');
    playSound = () => {
        sound.play()
    }
    if (willMount.current) {
        roomProps.messages.map(m => {
            m.sent = true
            m.pending = false
            // m.received = true
            if (!m.user.avatar) {
                delete m.user.avatar
            }
        })
        setMessage(roomProps.messages)

        willMount.current = false;
    }


    useEffect(() => {
        socket = SocketIo.connect(config.SOCKET_BASE_URL, {
            transports: ["websocket"],
            query: {
                username: userData.data.email,
            },
            secure: true,
        });
        socket.emit("join", roomProps._id);
        socket.on("new message", (message) => {
            if (message.user._id != userData.data._id)
                setMessage(previousState => [message, ...previousState])
        });
        return () => {
            setProgress(0);
        };
    }, [])

    onSend = (message = {}) => {
        message.room_id = roomProps._id
        message.user.name = userData.data.name
        if (userData.data.avatar)
            message.user.avatar = userData.data.avatar
        message.pending = true
        setMessage(previousState => [message, ...previousState])
        Axios.post(`message`, message).then(res => {
            message.sent = true
            message.pending = false
            message.received = false
            socket.emit("send message", message);
            setNewMessage(message)
        }).catch(err => {
            if (err.response?.status <= 404) {
                Toast(err.response.data.message);
            } else {
                Toast(err.message);
            }
        })
    }


    loadMoreMessage = () => {
        setLoading(true)
        Axios.get(`message/byroom?room_id=${roomProps._id}&page=${nextPage}&pageSize=25`)
            .then(res => {
                let newMessages = res.data.data
                console.log(newMessages);
                console.log(nextPage, 'nextPage');
                setLoading(false)
                if (newMessages.length !== 0) {
                    setMessage(previousState => [...newMessages, ...previousState])
                    setNextPage(nextPage => nextPage + 1)
                }
            }).catch(err => {
                console.log(err, "err");
                setLoading(false)
                if (err.response?.status <= 404) {
                    Toast(err.response.data.message);
                } else {
                    Toast(err.message);
                }
            })
    }

    isCloseToTop = ({ layoutMeasurement, contentOffset, contentSize }) => {
        const paddingToTop = 80;
        return contentSize.height - layoutMeasurement.height - paddingToTop <= contentOffset.y;
    }

    console.log(messages, 'messages');

    return (
        <View style={{ flex: 1, backgroundColor: "white" }}>
            <GiftedChat
                renderLoading={() => <ActivityIndicator animating={isLoading} size="large" color="#0000ff" />}
                messages={messages}
                onSend={message => onSend(message[0])}
                scrollToBottom={true}
                user={{
                    _id: userData.data._id
                }}
                listViewProps={{
                    scrollEventThrottle: 400,
                    onScroll: ({ nativeEvent }) => { if (isCloseToTop(nativeEvent)) loadMoreMessage(); }
                }}
            />
        </View>
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
        setNewMessage: data => dispatch(createAction("SET_NEW_MESSAGE", data)),
    };
};

// Exports
export default connect(mapStateToProps, mapDispatchToProps)(ChatScreen);
