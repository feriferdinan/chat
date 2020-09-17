import React from 'react';
import { StyleSheet, Text, View, TextInput } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'
import IconAnt from 'react-native-vector-icons/AntDesign'
const Header = props => {
  const { headerHeight, title, headerLeft, headerRight, subHeader } = props;
  return (
    <>
      <View
        style={[
          styles.subHeader,
          {
            height: headerHeight / 2,
          },
        ]}>
        {headerLeft}
        <Text style={styles.title}>{title}</Text>
        {headerRight}
      </View>
      {subHeader}
    </>
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
  title: { color: 'white', fontSize: 24, fontWeight: 'bold' },
  searchText: {
    color: '#8B8B8B',
    fontSize: 17,
    lineHeight: 22,
    marginLeft: 8,
  },
  searchBox: {
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
export default Header;
