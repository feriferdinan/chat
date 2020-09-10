import React, { useEffect, useRef } from 'react';
import { View, PermissionsAndroid, SafeAreaView, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import Contacts from 'react-native-contacts';
import { List, Avatar, Divider, Text } from 'react-native-paper';
import { connect } from 'react-redux'
import { createAction } from '../utils/createAction'
import IconAnt from 'react-native-vector-icons/AntDesign'
import Axios from '../utils/Axios'
import getCloser from '../utils/getCloser';
import Header from '../components/Header'


const { diffClamp } = Animated;
const headerHeight = 58 * 2;

function ContactListScreen({ navigation, setMyContact, myContacts, userData }) {

    checkContact = phone_number => Axios.post(`user/check`, { phone_number })
        .then(res => {
            setMyContact(res.data.data)
        })
        .catch(err => console.log(err))

    getContact = () => PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.WRITE_CONTACTS,
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
    ]).then(() => {
        Contacts.getAll((err, contacts) => {
            if (err === "denied") {
                console.log("permissionDenied");
            } else {
                const phoneNumbers = contacts.map(c => c.phoneNumbers.map(p => p.number)).flat().filter(f => f != userData.data.phone_number)
                checkContact(phoneNumbers)
            }
        });
    });

    useEffect(() => {
        getContact()
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
                    title={"Contact"}
                    headerLeft={<View style={{ width: 25 }}></View>}
                    headerRight={<TouchableOpacity onPress={() => alert("add contact")}><IconAnt name="plus" size={25} color={"#fff"} /></TouchableOpacity>} />
            </Animated.View>
            <Animated.FlatList
                scrollEventThrottle={16}
                contentContainerStyle={{ paddingTop: headerHeight }}
                onScroll={handleScroll}
                ref={ref}
                onMomentumScrollEnd={handleSnap}
                data={myContacts.data}
                renderItem={({ item, index }) =>
                    <>
                        <List.Item
                            onPress={() => alert("ok")}
                            key={index}
                            title={item.name}
                            description={"online"}
                            left={props => item.avatar ? < Avatar.Image size={40} source={{ uri: item.avatar }} /> : <Avatar.Text size={40} label={item.name} />}
                        />
                        <Divider />
                    </>}
                keyExtractor={(item, index) => `list-item-${index}`}
            />
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

const mapStateToProps = state => {
    return {
        myContacts: state.contactReducer,
        userData: state.userReducer
    }
}

const mapDispatchToProps = dispacth => {
    return {
        setMyContact: data => dispacth(createAction("SET_CONTACT", data))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ContactListScreen)