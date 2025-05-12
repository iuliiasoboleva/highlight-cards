import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { faAddressCard, faGear, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { logout } from '../../store/userSlice';

import './styles.css';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };
  return (
    <header className="header">
      <div className="desktop-header">
        <img src="/logoColored.png" alt="Logo" className="logo" />
        <div className="user-section">
          <span>Привет, {user.firstName}</span>
        </div>

        <div className="header-icons">
          <div
            className="icon-with-tooltip"
            title="Мой профиль"
            onClick={() => navigate('/settings/personal')}
          >
            <FontAwesomeIcon icon={faAddressCard} />
          </div>
          <div
            className="icon-with-tooltip"
            title="Настройки"
            onClick={() => navigate('/settings')}
          >
            <FontAwesomeIcon icon={faGear} />
          </div>
          <div className="icon-with-tooltip" title="Выйти" onClick={handleLogout}>
            <FontAwesomeIcon icon={faRightFromBracket} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
