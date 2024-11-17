import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext'; 
import { useNavigate } from 'react-router-dom'; 
import '../styles/Login.css'; 
import { Helmet, HelmetProvider } from 'react-helmet-async';

function Login() {
    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate(); 
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); 

    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        if (token) {
            login(token); 
        }
    }, [login]); 

   
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

   const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
        const response = await fetch(process.env.REACT_APP_API_URL + '/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            setError('Невалидно корисничко име или лозинка.');
            throw new Error(`Login failed: ${errorText}`);
        }

        const data = await response.json();
        const { token, userInfo } = data;

        localStorage.setItem('jwtToken', token);
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        login(token); 
        navigate('/');
    } catch (error) {
        console.error('Error:', error);
        setError('Невалидно корисничко име или лозинка.');
    } finally {
        setLoading(false);
    }
};

    return (
        <div className="login-container">
            <HelmetProvider>
                <Helmet>
                    <title>Најава</title>
                </Helmet>
            </HelmetProvider>
            <h1>Ве молиме најавете се:</h1>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleLogin}>
                <input
                    type="text"
                    name="username"
                    placeholder="Корисничко име"
                    value={username}
                    onChange={(e) => {
                        setUsername(e.target.value);
                        setError(''); 
                    }}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Лозинка"
                    value={password}
                    onChange={(e) => {
                        setPassword(e.target.value);
                        setError(''); 
                    }}
                    required
                />
                <input type="submit" value={loading ? "Ве молам, почекајте..." : "Најави се"} disabled={loading} /> {/* Loading state */}
            </form>
        </div>
    );
}

export default Login;
