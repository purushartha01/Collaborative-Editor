import axios from 'axios';

export const BASE_URL = 'http://localhost:3000/v1/api'; // Replace with your backend API base URL

const instance = axios.create({
    baseURL: BASE_URL, // Replace with your backend API base URL
    headers: {
        'Content-Type': 'application/json',
        "Accept": "application/json",
    },
});


instance.interceptors.request.use(
    (config) => {
        if(config.url){
            config.headers['Authorization'] = `Bearer ${localStorage.getItem('access-token')}`;
        }
            return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default instance;