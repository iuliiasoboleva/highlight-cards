import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

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
              <React.Fragment key={item.label}>
                <button
                  className={`sub-menu-link ${isActive ? 'active' : ''} static`}
                  disabled
                  data-tooltip-id={`tooltip-${item.label}`}
                  data-tooltip-content={item.tooltip || ''}
                  data-tooltip-trigger="click"
                >
                  {item.label}
                </button>
                {item.tooltip && (
                  <Tooltip
                    id={`tooltip-${item.label}`}
                    place="bottom"
                    clickable
                    className="tooltip-on-bottom"
                  />
                )}
              </React.Fragment>
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
