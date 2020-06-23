import React from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';

import config from '../config';
import { createAction } from '../utils/createAction';

export function useAuth() {
    const [state, dispatch] = React.useReducer(
        (state, action) => {
            switch (action.type) {
                case 'SET_USER':
                    return {
                        ...state,
                        user: { ...action.payload },
                    };
                case 'REMOVE_USER':
                    return {
                        ...state,
                        user: undefined,
                    };
                case 'SET_LOADING':
                    return {
                        ...state,
                        loading: action.payload,
                    };
                default:
                    return state;
            }
        },
        {
            user: undefined,
            loading: true,
        },
    );
    const auth = React.useMemo(
        () => ({
            login: async (param) => {
                const { data } = await axios.post(`${config.API_BASE_URL}/auth/login`, {
                    email: param.email,
                    password: param.password
                });
                const user = {
                    userdata: data.data,
                    token: data.token,
                };
                console.log(data, 'data');
                await AsyncStorage.setItem('user', JSON.stringify(user));
                dispatch(createAction('SET_USER', user));

            },
            logout: async () => {
                await AsyncStorage.clear();
                dispatch(createAction('REMOVE_USER'));
            },
            register: async (param) => {
                await axios.post(`${config.API_BASE_URL}/auth/register`, {
                    email: param.email,
                    password: param.password,
                    phone_number: param.phone_number,
                });
            },
        }),
        [],
    );
    React.useEffect(() => {
        AsyncStorage.getItem('user').then(user => {
            if (user) {
                dispatch(createAction('SET_USER', JSON.parse(user)));
            }
            dispatch(createAction('SET_LOADING', false));
        });
    }, []);
    return { auth, state };
}