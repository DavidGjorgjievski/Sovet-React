import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; // Import useNavigate
import { Helmet, HelmetProvider } from 'react-helmet-async'; // Import Helmet
import HeadLinks from '../components/HeadLinks'; // Import HeadLinks
import Header from '../components/Header'; // Import Header
import { initializeMobileMenu } from '../components/mobileMenu'; // Import mobile menu functionality
import '../styles/AddSessionForm.css'; // Assuming you have some styles

function AddSessionForm() {
    const [name, setName] = useState('');
    const [date, setDate] = useState(() => {
        const today = new Date();
        // Format date to yyyy-mm-dd
        return today.toISOString().split('T')[0]; 
    });
    const { id } = useParams();
    const navigate = useNavigate(); // Use useNavigate hook

    const userInfo = JSON.parse(localStorage.getItem('userInfo')) || {}; // Retrieve userInfo from local storage

       useEffect(() => {
        const fetchSession = async () => {
            if (id) {
                const jwtToken = localStorage.getItem('jwtToken');
                try {
                    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/sessions/${id}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${jwtToken}`, 
                        },
                    });

                    if (!response.ok) {
                        throw new Error('Failed to fetch session');
                    }

                    const sessionData = await response.json();
                    setName(sessionData.name);
                    setDate(sessionData.date);
                } catch (error) {
                    console.error('Error fetching session:', error);
                }
            }
        };

        fetchSession(); 
    }, [id]); 


    

    const handleSubmit = async (event) => {
        event.preventDefault();

        const sessionData = { name, date };

        const jwtToken = localStorage.getItem('jwtToken');
        console.log('JWT Token:', jwtToken);

        try {
        // Set the URL based on whether it's editing or adding a session
        const url = id 
            ? `${process.env.REACT_APP_API_URL}/api/sessions/edit/${id}` 
            : `${process.env.REACT_APP_API_URL}/api/sessions/add`;

        const method = id ? 'PUT' : 'POST'; // Use PUT for edit, POST for add

        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`, 
            },
            body: JSON.stringify(sessionData),
        });

        if (!response.ok) {
            throw new Error(`Failed to ${id ? 'edit' : 'add'} session`);
        }

        navigate('/sessions'); // Redirect to sessions page
    } catch (error) {
            console.error(`Error ${id ? 'editing' : 'adding'} session:`, error);
        }
    };

  const handleBack = () => {
    if (id) {
        navigate(`/sessions#session-${id}`); // Navigate to the specific session
    } else {
        navigate('/sessions'); // Navigate back to the sessions page
    }
};

    // Initialize mobile menu on component mount
    useEffect(() => {
        const cleanupMobileMenu = initializeMobileMenu();
        return () => {
            cleanupMobileMenu(); // Cleanup on unmount
        };
    }, []);

    return (
        <HelmetProvider>
            <div className="add-session-container">
                <Helmet>
                     <title>{id ? 'Уреди Седница' : 'Додади Седница'}</title>
                </Helmet>
                <HeadLinks /> 
                <Header userInfo={userInfo} /> 

                <div className="add-session-body-container container">
                    <div className="container">
                        <div className="add-session-header-div mt-2">
                            <h1>{id ? 'Уреди седница' : 'Додади седница'}</h1>
                        </div>
                        <div className="row justify-content-center">
                            <div className="col-md-6">
                                <form onSubmit={handleSubmit}>
                                    <div className="form-group">
                                        <label htmlFor="name" className="label-add">Име на седница:</label>
                                        <input
                                            type="text"
                                            className="form-control form-control-lg mb-2"
                                            id="name"
                                            name="name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                            placeholder="Внеси име на седница"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="date" className="label-add">Дата на седница:</label>
                                        <input
                                            type="date"
                                            className="form-control form-control-lg mb-2"
                                            id="date"
                                            name="date"
                                            value={date}
                                            onChange={(e) => setDate(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="mt-3 d-flex">
                                        <button type="submit" className={`btn ${id ? 'btn-warning' : 'btn-primary'} btn-lg me-2`}>
                                            {id ? 'Уреди' : 'Додади'} {/* Dynamic button text */}
                                        </button>
                                        <button type="button" className="btn btn-danger btn-lg" onClick={handleBack}>Назад</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>  
                </div>
            </div>
        </HelmetProvider>
    );
}

export default AddSessionForm;
