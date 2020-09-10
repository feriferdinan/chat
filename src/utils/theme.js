import { DefaultTheme } from 'react-native-paper';
import config from '../config'

export const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: config.BASE_COLOR,
        secondary: '#F92A82',
        error: '#f13a59',
        light: "#F8F8F8",
        grey: "#9FA8B2",
        white: "#fff",
        black: "#1F2833"
    },
};
