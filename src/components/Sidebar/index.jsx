import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { faComments, faUser } from '@fortawesome/free-regular-svg-icons';
import {
  faCog,
  faHome,
  faMapMarkerAlt,
  faMobile,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';

import IconButton from '../IconButton';

import './styles.css';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (path) => () => navigate(path);

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Десктопная версия */}
      <nav className="sidebar">
        <IconButton
          icon={faHome}
          onClick={handleNavigate('/')}
          title="Главная"
          className={isActive('/') ? 'active' : ''}
        />
        <IconButton
          icon={faMobile}
          onClick={handleNavigate('/cards')}
          title="Карты"
          className={isActive('/cards') ? 'active' : ''}
        />
        <IconButton
          icon={faUsers}
          onClick={handleNavigate('/clients')}
          title="Пользователи"
          className={isActive('/clients') ? 'active' : ''}
        />
        <IconButton
          icon={faComments}
          onClick={handleNavigate('/mailings/info')}
          title="Сообщения"
          className={isActive('/mailings') ? 'active' : ''}
        />
        <IconButton
          icon={faMapMarkerAlt}
          onClick={handleNavigate('/locations')}
          title="Локации"
          className={isActive('/locations') ? 'active' : ''}
        />
        <IconButton
          icon={faUser}
          onClick={handleNavigate('/managers')}
          title="Профиль"
          className={isActive('/managers') ? 'active' : ''}
        />
        <IconButton
          icon={faCog}
          onClick={handleNavigate('/settings')}
          title="Настройки"
          className={isActive('/settings') ? 'active' : ''}
        />
      </nav>

      {/* Мобильная версия */}
      <nav className="bottom-nav">
        <IconButton
          icon={faHome}
          onClick={handleNavigate('/')}
          title="Главная"
          className={isActive('/') ? 'active' : ''}
        />
        <IconButton
          icon={faMobile}
          onClick={handleNavigate('/cards')}
          title="Карты"
          className={isActive('/cards') ? 'active' : ''}
        />
        <IconButton
          icon={faUsers}
          onClick={handleNavigate('/clients')}
          title="Пользователи"
          className={isActive('/clients') ? 'active' : ''}
        />
        <IconButton
          icon={faComments}
          onClick={handleNavigate('/mailings/info')}
          title="Сообщения"
          className={isActive('/mailings') ? 'active' : ''}
        />
        <IconButton
          icon={faMapMarkerAlt}
          onClick={handleNavigate('/locations')}
          title="Локации"
          className={isActive('/locations') ? 'active' : ''}
        />
        <IconButton
          icon={faUser}
          onClick={handleNavigate('/managers')}
          title="Профиль"
          className={isActive('/managers') ? 'active' : ''}
        />
        <IconButton
          icon={faCog}
          onClick={handleNavigate('/settings')}
          title="Настройки"
          className={isActive('/settings') ? 'active' : ''}
        />
      </nav>
    </>
  );
};

export default Sidebar;
