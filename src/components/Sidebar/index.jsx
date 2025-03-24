import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { faComments, faUser } from '@fortawesome/free-regular-svg-icons';
import { faCog, faMapMarkerAlt, faUsers, faMobile, faHome } from '@fortawesome/free-solid-svg-icons';
import IconButton from '../IconButton';

import './styles.css';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (path) => () => navigate(path);

  const isActive = (path) => location.pathname === path;

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
          onClick={handleNavigate('/users')} 
          title="Пользователи" 
          className={isActive('/users') ? 'active' : ''}
        />
        <IconButton 
          icon={faComments} 
          onClick={handleNavigate('/messages')} 
          title="Сообщения" 
          className={isActive('/messages') ? 'active' : ''}
        />
        <IconButton 
          icon={faMapMarkerAlt} 
          onClick={handleNavigate('/locations')} 
          title="Локации" 
          className={isActive('/locations') ? 'active' : ''}
        />
        <IconButton 
          icon={faUser} 
          onClick={handleNavigate('/profile')} 
          title="Профиль" 
          className={isActive('/profile') ? 'active' : ''}
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
          onClick={handleNavigate('/users')} 
          title="Пользователи" 
          className={isActive('/users') ? 'active' : ''}
        />
        <IconButton 
          icon={faComments} 
          onClick={handleNavigate('/messages')} 
          title="Сообщения" 
          className={isActive('/messages') ? 'active' : ''}
        />
        <IconButton 
          icon={faMapMarkerAlt} 
          onClick={handleNavigate('/locations')} 
          title="Локации" 
          className={isActive('/locations') ? 'active' : ''}
        />
        <IconButton 
          icon={faUser} 
          onClick={handleNavigate('/profile')} 
          title="Профиль" 
          className={isActive('/profile') ? 'active' : ''}
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
