import {
    ToastAndroid,
    Platform,
    AlertIOS,
} from 'react-native';
Toast = text => {
    if (Platform.OS === 'android') {
        ToastAndroid.showWithGravityAndOffset(text, ToastAndroid.LONG, ToastAndroid.BOTTOM, 0, 200)
    } else {
        AlertIOS.alert(text);
    }
};

export default Toast
