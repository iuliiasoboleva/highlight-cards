import React from 'react';
import { useLocation, Link, useParams } from 'react-router-dom';
import './styles.css';

const menuItems = [
  { path: 'info', label: 'Информация' },
  { path: 'clients', label: 'Клиенты' },
  { path: 'push', label: 'Отправить push' },
  { path: 'stats', label: 'Статистика' }
];

const SubMenu = () => {
  const { id } = useParams();
  const location = useLocation();

  return (
    <div className="sub-menu">
      <div className="sub-menu-scroll">
        {menuItems.map((item) => {
          const isActive = location.pathname.endsWith(item.path);
          
          return (
            <Link 
              key={item.path}
              to={`/cards/${id}/${item.path}`}
              className={`sub-menu-link ${isActive ? 'active' : ''}`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default SubMenu;