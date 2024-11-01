import React, { useState, useEffect } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import Header from '../components/Header';
import HeadLinks from '../components/HeadLinks';
import { useNavigate, useParams } from 'react-router-dom';
import { initializeMobileMenu } from '../components/mobileMenu'; 
import '../styles/AddUserForm.css';

function EditUserForm() {
    const navigate = useNavigate();
    const { username } = useParams(); // Get the username from the URL parameters
    const userData = JSON.parse(localStorage.getItem('userInfo')) || {};
    const [token, setToken] = useState('');

    useEffect(() => {
        const retrievedToken = localStorage.getItem('jwtToken');
        setToken(retrievedToken);
    }, []);

    const [formData, setFormData] = useState({
        username: '',
        name: '',
        surname: '',
        role: 'ROLE_USER',
        status: 'ACTIVE',
    });

    const roles = ["ROLE_ADMIN", "ROLE_USER", "ROLE_SPECTATOR", "ROLE_PRESENTER"];
    const statuses = ["ACTIVE", "INACTIVE"];

    useEffect(() => {
        const cleanupMobileMenu = initializeMobileMenu();
        return () => {
            cleanupMobileMenu();
        };
    }, [navigate]);

    // Fetch user data to populate the form
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/admin/user/${username}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const user = await response.json();
                    setFormData({
                        username: user.username || '',
                        name: user.name || '',
                        surname: user.surname || '',
                        role: user.role || 'ROLE_USER',
                        status: user.status || 'ACTIVE',
                    });
                } else {
                    console.error('Failed to fetch user data');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, [username, token]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const submissionData = new URLSearchParams();
    submissionData.append('name', formData.name);
    submissionData.append('surname', formData.surname);
    submissionData.append('role', formData.role);
    submissionData.append('status', formData.status);

    try {
        const response = await fetch(`http://localhost:8080/api/admin/update/${username}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/x-www-form-urlencoded', // Change to URL-encoded
            },
            body: submissionData.toString(), // Use the encoded parameters
        });

        if (response.ok) {
            console.log('User updated successfully');
            navigate('/admin-panel');
        } else {
            console.error('Failed to update user');
        }
    } catch (error) {
        console.error('Error submitting form:', error);
    }
};
    return (
        <div className="add-user-form-container">
            <HelmetProvider>
                <Helmet>
                    <title>Измени Корисник</title>
                </Helmet>
            </HelmetProvider>
            <HeadLinks />
            <Header userInfo={userData} />

            <div className="container mt-5 pb-5">
                <div className='add-user-form-body'>
                    <div className="form-wrapper">
                        <h1 className="text-center">Измени корисник</h1>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="username" className="label-add">Корисничко име:</label>
                                <input
                                    type="text"
                                    className="form-control form-control-lg mb-2"
                                    id="username"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    required
                                    disabled // Disabling username field to prevent changes
                                    placeholder="Внеси корисничко име"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="name" className="label-add">Име:</label>
                                <input
                                    type="text"
                                    className="form-control form-control-lg mb-2"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Внеси име"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="surname" className="label-add">Презиме:</label>
                                <input
                                    type="text"
                                    className="form-control form-control-lg mb-2"
                                    id="surname"
                                    name="surname"
                                    value={formData.surname}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Внеси презиме"
                                />
                            </div>

                            <div className="form-group mb-2">
                                <label htmlFor="role" className="label-add">Роља:</label>
                                <select
                                    id="role"
                                    name="role"
                                    className="form-control form-control-lg mb-2"
                                    value={formData.role}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="" disabled>Избери роља</option>
                                    {roles.map((role) => (
                                        <option key={role} value={role}>{role}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group mb-2">
                                <label htmlFor="status" className="label-add">Статус:</label>
                                <select
                                    id="status"
                                    name="status"
                                    className="form-control form-control-lg mb-2"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                    required
                                >
                                    {statuses.map((status) => (
                                        <option key={status} value={status}>{status}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group d-flex justify-content-between mt-2"> 
                                <button type="submit" className="btn btn-lg btn-warning"> Измени Корисник </button> 
                                <button type="button" className="btn btn-lg btn-danger" onClick={() => navigate('/admin-panel')}> Откажи </button> 
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditUserForm;
