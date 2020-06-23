import * as types from './../types';
import AsyncStorage from '@react-native-community/async-storage';

const initialState = {
    data: {},
    error: null,
    field: null,
    isLoading: false,
    isLogin: false,
    isError: false,
    message: null
}

function auth(state = initialState, action) {
    switch (action.type) {
        case types.LOGIN:
            return {
                ...state,
                isLoading: false,
            };
        case "LOGIN_PENDING":
            return {
                ...state,
                isLoading: true,
            };
        case "LOGIN_FULFILLED":
            return {
                ...state,
                isLoading: false,
                isLogin: true,
                data: action.payload.data,
            };
        case "LOGIN_REJECTED":
            return {
                ...state,
                isLoading: false,
                isLogin: false,
                isError: true,
                message: action.payload.response.data.message,

            };
        case types.REGISTER:
            return {
                ...state,
                isLoading: false,
            };
        case "REGISTER_PENDING":
            return {
                ...state,
                isLoading: true,
            };
        case "REGISTER_FULFILLED":
            return {
                ...state,
                isLoading: false,
                isLogin: true,
                data: action.payload.data,
            };
        case "REGISTER_REJECTED":
            return {
                ...state,
                isLoading: false,
                isLogin: false,
                error: action.payload.message,

            };
        case types.LOGOUT:
            AsyncStorage.removeItem('persist:root')
            return initialState
        default:
            return state
    }
}


export default {
    auth
}