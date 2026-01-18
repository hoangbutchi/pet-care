import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:3001/api', // Direct connection to server
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

            console.log("401 Error detected:", {
                url: error.config?.url,
                token: userInfo?.token?.substring(0, 20) + '...',
                currentPath: window.location.pathname
            });

            if (userInfo && userInfo.token === 'mock-token') {
                console.warn("401 with mock-token. Ignoring redirect to prevent loop.");
                return Promise.reject(error);
            }

            // Don't redirect if we're already on login page or if it's just a failed API call
            if (window.location.pathname === '/login') {
                console.warn("Already on login page, not redirecting");
                return Promise.reject(error);
            }

            // Only redirect for critical auth failures, not for optional API calls
            const criticalEndpoints = ['/auth/me', '/auth/verify'];
            const isCriticalAuth = criticalEndpoints.some(endpoint => 
                error.config?.url?.includes(endpoint)
            );

            if (isCriticalAuth) {
                console.log("Critical auth failure, redirecting to login");
                localStorage.removeItem('userInfo');
                window.location.href = '/login';
            } else {
                console.warn("Non-critical 401 error, not redirecting:", error.config?.url);
            }
        }
        return Promise.reject(error);
    }
);

export default instance;
