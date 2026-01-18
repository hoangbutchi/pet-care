import axios from 'axios';

const instance = axios.create({
    baseURL: '/api', // Enable baseURL for API calls
});

// Request interceptor to add the auth token header to every request
instance.interceptors.request.use(
    (config) => {
        const userInfo = localStorage.getItem('userInfo')
            ? JSON.parse(localStorage.getItem('userInfo'))
            : null;

        if (userInfo && userInfo.token) {
            config.headers.Authorization = `Bearer ${userInfo.token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle global errors like 401 Unauthorized
instance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            // Check if it's a mock token before redirecting (to prevent loop for demo user)
            const userInfo = localStorage.getItem('userInfo')
                ? JSON.parse(localStorage.getItem('userInfo'))
                : null;

            if (userInfo && userInfo.token === 'mock-token') {
                console.warn("401 with mock-token. Ignoring redirect to prevent loop.");
                return Promise.reject(error);
            }

            // Token expired or invalid
            localStorage.removeItem('userInfo');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default instance;
