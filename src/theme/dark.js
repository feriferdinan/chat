import { DarkTheme } from '@react-navigation/native';
import config from '../config'

export const darkTheme = {
    ...DarkTheme,
    colors: {
        ...DarkTheme.colors,
        background: 'black',
        primary: config.BASE_COLOR,
        text: 'white',
    },
};