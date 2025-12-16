import axios from 'axios';
import authStore from '../stores/authStore';



export const BASE_URL = 'http://localhost:3000/v1/api'; // Replace with your backend API base URL

const authInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        "Accept": "application/json",
    },
    withCredentials: true,
});

const instance = axios.create({
    baseURL: BASE_URL, // Replace with your backend API base URL
    headers: {
        'Content-Type': 'application/json',
        "Accept": "application/json",
    },
    withCredentials: true,
});


instance.interceptors.request.use(
    (config) => {

        console.log("Access token found in store:", config);
        const accessToken = authStore.getState().accessToken;
        if (!accessToken) return config;


        if ((config.url?.startsWith("/documents") || config.url?.startsWith("/ai") || config.url?.startsWith("/auth/me") || config.url?.startsWith("/auth/logout")) && accessToken) {
            config.headers.set('Authorization', `Bearer ${accessToken}`);
            console.log("Authorization header set in request");
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

instance.interceptors.response.use(
    res => res,
    async (err) => {
        const originalRequest = err.config;
        if (!err.response) {
            return Promise.reject(err);
        }

        if (originalRequest.url.includes('/auth/refresh')) {
            //TODO: Redirect to login page or show a message
            authStore.getState().clearAccessToken();
            return Promise.reject(err);
        }

        if (err.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                console.log("Attempting to refresh token");
                const res = await authInstance.post('/auth/refresh', {});
                const { accessToken } = res.data;
                authStore.getState().assignAccessToken(accessToken);

                instance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
                originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;

                return instance(originalRequest);

            } catch (err) {
                authStore.getState().clearAuth();
                return Promise.reject(err);
            }
        }
        return Promise.reject(err);
    }
);

export default instance;