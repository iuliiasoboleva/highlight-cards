import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

import { CreditCard, Home, MapPin, MessageSquare, Settings, User, Users } from 'lucide-react';

import './styles.css';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (path) => () => navigate(path);

  const isActive = (path) => {
    if (path === '/') return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  const items = [
    { icon: <Home size={20} />, label: 'Главная', path: '/' },
    { icon: <CreditCard size={20} />, label: 'Карты', path: '/cards' },
    { icon: <Users size={20} />, label: 'Клиенты', path: '/clients' },
    { icon: <MessageSquare size={20} />, label: 'Рассылки', path: '/mailings' },
    { icon: <MapPin size={20} />, label: 'Локации', path: '/locations' },
    { icon: <User size={20} />, label: 'Профиль', path: '/managers' },
    { icon: <Settings size={20} />, label: 'Настройки', path: '/settings' },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <nav className="sidebar">
        {items.map(({ icon, label, path }) => {
          const active = isActive(path);
          const tooltipId = `tooltip-${label}`;
          return (
            <React.Fragment key={path}>
              <button
                className={`icon-button ${active ? 'active' : ''}`}
                onClick={handleNavigate(path)}
                data-tooltip-id={tooltipId}
                data-tooltip-content={label}
                data-tooltip-place="right"
              >
                {icon}
              </button>
              <Tooltip id={tooltipId} className="sidebar-tooltip" />
            </React.Fragment>
          );
        })}
      </nav>

      {/* Mobile Bottom Nav */}
      <nav className="bottom-nav">
        {items.map(({ icon, label, path }) => (
          <button
            key={path}
            className={`icon-button ${isActive(path) ? 'active' : ''}`}
            onClick={handleNavigate(path)}
            title={label}
          >
            {icon}
          </button>
        ))}
      </nav>
    </>
  );
};

export default Sidebar;
