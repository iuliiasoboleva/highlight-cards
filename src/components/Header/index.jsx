import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

import { Contact, GraduationCap, LogOut, Settings } from 'lucide-react';

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

  const headerIcons = [
    {
      icon: <Contact size={22} strokeWidth={1.3} />,
      tooltip: 'Мой профиль',
      onClick: () => navigate('/settings/personal'),
    },
    {
      icon: <Settings size={22} strokeWidth={1.3} />,
      tooltip: 'Настройки',
      onClick: () => navigate('/settings'),
    },
    {
      icon: <GraduationCap size={22} strokeWidth={1.3} />,
      tooltip: 'База знаний',
      onClick: () => navigate('/education'),
    },
    {
      icon: <LogOut size={22} strokeWidth={1.3} />,
      tooltip: 'Выйти',
      onClick: handleLogout,
    },
  ];

  return (
    <header className="header">
      <div className="desktop-header">
        <img src="/logoColored.png" alt="Logo" className="logo" />
        <div className="user-section">
          Привет, <span>{user.firstName}</span>
        </div>

        <div className="header-icons">
          {headerIcons.map(({ icon, tooltip, onClick }, index) => {
            const tooltipId = `header-tooltip-${index}`;
            return (
              <React.Fragment key={index}>
                <button
                  className="icon-button"
                  onClick={onClick}
                  data-tooltip-id={tooltipId}
                  data-tooltip-content={tooltip}
                  data-tooltip-place="bottom"
                >
                  {icon}
                </button>
                <Tooltip id={tooltipId} className="sidebar-tooltip" />
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </header>
  );
};

export default Header;
