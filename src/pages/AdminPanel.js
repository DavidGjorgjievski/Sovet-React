import React, { useEffect, useState } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import Header from '../components/Header';
import HeadLinks from '../components/HeadLinks';
import '../styles/AdminPanel.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import UserTable from '../components/UserTable';
import ConfirmModal from '../components/ConfirmModal'; // Import the ConfirmModal
import { initializeMobileMenu } from '../components/mobileMenu'; // Import the mobile menu

function AdminPanel() {
    const navigate = useNavigate();
    const userData = JSON.parse(localStorage.getItem('userInfo')) || {};
    const token = localStorage.getItem('jwtToken');
    const [users, setUsers] = useState([]);
    const [modalVisible, setModalVisible] = useState(false); 
    const [userToDelete, setUserToDelete] = useState(null); 
    const [errorMessage, setErrorMessage] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            if (token) {
                try {
                    const response = await axios.get(process.env.REACT_APP_API_URL + '/api/admin/users', {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    });

                    setUsers(response.data);
                } catch (error) {
                    console.error("Error fetching users:", error);
                }
            } else {
                navigate('/login');
            }
        };

        fetchUsers();

        const cleanupMobileMenu = initializeMobileMenu();

        return () => {
            cleanupMobileMenu();
        };
    }, [navigate, token]);

    const handleDeleteClick = (user) => {
        setUserToDelete(user); 
        setModalVisible(true); 
    };

    const handleDeleteConfirm = async () => {
        if (!userToDelete) {
            return;
        }

        try {
            await axios.delete(`${process.env.REACT_APP_API_URL}/api/admin/users/delete/${userToDelete.username}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            setUsers((prevUsers) => prevUsers.filter(user => user.username !== userToDelete.username));

            setModalVisible(false);
            setUserToDelete(null);
            setErrorMessage(null); // Clear any previous error message
        } catch (error) {
            console.error("Error deleting user:", error);
            setErrorMessage("Не може да се избрише корисникот затоа што е поврзан со други податоци.");
            // Do not hide the modal to display the error message
        }
    };

    const handleModalClose = () => {
        setModalVisible(false);
        setUserToDelete(null); 
        setErrorMessage(null); // Clear the error message when closing the modal
    };

    const handleEditClick = (user) => {
        navigate(`/admin-panel/edit/${user.username}`);
    };

    return (
        <div className="admin-panel-container">
            <HelmetProvider>
                <Helmet>
                    <title>Админ Панел</title>
                </Helmet>
            </HelmetProvider>
            <HeadLinks />
            <Header userInfo={userData} />

            <div className="admin-body d-flex flex-column">
                <div className="d-flex flex-row justify-content-between mb-4">
                    <a href="/" className='a-tag-user-back-button'>
                        <button className="user-back-button">Назад</button>
                    </a>
                    <h1 className="admin-title">Сите корисници</h1>
                    <a href="/admin-panel/add-form">
                        <button className="user-add-button">Додади корисник</button>
                    </a>
                </div>

                <div className="admin-user-lists">
                    {users.length > 0 ? (
                        <>
                            <UserTable
                                users={users.filter(user => user.role === 'ROLE_ADMIN')}
                                title="Админи"
                                bgColor="primary"
                                onDeleteClick={handleDeleteClick} // Pass the delete click handler
                                onEditClick={handleEditClick} // Pass the edit click handler
                            />

                            <UserTable
                                users={users.filter(user => user.role === 'ROLE_USER')}
                                title="Kорисници"
                                bgColor="warning"
                                onDeleteClick={handleDeleteClick} // Pass the delete click handler
                                onEditClick={handleEditClick} // Pass the edit click handler
                            />

                            <UserTable
                                users={users.filter(user => user.role === 'ROLE_SPECTATOR')}
                                title="Набљудувачи"
                                bgColor="secondary"
                                onDeleteClick={handleDeleteClick} // Pass the delete click handler
                                onEditClick={handleEditClick} // Pass the edit click handler
                            />

                            <UserTable
                                users={users.filter(user => user.role === 'ROLE_PRESENTER')}
                                title="Презентери"
                                bgColor="info"
                                onDeleteClick={handleDeleteClick} // Pass the delete click handler
                                onEditClick={handleEditClick} // Pass the edit click handler
                            />
                        </>
                    ) : (
                        <p className="text-center mt-4">Нема достапни корисници.</p>
                    )}
                </div>
            </div>

            {/* Confirmation Modal */}
            <ConfirmModal
                show={modalVisible}
                onClose={handleModalClose}
                onConfirm={handleDeleteConfirm}
                userName={userToDelete ? userToDelete.username : ''}
                errorMessage={errorMessage} // Pass the error message
            />
        </div>
    );
}

export default AdminPanel;
