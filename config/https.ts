import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const axiosInstance = axios.create({
    //baseURL: "http://10.0.2.2:8000"
    baseURL:"https://predictor-backend-omega.vercel.app"
});

axiosInstance.interceptors.request.use(
    async (config) => {
        try {
            const token = await AsyncStorage.getItem("pred-token");
            console.log('axios',token)
            if (token) {
                config.headers['Authorization'] = `Bearer ${JSON.parse(token)}`;
                config.headers['Content-Type'] = 'application/json';
            }
            return config;
        } catch (error) {
            // Handle AsyncStorage errors or token retrieval errors
            console.error('Failed to retrieve token from AsyncStorage:', error);
            return Promise.reject(error);
        }
    },
    (error) => {
        // Handle request errors here
        return Promise.reject(error);
    }
);

export default axiosInstance;
