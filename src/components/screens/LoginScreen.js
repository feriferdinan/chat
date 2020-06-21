import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native'

export default function LoginScreen({ navigation }) {
    return (
        <TouchableOpacity style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text >Login</Text>
        </TouchableOpacity>
    )
}
