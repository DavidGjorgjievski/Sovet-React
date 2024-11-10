import React, { useEffect } from 'react';
import '../styles/Logout.css'; 
import { Helmet, HelmetProvider } from 'react-helmet-async';

const Logout = () => {

    useEffect(() => {
    const logoutUser = () => {
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('userInfo');
        console.log('Successfully logged out');
    };

    logoutUser();
}, []);
    return (
        <div className="logout-container">
            <HelmetProvider>
                <Helmet>
                    <title>Одјава</title>
                </Helmet>
            </HelmetProvider>
            <h1>Успешно сте одјавени!</h1>
            <p>Ви благодариме што ја искористивте нашата апликација.</p>
            <button onClick={() => window.location.href = '/login'} className="login-button">Најави се повторно</button>
        </div>
    );
};

export default Logout;
