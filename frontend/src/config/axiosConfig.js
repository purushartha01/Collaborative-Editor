import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:3000/v1', // Replace with your backend API base URL
    headers: {
        'Content-Type': 'application/json',
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