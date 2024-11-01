import React, { useEffect, useState } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import '../styles/Home.css';
import Header from '../components/Header';
import HeadLinks from '../components/HeadLinks';
import { useNavigate } from 'react-router-dom';
import { initializeMobileMenu } from '../components/mobileMenu';

function Home() {
    const [userInfo, setUserInfo] = useState(() => {
        const storedUserInfo = localStorage.getItem('userInfo');
        return storedUserInfo ? JSON.parse(storedUserInfo) : {}; // Parse and set to state
    });
    
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserInfo = async () => {
            const token = localStorage.getItem('jwtToken');

            try {
                const response = await fetch(process.env.REACT_APP_API_URL + "/api/home", {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setUserInfo(data.userInfo); // Assuming userInfo is in the response
                localStorage.setItem('userInfo', JSON.stringify(data.userInfo)); // Save to local storage

            } catch (error) {
                console.error("Error fetching user data:", error);
                navigate('/login');
            }
        };

        // Only fetch user info if it's not already populated
        if (Object.keys(userInfo).length === 0) {
            fetchUserInfo();
        }

        // Initialize the mobile menu functionality
        const cleanupMobileMenu = initializeMobileMenu();

        return () => {
            cleanupMobileMenu(); // Cleanup the event listeners
        };
    }, [navigate, userInfo]); // Add userInfo to the dependency array

    return (
        <div className="home-container">
            <HelmetProvider>
                <Helmet>
                    <title>Почетна</title>
                </Helmet>
            </HelmetProvider>
            <HeadLinks />
            <Header userInfo={userInfo} /> {/* Pass userInfo as a prop */}
            <main>
                <div className="introduction">
                    <div className="introduction-header text-center my-3">
                        <h1 className="display-4">Добредојде на системот за гласање на точки во седници на Општина Виница.</h1>
                    </div>
                    <div className="introduction-body">
                        <p className="lead">
                            Во секоја седница, се вклучуваат советници, меѓу кои и претседателот на советот, Ацо Ѓорѓиевски кој ја води самата седница, и градоначалникот Миле Петков.
                            Тие се одговорни за креирање и прифаќање на предлози кои влијаат на сите граѓани во општината.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Home;
