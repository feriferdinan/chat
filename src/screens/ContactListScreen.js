import React, { useRef, createRef, useEffect } from 'react';
import { View, SafeAreaView, StyleSheet, Animated, TouchableOpacity, Keyboard } from 'react-native';
import { connect } from 'react-redux'
import { createAction } from '../utils/createAction'
import IconAnt from 'react-native-vector-icons/AntDesign'
import getCloser from '../utils/getCloser';
import Header from '../components/Header'
import Contact from '../components/container/Contact';
import Search from '../components/Search';


const { diffClamp } = Animated;
const headerHeight = 58 * 2;

function ContactListScreen({ navigation }) {

    const contactRef = createRef();

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


    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
                navigation.setOptions({ tabBarVisible: false })
            }
        );
        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                navigation.setOptions({ tabBarVisible: true })
            }
        );

        return () => {
            keyboardDidHideListener.remove();
            keyboardDidShowListener.remove();
        };
    }, []);




    return (
        <SafeAreaView style={styles.container}>
            <Animated.View style={[styles.header, { transform: [{ translateY }] }]}>
                <Header
                    {...{ headerHeight }}
                    title={"Contact"}
                    subHeader={<Search headerHeight={headerHeight} />}
                    headerLeft={<View style={{ width: 25 }}></View>}
                    headerRight={<TouchableOpacity onPress={() => alert("add contact")}><IconAnt name="plus" size={25} color={"#fff"} /></TouchableOpacity>} />
            </Animated.View>
            <Contact
                contentContainerStyle={{ paddingTop: headerHeight }}
                {...{
                    contactRef,
                    handleScroll,
                    handleSnap,
                    headerHeight,
                }}
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