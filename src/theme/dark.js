import { DarkTheme } from '@react-navigation/native';
import config from '../config'

export const darkTheme = {
    ...DarkTheme,
    colors: {
        ...DarkTheme.colors,
        background: '#1c1c1c',
        primary: config.BASE_COLOR,
        text: 'white',
    },
};