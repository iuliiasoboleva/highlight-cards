import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faInfoCircle, faUser, faChevronDown, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { menuData } from '../../mocks/menuData';
import './styles.css';

const Header = () => {
    const userName = 'userName' || 'Гость';
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen((prev) => !prev);
    const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);

    return (
        <>
            <header className="header">
                {/* Бургер и логотип в мобильной версии */}
                <div className="mobile-header">
                    <div className="logo">HIGHLIGHT<span>CARDS</span></div>
                    <FontAwesomeIcon icon={faBars} className="burger-icon" onClick={toggleMobileMenu} />
                </div>

                {/* Десктопная версия */}
                <div className="desktop-header">
                    <div className="logo">HIGHLIGHT<span>CARDS</span></div>
                    <div className="user-section" onClick={toggleMenu}>
                        <span>Привет, {userName}</span>
                        <FontAwesomeIcon icon={faChevronDown} className={`chevron ${isMenuOpen ? 'open' : ''}`} />
                        {isMenuOpen && (
                            <div className="dropdown-menu">
                                <div className="dropdown-content">
                                    <p><strong>Пробный {menuData.tariff.name}</strong></p>
                                    <div className="features">
                                        <div className="available">
                                            <h4>{menuData.available.title}</h4>
                                            <ul>
                                                {menuData.available.items.map((item, index) => (
                                                    <li key={index}>{item}</li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="unavailable">
                                            <h4>{menuData.unavailable.title}</h4>
                                            <ul>
                                                {menuData.unavailable.items.map((item, index) => (
                                                    <li key={index}>{item}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                    <p>
                                        У вас <strong>{menuData.tariff.name} (Пробный)</strong> тариф.
                                    </p>
                                    <p>{menuData.tariff.description}</p>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="header-icons">
                        <FontAwesomeIcon icon={faBell} />
                        <FontAwesomeIcon icon={faInfoCircle} />
                        <FontAwesomeIcon icon={faUser} />
                    </div>
                </div>
            </header>

            {/* Мобильное меню */}
            <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
                <div className="mobile-menu-header">
                    <div className="logo">HIGHLIGHT<span>CARDS</span></div>
                    <FontAwesomeIcon icon={faTimes} className="close-icon" onClick={toggleMobileMenu} />
                </div>
                <div className="mobile-menu-content">
                    <p>Привет, <strong>{userName}</strong></p>
                    <div className="features">
                        <div className="available">
                            <h4>{menuData.available.title}</h4>
                            <ul>
                                {menuData.available.items.map((item, index) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ul>
                        </div>
                        <div className="unavailable">
                            <h4>{menuData.unavailable.title}</h4>
                            <ul>
                                {menuData.unavailable.items.map((item, index) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <p>
                        У вас <strong>{menuData.tariff.name} (Пробный)</strong> тариф.
                    </p>
                    <p>{menuData.tariff.description}</p>
                </div>
                <div className="header-icons">
                    <FontAwesomeIcon icon={faBell} />
                    <FontAwesomeIcon icon={faInfoCircle} />
                    <FontAwesomeIcon icon={faUser} />
                </div>
            </div>
        </>
    );
};

export default Header;
