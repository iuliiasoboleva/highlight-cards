import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

import { Contact, GraduationCap, LogOut, User, BarChart, Settings, ScanLine } from 'lucide-react';

import { logout } from '../../store/userSlice';

import './styles.css';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleProfileClick = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const headerIcons = [
    {
      icon: <Contact size={22} strokeWidth={1.3} />,
      tooltip: 'Мой профиль',
      onClick: handleProfileClick,
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

        <div className="header-icons" ref={dropdownRef}>
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

          {isDropdownOpen && (
            <div className="profile-dropdown">
              <button onClick={() => navigate('/settings/personal')}>
                <User size={16} style={{ marginRight: '8px' }} />
                Профиль пользователя
              </button>
              <button onClick={() => navigate('/stats')}>
                <BarChart size={16} style={{ marginRight: '8px' }} />
                Статистика
              </button>
              <button onClick={() => navigate('/scanner')}>
                <ScanLine size={16} style={{ marginRight: '8px' }} />
                Приложение-сканер
              </button>
              <hr className="dropdown-divider" />
              <button onClick={handleLogout}>
                <LogOut size={16} style={{ marginRight: '8px' }} />
                Выйти
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
