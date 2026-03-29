import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [accessToken, setAccessToken] = useState(null);
    const [refreshToken, setRefreshToken] = useState(null);
    const [error, setError] = useState(null);

    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

    // Initialize auth on mount
    useEffect(() => {
        const initializeAuth = async () => {
            try {
                // Check localStorage for tokens
                const storedAccessToken = localStorage.getItem('accessToken');
                const storedRefreshToken = localStorage.getItem('refreshToken');
                const storedUser = localStorage.getItem('user');

                if (storedAccessToken && storedUser) {
                    try {
                        const userData = JSON.parse(storedUser);
                        setUser(userData);
                        setAccessToken(storedAccessToken);
                        setRefreshToken(storedRefreshToken);
                        setIsAuthenticated(true);

                        // Try to refresh token to verify it's still valid
                        if (storedRefreshToken) {
                            try {
                                const response = await axios.post(
                                    `${BACKEND_URL}/api/auth/refresh-token`,
                                    { refresh_token: storedRefreshToken }
                                );

                                setAccessToken(response.data.access_token);
                                localStorage.setItem('accessToken', response.data.access_token);
                            } catch (refreshError) {
                                console.warn('Token refresh failed, clearing auth', refreshError);
                                logout();
                            }
                        }
                    } catch (parseError) {
                        console.error('Error parsing stored auth:', parseError);
                        localStorage.removeItem('user');
                        localStorage.removeItem('accessToken');
                        localStorage.removeItem('refreshToken');
                    }
                }
            } catch (err) {
                console.error('Auth initialization error:', err);
            } finally {
                setIsLoading(false);
            }
        };

        initializeAuth();
    }, []);

    // Setup axios interceptor for adding auth tokens
    useEffect(() => {
        const interceptor = axios.interceptors.request.use((config) => {
            if (accessToken && !config.url?.includes('/auth/')) {
                config.params = config.params || {};
                config.params.token = accessToken;
            }
            return config;
        });

        return () => {
            axios.interceptors.request.eject(interceptor);
        };
    }, [accessToken]);

    const login = (userData, newAccessToken, newRefreshToken) => {
        setUser(userData);
        setAccessToken(newAccessToken);
        setRefreshToken(newRefreshToken);
        setIsAuthenticated(true);
        setError(null);

        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('accessToken', newAccessToken);
        if (newRefreshToken) {
            localStorage.setItem('refreshToken', newRefreshToken);
        }
    };

    const logout = () => {
        setUser(null);
        setAccessToken(null);
        setRefreshToken(null);
        setIsAuthenticated(false);
        setError(null);

        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
    };

    const setAuthError = (errorMessage) => {
        setError(errorMessage);
    };

    const value = {
        user,
        isAuthenticated,
        isLoading,
        accessToken,
        refreshToken,
        error,
        login,
        logout,
        setAuthError,
        BACKEND_URL
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
