import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        if (token) {
            const decodedToken = jwtDecode(token);
            const isExpired = decodedToken.exp * 1000 < Date.now(); 
            if (!isExpired) {
                setIsAuthenticated(true);
            } else {
                localStorage.removeItem('jwtToken');
            }
        }
        setLoading(false); 
    }, []);

    const login = (token,userInfo) => {
        localStorage.setItem('jwtToken', token); 
        localStorage.setItem('userInfo', userInfo); 
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem('jwtToken'); 
        localStorage.removeItem('userInfo'); 
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
