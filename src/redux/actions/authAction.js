import * as types from "../types";
import config from "../../config";
import axios from 'axios';


export const login = (value) => ({
    type: types.LOGIN,
    payload: axios({
        method: "POST",
        url: `${config.API_BASE_URL}/auth/login`,
        data: {
            email: value.email,
            password: value.password
        }
    })
});

export const register = (value) => ({
    type: types.REGISTER,
    payload: axios({
        method: "POST",
        url: `${config.API_BASE_URL}/auth/register`,
        data: {
            username: value.username,
            email: value.email,
            phone_number: value.phone_number
        }
    })
});

export const logout = () => ({
    type: types.LOGOUT,
    payload: null
})

