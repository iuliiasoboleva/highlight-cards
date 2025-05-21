import React from 'react';
import { Link, useLocation } from 'react-router-dom';

import { HelpCircle, QrCode } from 'lucide-react';

import './styles.css';

const SubMenu = ({ menuItems, showNameInput, onNameChange, initialName, icon: Icon }) => {
  const location = useLocation();
  const [name, setName] = React.useState(initialName || '');

  const handleNameChange = (e) => {
    const newName = e.target.value;
    setName(newName);
    onNameChange?.(newName);
  };

  return (
    <div className="submenu-wrapper">
      <div className="submenu-inner">
        <div className="submenu-left">
          <div className="submenu-page-icon">{Icon && <Icon size={22} color="#fff" />}</div>
          {showNameInput && (
            <div className="name-editor">
              <input
                type="text"
                value={name}
                onChange={handleNameChange}
                placeholder="Название карты"
                className="card-name-button"
              />
              <span className="required-star">*</span>
            </div>
          )}
        </div>
        <div className="submenu-center">
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.to;
            return (
              <React.Fragment key={item.label}>
                {index !== 0 && <span className="divider">—</span>}
                {item.disabled ? (
                  <button className="submenu-tab disabled" disabled>
                    {item.label}
                  </button>
                ) : (
                  <Link to={item.to} className={`submenu-tab ${isActive ? 'active' : ''}`}>
                    {item.label}
                  </Link>
                )}
              </React.Fragment>
            );
          })}
        </div>
        <div className="submenu-right">
          <button className="submenu-icon-button" title="Помощь">
            <HelpCircle size={16} color="#aaa" />
          </button>
          <button className="submenu-tab submenu-save-button">Сохранить и посмотреть</button>
          <button className="submenu-icon-button" title="QR">
            <QrCode size={16} color="#aaa" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubMenu;
