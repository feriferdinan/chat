import React from 'react';
import { StyleSheet, Text, View, TextInput } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'
import IconAnt from 'react-native-vector-icons/AntDesign'
import SearchBar from 'react-native-search-bar';

const Search = ({ headerHeight, value, style, ...props }) => {
    return (
        <View
            style={[
                styles.subHeader,
                {
                    height: headerHeight / 2,
                },
            ]}>
            <View style={[styles.searchBox, { ...style },]} {...props}>
                <IconAnt name="search1" size={16} color={"#8B8B8B"} />
                <Text style={styles.searchText}>Search</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    subHeader: {
        width: '100%',
        paddingHorizontal: 10,
        backgroundColor: '#1c1c1c',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    conversation: { color: 'white', fontSize: 24, fontWeight: 'bold' },
    searchText: {
        color: '#8B8B8B',
        fontSize: 17,
        lineHeight: 22,
        marginLeft: 8,
    },
    searchBox: {
        color: '#8B8B8B',
        paddingVertical: 8,
        paddingHorizontal: 10,
        backgroundColor: '#0F0F0F',
        borderRadius: 10,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
});
export default Search;
