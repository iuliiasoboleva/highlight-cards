import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

import { BarChart, Contact, GraduationCap, LogOut, ScanLine, Settings, User } from 'lucide-react';

import { logout as authLogout } from '../../store/authSlice';
import { fetchSubscription } from '../../store/subscriptionSlice';
import { logout as userLogout } from '../../store/userSlice';
import {
  AvatarCircle,
  DemoBadge,
  DesktopHeader,
  DropdownDivider,
  HeaderBar,
  HeaderIcons,
  IconButton,
  Logo,
  ProfileDropdown,
  UserName,
  UserSection,
} from './styles';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const subscription = useSelector((state) => state.subscription.info);
  const subLoading = useSelector((state) => state.subscription.loading);

  useEffect(() => {
    if (user.organization_id && !subscription && !subLoading) {
      dispatch(fetchSubscription(user.organization_id));
    }
  }, [dispatch, user.organization_id, subscription, subLoading]);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    dispatch(userLogout());
    dispatch(authLogout());
    navigate('/auth');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDropdownAction = (action) => {
    setIsDropdownOpen(false);
    action();
  };

  const headerIcons = [
    {
      icon: <Contact size={22} strokeWidth={1.3} />,
      tooltip: 'Мой профиль',
      onClick: () => handleDropdownAction(() => setIsDropdownOpen((prev) => !prev)),
    },
    {
      icon: <Settings size={22} strokeWidth={1.3} />,
      tooltip: 'Настройки',
      onClick: () => handleDropdownAction(() => navigate('/settings')),
    },
    {
      icon: <GraduationCap size={22} strokeWidth={1.3} />,
      tooltip: 'База знаний',
      onClick: () => handleDropdownAction(() => navigate('/education')),
    },
    {
      icon: <LogOut size={22} strokeWidth={1.3} />,
      tooltip: 'Выйти',
      onClick: () => handleDropdownAction(handleLogout),
    },
  ];

  return (
    <HeaderBar>
      <DesktopHeader>
        <Logo src="/logoColored.png" alt="Logo" onClick={() => navigate('/')} />
        {(user.firstName || user.name) && (
          <UserSection>
            <AvatarCircle>
              {user.avatar ? (
                <img src={user.avatar} alt="Avatar" />
              ) : (
                <>
                  {`${(user.firstName?.[0] || user.name?.[0] || '').toUpperCase()}${(user.lastName?.[0] || '').toUpperCase()}`}
                </>
              )}
            </AvatarCircle>
            Привет, <UserName>{user.firstName || user.name}</UserName>
            {subscription?.status === 'trial' && (
              <DemoBadge onClick={() => navigate('/settings')}>
                Демо: {subscription.days_left} д.
              </DemoBadge>
            )}
          </UserSection>
        )}

        <HeaderIcons ref={dropdownRef}>
          {headerIcons.map(({ icon, tooltip, onClick }, index) => {
            const tooltipId = `header-tooltip-${index}`;
            return (
              <React.Fragment key={index}>
                <IconButton
                  onClick={onClick}
                  data-tooltip-id={tooltipId}
                  data-tooltip-content={tooltip}
                  data-tooltip-place="bottom"
                >
                  {icon}
                </IconButton>
                <Tooltip id={tooltipId} className="sidebar-tooltip" />
              </React.Fragment>
            );
          })}

          {isDropdownOpen && (
            <ProfileDropdown>
              <button onClick={() => handleDropdownAction(() => navigate('/settings/personal'))}>
                <User size={16} style={{ marginRight: '8px' }} />
                Профиль пользователя
              </button>
              <button onClick={() => handleDropdownAction(() => navigate('/clients'))}>
                <BarChart size={16} style={{ marginRight: '8px' }} />
                Статистика
              </button>
              <button onClick={() => handleDropdownAction(() => navigate('/scan'))}>
                <ScanLine size={16} style={{ marginRight: '8px' }} />
                Приложение-сканер
              </button>
              <DropdownDivider />
              <button onClick={() => handleDropdownAction(handleLogout)}>
                <LogOut size={16} style={{ marginRight: '8px' }} />
                Выйти
              </button>
            </ProfileDropdown>
          )}
        </HeaderIcons>
      </DesktopHeader>
    </HeaderBar>
  );
};

export default Header;
