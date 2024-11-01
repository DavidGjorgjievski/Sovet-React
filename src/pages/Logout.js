import React, { useEffect } from 'react';
import axios from 'axios'; 
import '../styles/Logout.css'; 
import { Helmet, HelmetProvider } from 'react-helmet-async';

const Logout = () => {

    useEffect(() => {
        const logoutUser = async () => {
            try {
                await axios.post(process.env.REACT_APP_API_URL + 'api/logout', null, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('jwtToken')}` 
                    }
                });

                // Clear the token and userInfo
                localStorage.removeItem('jwtToken');
                localStorage.removeItem('userInfo'); 

                console.log('Successfully logged out');
            } catch (error) {
                console.error('Error logging out:', error);
            }
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
