import React from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import 'react-tooltip/dist/react-tooltip.css';

import { BottomNav, Glyph, IconButton, SidebarNav, StyledTooltip } from './styles';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const role = useSelector((state) => state.user.role);

  const handleNavigate = (path) => () => navigate(path);

  const isActive = (path) => {
    if (path === '/') return location.pathname === path;
    if (path === '/mailings/info') return location.pathname.startsWith('/mailings');
    return location.pathname.startsWith(path);
  };

  const adminItems = [
    { icon: <Glyph src={'/icons/home.svg'} />, label: 'Главная', path: '/' },
    { icon: <Glyph src={'/icons/cards.svg'} />, label: 'Карты', path: '/cards' },
    { icon: <Glyph src={'/icons/people.svg'} />, label: 'Клиенты', path: '/clients' },
    { icon: <Glyph src={'/icons/scanner.svg'} />, label: 'Сканер', path: '/scan' },
    { icon: <Glyph src={'/icons/chat.svg'} />, label: 'Рассылки', path: '/mailings/info' },
    {
      icon: <Glyph src={'/icons/location.svg'} />,
      label: 'Адреса точек продаж',
      path: '/locations',
    },
    { icon: <Glyph src={'/icons/managers.svg'} />, label: 'Менеджеры', path: '/managers' },
    { icon: <Glyph src={'/icons/billing.svg'} />, label: 'Мой тариф', path: '/settings' },
  ];

  const employeeItems = [
    { icon: <Glyph src={'/icons/managers.svg'} />, label: 'Менеджеры', path: '/managers' },
    { icon: <Glyph src={'/icons/people.svg'} />, label: 'Клиенты', path: '/clients' },
    { icon: <Glyph src={'/icons/scanner.svg'} />, label: 'Сканер', path: '/scan' },
  ];

  const items = role === 'employee' ? employeeItems : adminItems;

  return (
    <>
      <SidebarNav>
        {items.map(({ icon, label, path }) => {
          const active = isActive(path);
          const tooltipId = `tooltip-${label}`;
          return (
            <React.Fragment key={path}>
              <IconButton
                className={active ? 'active' : ''}
                onClick={handleNavigate(path)}
                data-tooltip-id={tooltipId}
                data-tooltip-content={label}
                data-tooltip-place="right"
              >
                {icon}
              </IconButton>
              <StyledTooltip id={tooltipId} offset={10} />
            </React.Fragment>
          );
        })}
      </SidebarNav>

      <BottomNav>
        {items.map(({ icon, label, path }) => (
          <IconButton
            key={path}
            className={isActive(path) ? 'active' : ''}
            onClick={handleNavigate(path)}
            title={label}
          >
            {icon}
            <p>{label}</p>
          </IconButton>
        ))}
      </BottomNav>
    </>
  );
};

export default Sidebar;
