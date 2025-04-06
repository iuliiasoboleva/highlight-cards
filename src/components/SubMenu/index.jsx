import React from 'react';
import { Link, useLocation } from 'react-router-dom';

import './styles.css';

const SubMenu = ({ menuItems, showNameInput, onNameChange, initialName }) => {
  const location = useLocation();
  const [name, setName] = React.useState(initialName || '');

  const handleNameChange = (e) => {
    const newName = e.target.value;
    setName(newName);
    onNameChange?.(newName);
  };

  return (
    <div className="sub-menu">
      <div className="sub-menu-scroll">
        {showNameInput && (
          <div className="name-editor">
            <input
              type="text"
              value={name}
              onChange={handleNameChange}
              placeholder="Название карты"
              className="name-input"
            />
          </div>
        )}

        {menuItems.map((item) => {
          const isActive = location.pathname === item.to;

          if (item.disabled) {
            return (
              <button
                key={item.label}
                className={`sub-menu-link ${isActive ? 'active' : ''} static`}
                disabled
              >
                {item.label}
              </button>
            );
          }

          return (
            <Link
              key={item.to}
              to={item.to}
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
