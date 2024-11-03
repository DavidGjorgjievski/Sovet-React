import React, { useEffect, useState } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import '../styles/Sessions.css'; 
import Header from '../components/Header';
import HeadLinks from '../components/HeadLinks';
import { initializeMobileMenu } from '../components/mobileMenu';
import SessionConfirmModal from '../components/SessionConfirmModal';

function Sessions() {
    const [sessions, setSessions] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedSession, setSelectedSession] = useState(null);
    const [loading, setLoading] = useState(true); // Step 1: Add loading state

    // Retrieve userInfo from local storage
    const userInfo = JSON.parse(localStorage.getItem('userInfo')) || {};
    
    useEffect(() => {
        const token = localStorage.getItem('jwtToken'); 
        console.log('Token:', token);

        // Fetch sessions from the API
        const fetchSessions = async () => {
            setLoading(true); // Start loading
            try {
                const response = await fetch(process.env.REACT_APP_API_URL + '/api/sessions', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                setSessions(data);
            } catch (error) {
                console.error('Error fetching sessions:', error);
            } finally {
                setLoading(false); // Stop loading
            }
        };

        fetchSessions();

        const cleanupMobileMenu = initializeMobileMenu();

        return () => {
            cleanupMobileMenu(); 
        };
    }, []);

    // Scroll to the session based on the URL hash
    useEffect(() => {
        const hash = window.location.hash;
        if (hash) {
            const element = document.getElementById(hash.substring(1)); // Remove the '#' from the hash
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' }); // Smooth scroll to the element
            }
        }
    }, [sessions]); // Depend on sessions to ensure the DOM is updated before scrolling

    const handleDeleteClick = (session) => {
        setSelectedSession(session);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedSession(null);
    };

    const handleConfirmDelete = async () => {
        if (selectedSession) {
            try {
                const token = localStorage.getItem('jwtToken');
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/sessions/delete/${selectedSession.id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to delete session');
                }

                setSessions(sessions.filter((session) => session.id !== selectedSession.id));
                handleCloseModal();
            } catch (error) {
                console.error('Error deleting session:', error);
            }
        }
    };

    const handleExportClick = async (sessionId, sessionName) => { 
        try {
            const token = localStorage.getItem('jwtToken');
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/sessions/export/${sessionId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/pdf'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to export session');
            }

            const blob = await response.blob();

            let filename = sessionName ? `${sessionName}.pdf` : 'session.pdf'; 
            const url = window.URL.createObjectURL(blob);
            
            // Open the PDF in a new tab
            const newTab = window.open(url, '_blank'); 
            if (newTab) {
                setTimeout(function () {
                    newTab.document.title = filename;
                }, 15);
            } else {
                console.error('Failed to open new tab. Please check your popup blocker settings.');
            }

        } catch (error) {
            console.error('Error exporting session:', error);
        }
    };

    return (
        <div className="sessions-container">
            <HelmetProvider>
                <Helmet>
                    <title>Седници</title>
                </Helmet>
            </HelmetProvider>
            <HeadLinks />
            <Header userInfo={userInfo} /> 
            <main className="session-body-container">
                {userInfo.role === 'ROLE_ADMIN' ? (
                    <div className="session-header">
                        <p className="session-header-title">Седници</p>
                        <div className="session-button-container">
                            <a href="/sessions/add-form">
                                <button className="session-add-button">Додади Седница</button>
                            </a>
                        </div>
                    </div>
                ) : (
                    <div className="session-header">
                        <h1>Седници</h1>
                    </div>
                )}

                <div className="session-body">
                    {loading ? ( 
                        <div className="loading-spinner">
                            <img src={`${process.env.PUBLIC_URL}/images/loading.svg`} alt="Loading..." />
                        </div>
                    ) : sessions.length > 0 ? (
                        sessions.map((session) => (
                            <div key={session.id} className="session-item">
                                <span id={`session-${session.id}`} className='id-selector-session'></span>
                                <img src={`${process.env.PUBLIC_URL}/images/image_session.jpg`} alt="session" className="session-image" />
                                <div className="session-info">
                                    <div className="session-text">
                                        <h2>{session.name}</h2>
                                        <p>{new Date(session.date).toLocaleDateString('en-GB')}</p>
                                    </div>
                                    <div className="all-session-buttons">
                                        <div className="d-flex flex-row">
                                            <div>
                                                <div className="first-session-button">
                                                    <a href={`/sessions/${session.id}/topics`} className="btn btn-sm btn-info session-button-size">
                                                        Преглед на точки
                                                    </a>
                                                </div>
                                            </div>
                                            {userInfo.role !== 'ROLE_PRESENTER' && (
                                                <div>
                                                    <div className="export-button-div">
                                                        <button 
                                                            onClick={() => handleExportClick(session.id,session.name)}
                                                            className="btn btn-sm btn-primary session-button-size">
                                                            Експорт
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        {userInfo.role === 'ROLE_ADMIN' && ( 
                                            <div>
                                                <div className="d-flex align-items-center session-buttons">
                                                    <div className="first-session-button">
                                                        <a href={`/sessions/edit/${session.id}`} className="btn btn-sm btn-warning session-button-size">
                                                            Уреди
                                                        </a>
                                                    </div>
                                                    <button 
                                                        className="btn btn-sm btn-danger session-button-size"
                                                        onClick={() => handleDeleteClick(session)}>
                                                        Избриши
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className='mt-3'>
                            <h4>Нема достапни седници</h4>
                        </div>
                    )}
                </div>

                <SessionConfirmModal
                    show={showModal}
                    onClose={handleCloseModal}
                    onConfirm={handleConfirmDelete}
                    sessionName={selectedSession ? selectedSession.name : ''} 
                />
            </main>
        </div>
    );
}

export default Sessions;
