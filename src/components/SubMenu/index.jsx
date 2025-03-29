import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './styles.css';

const SubMenu = ({ menuItems, basePath, showNameInput, onNameChange, initialName }) => {
  const location = useLocation();
  const [name, setName] = React.useState(initialName || '');
  const isCreateMode = basePath === '/cards/create';

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
          const fullPath = isCreateMode
            ? basePath
            : `${basePath}/${item.path}`.replace('//', '/');

          const isActive = location.pathname === fullPath;

          return isCreateMode ? (
            <button
              key={item.path}
              className={`sub-menu-link ${isActive ? 'active' : ''} static`}
              disabled
            >
              {item.label}
            </button>
          ) : (
            <Link
              key={item.path}
              to={fullPath}
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
