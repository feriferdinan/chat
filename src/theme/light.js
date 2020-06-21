import { DefaultTheme } from '@react-navigation/native';
import config from '../config'
export const lightTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: 'white',
        primary: config.BASE_COLOR,
        text: 'black',
    },
};