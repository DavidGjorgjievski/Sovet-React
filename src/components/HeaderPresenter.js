import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/HeaderPresenter.css'; 

const HeaderPresenter = () => {
    const navigate = useNavigate();
    const { id: sessionID } = useParams();

    return (
        <header>
            <div className='d-flex flex-start'>
                <img
                    id="logo-img"
                    src={`${process.env.PUBLIC_URL}/images/logo.png`}
                    className="logo-img"
                    alt="Logo"
                />
                <button 
                    className="back-button-presenter"
                    onClick={() => navigate(`/sessions#session-${sessionID}`)}
                >
                    Назад
                </button>
            </div>
        </header>
    );
};

export default HeaderPresenter;
