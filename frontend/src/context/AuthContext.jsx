import { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import { useCartStore } from '../store/cartStore';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { initializeCart } = useCartStore();

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (userInfo) {
            setUser(userInfo);
        }
        setLoading(false);
    }, []);

    // Initialize cart when user changes (login/logout)
    useEffect(() => {
        initializeCart();
    }, [user, initializeCart]);

    const login = async (email, password) => {
        try {
            const { data } = await axios.post('/auth/login', { email, password });
            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            
            // Role-based redirect
            if (data.user?.role === 'ADMIN') {
                navigate('/admin/products');
            } else {
                navigate('/');
            }
            
            return { success: true };
        } catch (error) {
            console.error("Login API Error:", error);
            console.error("Error details:", error.response?.data);
            console.error("Error status:", error.response?.status);
            
            return { success: false, message: error.response?.data?.message || 'Login failed' };
        }
    };

    const register = async (userData) => {
        try {
            const { data } = await axios.post('/auth/register', userData);
            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            navigate('/');
            return { success: true };
        } catch (error) {
            console.error("Register API Error:", error);
            return { success: false, message: error.response?.data?.message || 'Registration failed' };
        }
    };

    const logout = () => {
        // Don't clear cart - let it persist for when user logs back in
        // The cart will be automatically saved when user changes in cartStore
        
        setUser(null);
        localStorage.removeItem('userInfo');
        navigate('/login');
    };

    const isAdmin = () => {
        return user?.user?.role === 'ADMIN' || user?.role === 'ADMIN';
    };

    const isValidToken = () => {
        return user?.token && user.token !== 'mock-token' && user.token.length > 10;
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading, isAdmin, isValidToken }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
