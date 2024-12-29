import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import '../styles/Header.css';

function Header({ userInfo, fetchTopics = null, setCurrentVotes = null, setIsFromLogo = null}) {// Accept userInfo as a prop
    const [isMobileNavOpen, setMobileNavOpen] = useState(false);

    const toggleMobileMenu = () => {
        setMobileNavOpen(!isMobileNavOpen);
    };

    const getActiveClass = (path) => {
        return window.location.pathname === path ? 'active' : '';
    };

useEffect(() => {
    const logoImg = document.getElementById('logo-img');
    const handleClick = () => {
        setIsFromLogo(true);
        setCurrentVotes({});
        if (fetchTopics) {
            fetchTopics();
        } else {
            window.location.reload();
        }
    };
    logoImg.addEventListener('click', handleClick);

    return () => logoImg.removeEventListener('click', handleClick);
}, [fetchTopics,setCurrentVotes, setIsFromLogo]);

    return (
        <header>
            <nav>
                <div className="d-flex flex-row">
                    <div>
                       <img
                            id="logo-img"
                            src={`${process.env.PUBLIC_URL}/images/grb.png`}
                            className="logo-img"
                            alt="Logo"
                        />
                    </div>

                    {/* Desktop Navigation */}
                    <ul className="nav-item" id="desktop-nav">
                        <li className={getActiveClass('/')}><Link to="/">Почетна</Link></li>
                        <li className={getActiveClass('/municipalities')}><Link to="/municipalities">Општини</Link></li>
                        <li className={getActiveClass('/admin-panel')} style={{ display: userInfo.role === 'ROLE_ADMIN' ? 'block' : 'none' }}>
                            <Link to="/admin-panel">Админ панел</Link>
                        </li>
                    </ul>

                    {/* Mobile Navigation */}
                    <div id="mobile-menu-toggle" className="mobile-menu-toggle" onClick={toggleMobileMenu}>
                        <span className="hamburger-icon"></span>
                        <span className="hamburger-icon"></span>
                        <span className="hamburger-icon"></span>
                    </div>
                    <ul className={`nav-item-mobile ${isMobileNavOpen ? 'open' : ''}`} id="mobile-nav">
                        <li><Link to="/">Почетна</Link></li>
                        <li><Link to="/municipalities">Општини</Link></li>
                        <li style={{ display: userInfo.role === 'ROLE_ADMIN' ? 'block' : 'none' }}>
                            <Link to="/admin-panel">Админ панел</Link>
                        </li>
                    </ul>
                </div>

                {/* User Profile and Logout Links */}
                <ul className="nav-item">
                    <li className="nav-image-item">
                        <div>
                            <img src={`data:image/jpeg;base64,${userInfo.image}`} className="header-image" alt="User Profile" />
                        </div>
                    </li>
                    <li><Link to="/profile">{userInfo.name} {userInfo.surname}</Link></li>
                    <li><Link to="/logout">Одјави се</Link></li>
                </ul>
            </nav>
        </header>
    );
}

export default Header;
