import React, { useState, useEffect } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import Header from '../components/Header';
import HeadLinks from '../components/HeadLinks';
import { useNavigate } from 'react-router-dom';
import { initializeMobileMenu } from '../components/mobileMenu'; 
import '../styles/AddUserForm.css';

function AddUserForm() {
    const navigate = useNavigate();
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
        password: '',
        role: 'ROLE_USER',
        status: 'ACTIVE',
        file: null,
    });
    const [confirmPassword, setConfirmPassword] = useState('');
    const [fileError, setFileError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [fileName, setFileName] = useState('Нема избрана слика'); // For displaying selected file name
    const [fileSizeError, setFileSizeError] = useState(false);
    const roles = ["ROLE_ADMIN", "ROLE_USER", "ROLE_SPECTATOR", "ROLE_PRESENTER"];
    const statuses = ["ACTIVE", "INACTIVE"];

    useEffect(() => {
        const cleanupMobileMenu = initializeMobileMenu();
        return () => {
            cleanupMobileMenu();
        };
    }, [navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'confirmPassword') {
            setConfirmPassword(value);
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            const validTypes = ['image/jpeg', 'image/png']; // Allowed file types
            if (!validTypes.includes(selectedFile.type)) {
                setFileError(true);
                setFileSizeError(false);
                setFileName('Нема избрана слика'); // Reset file name if invalid type
                return;
            }

            if (selectedFile.size > 51200) { // Validate file size (50KB limit)
                setFileSizeError(true);
                setFileError(false);
                setFileName('Нема избрана слика'); 
            } else {
                setFormData({ ...formData, file: selectedFile });
                setFileError(false);
                setFileSizeError(false);
                setFileName(selectedFile.name); 
            }
        } else {
            setFileName('Нема избрана слика'); 
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== confirmPassword) {
            setPasswordError(true);
            return;
        }


        if (fileError || fileSizeError) {
            // If there are any file errors, do not proceed
            return;
        }

        setPasswordError(false);

        const submissionData = new FormData();
        submissionData.append('username', formData.username);
        submissionData.append('name', formData.name);
        submissionData.append('surname', formData.surname);
        submissionData.append('password', formData.password);
        submissionData.append('role', formData.role);
        submissionData.append('status', formData.status);
        if (formData.file) {
            submissionData.append('file', formData.file);
        }

        try {
            const response = await fetch(process.env.REACT_APP_API_URL + "/api/admin/add", {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: submissionData,
            });

            if (response.ok) {
                console.log('User added successfully');
                navigate('/admin-panel');
            } else {
                console.error('Failed to add user');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    return (
        <div className="add-user-form-container">
            <HelmetProvider>
                <Helmet>
                    <title>Додади Корисник</title>
                </Helmet>
            </HelmetProvider>
            <HeadLinks />
            <Header userInfo={userData} />

            <div className="container mt-5 pb-5">
                <div className='add-user-form-body'>
                    <div className="form-wrapper">
                        <h1 className="text-center">Додади корисник</h1>
                        <form onSubmit={handleSubmit} encType="multipart/form-data">
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
                            <div className="form-group">
                                <label htmlFor="password" className="label-add">Лозинка:</label>
                                <input
                                    type="password"
                                    className="form-control form-control-lg mb-2"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Внеси лозинка"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="confirmPassword" className="label-add">Потврди Лозинка:</label>
                                <input
                                    type="password"
                                    className="form-control form-control-lg mb-2"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={confirmPassword}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Потврди лозинка"
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

                            {/* Image Upload Section */}
                            <div className="form-group d-flex justify-content-center">
                                <div className={`file-drop-area image-add-input ${fileError ? 'is-active' : ''}`}>
                                    <p className="file-drop-message">
                                        {formData.file ? (
                                            `Избрана датотека: ${fileName}` 
                                        ) : (
                                            <>Пуштете датотека тука или <span>кликнете за да изберете слика</span></>
                                        )}
                                    </p>
                                    <input type="file" id="file" name="file" onChange={handleFileChange} required />
                                </div>
                            </div>
                            {fileError && (
                                <div className="error-message">
                                    Само JPG или PNG слики се дозволени.
                                </div>
                            )}
                            {fileSizeError && (
                                <div className="error-message">
                                    Максималната големина на сликата е дозволено до 50KB.
                                </div>
                            )}
                            {passwordError && (
                                <div className="error-message">
                                    Лозинките не се совпаѓаат.
                                </div>
                            )}
                            <div className="form-group d-flex justify-content-between mt-2"> 
                                <button type="submit" className="btn btn-lg btn-primary"> Додади Корисник </button> 
                                <button type="button" className="btn btn-danger btn-lg back-button-space" onClick={() => navigate('/admin-panel')}> Назад </button> 
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddUserForm;
