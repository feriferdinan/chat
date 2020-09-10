import React, { memo } from 'react';
import { Image, StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const Logo = ({ source }) => (
  <Image source={source} style={styles.image} />
);

const styles = StyleSheet.create({
  image: {
    width: wp(50),
    // height: hp(50),
    marginBottom: 12,
    resizeMode: "contain"
  },
});

export default memo(Logo);
