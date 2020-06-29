import axios from "axios";
import AsyncStorage from '@react-native-community/async-storage';
import config from "../config";

const Axios = axios.create({
    baseURL: config.API_BASE_URL,
    timeout: 500
});
Axios.interceptors.request.use(async config => {
    const token = await AsyncStorage.getItem('token')
    config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export default Axios