import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true); // Added loading state

    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        if (token) {
            const decodedToken = jwtDecode(token);
            const isExpired = decodedToken.exp * 1000 < Date.now(); // Check if the token is expired
            if (!isExpired) {
                setIsAuthenticated(true);
            } else {
                localStorage.removeItem('jwtToken'); // Remove expired token
            }
        }
        setLoading(false); // Set loading to false after checking
    }, []);

    const login = (token) => {
        localStorage.setItem('jwtToken', token); // Store the JWT in local storage
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem('jwtToken'); // Remove the token on logout
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
