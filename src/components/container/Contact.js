import React, { useEffect, forwardRef } from 'react';
import { PermissionsAndroid, Animated } from 'react-native';
import Contacts from 'react-native-contacts';
import { connect } from 'react-redux'
import { createAction } from '../../utils/createAction'
import Axios from '../../utils/Axios'
import ListContact from '../presentation/ListContact';

const Contact = forwardRef(({ navigation, setMyContact, myContacts, userData, handleScroll, handleSnap, headerHeight, contactRef, ...props }, ref) => {

    checkContact = phone_number => Axios.post(`user/check`, { phone_number })
        .then(res => {
            setMyContact(res.data.data)
        })
        .catch(err => console.log(err))

    getContact = () => PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.WRITE_CONTACTS,
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
    ]).then(() => Contacts.getAll((err, contacts) => {
        if (err === "denied") {
            console.log("permissionDenied");
        } else {
            const phoneNumbers = contacts.map(c => c.phoneNumbers.map(p => p.number)).flat().filter(f => f != userData.data.phone_number)
            checkContact(phoneNumbers)
        }
    })
    );

    useEffect(() => {
        getContact()
    }, []);

    return (
        <Animated.FlatList
            scrollEventThrottle={16}
            onScroll={handleScroll}
            onMomentumScrollEnd={handleSnap}
            data={myContacts.data}
            renderItem={ListContact}
            keyExtractor={(item, index) => item._id}
            ref={contactRef}
            {...props}
        />
    );
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

export default connect(mapStateToProps, mapDispatchToProps)(Contact)