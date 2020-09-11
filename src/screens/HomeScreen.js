import React, { useEffect, useState, useRef, } from 'react';
import { Animated, StyleSheet, SafeAreaView, View, Text, TouchableOpacity, Dimensions } from "react-native";
import SocketIo from 'socket.io-client';
import config from '../config';
import { connect } from 'react-redux'
import Axios from '../utils/Axios'
import { createAction } from '../utils/createAction'
import Toast from '../components/Toast'
import getCloser from '../utils/getCloser';
import Header from '../components/Header'
import ListChat from '../components/ListChat'
import Entypo from 'react-native-vector-icons/Entypo'
import IconIon from 'react-native-vector-icons/Ionicons'
import { Modalize } from 'react-native-modalize';
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window")
import { getStatusBarHeight } from 'react-native-status-bar-height';

const { diffClamp } = Animated;
const headerHeight = 58 * 2;
let socket

function HomeScreen({ navigation, userData, messageData, setMessage }) {

    const [isLoading, setLoading] = useState(false);

    const modalizeRef = useRef(null);


    getMessage = () => {
        setLoading(true)
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
                messageData.data?.map(el => {
                    if (el._id == message.room_id) {
                        el.messages = [message, ...el.messages]
                    }
                })
                setMessage(messageData.data)
            }
        });
        getMessage()
    }, []);



    const ref = useRef(null);

    const scrollY = useRef(new Animated.Value(0));
    const scrollYClamped = diffClamp(scrollY.current, 0, headerHeight);

    const translateY = scrollYClamped.interpolate({
        inputRange: [0, headerHeight],
        outputRange: [0, -(headerHeight / 2)],
    });

    const translateYNumber = useRef();

    translateY.addListener(({ value }) => {
        translateYNumber.current = value;
    });

    const handleScroll = Animated.event(
        [
            {
                nativeEvent: {
                    contentOffset: { y: scrollY.current },
                },
            },
        ],
        {
            useNativeDriver: true,
        },
    );

    const handleSnap = ({ nativeEvent }) => {
        const offsetY = nativeEvent.contentOffset.y;
        if (
            !(
                translateYNumber.current === 0 ||
                translateYNumber.current === -headerHeight / 2
            )
        ) {
            if (ref.current) {
                ref.current.scrollToOffset({
                    offset:
                        getCloser(translateYNumber.current, -headerHeight / 2, 0) ===
                            -headerHeight / 2
                            ? offsetY + headerHeight / 2
                            : offsetY - headerHeight / 2,
                });
            }
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Animated.View style={[styles.header, { transform: [{ translateY }] }]}>
                <Header
                    {...{ headerHeight }}
                    title={isLoading ? "Updating..." : "Chat"}
                    headerLeft={<Entypo name="menu" size={25} color={"#fff"} />}
                    headerRight={<TouchableOpacity onPress={() => modalizeRef.current?.open()}><IconIon name="create-outline" size={25} color={"#fff"} /></TouchableOpacity>} />
            </Animated.View>
            <Animated.FlatList
                scrollEventThrottle={16}
                contentContainerStyle={{ paddingTop: headerHeight }}
                onScroll={handleScroll}
                ref={ref}
                onMomentumScrollEnd={handleSnap}
                data={messageData.data}
                renderItem={({ item, index
                }) => <ListChat key={index} item={item} navigation={navigation} index={index} userData={userData} />}
                keyExtractor={(item, index) => `list-item-${index}`}
            />

            <Modalize
                ref={modalizeRef}
                scrollViewProps={{ showsVerticalScrollIndicator: false }}
                // snapPoint={300}
                modalHeight={SCREEN_HEIGHT - 70}
                HeaderComponent={
                    <Animated.View style={[styles.header, { transform: [{ translateY }] }]}>
                        <Header
                            {...{ headerHeight }}
                            title={"New Chat"}
                            headerLeft={<Text>Cancel</Text>}
                            headerRight={<View></View>} />
                    </Animated.View>
                }
                withHandle={false}
            >
                <Text>TES</Text>
            </Modalize>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    header: {
        position: 'absolute',
        backgroundColor: '#1c1c1c',
        left: 0,
        right: 0,
        width: '100%',
        zIndex: 1,
    },
    subHeader: {
        height: headerHeight / 2,
        width: '100%',
        paddingHorizontal: 10,
    },
    container: {
        flex: 1,
    }
})


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