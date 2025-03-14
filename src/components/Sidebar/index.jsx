import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments, faUser } from '@fortawesome/free-regular-svg-icons';
import { faCog, faMapMarkerAlt, faUsers, faMobile, faHome } from '@fortawesome/free-solid-svg-icons';

import './styles.css';

const Sidebar = () => {
  return (
    <>
      {/* Десктопная версия */}
      <nav className="sidebar">
        <Link to="/" className="sidebar-link">
          <FontAwesomeIcon icon={faHome} />
        </Link>
        <Link to="/phone" className="sidebar-link">
          <FontAwesomeIcon icon={faMobile} />
        </Link>
        <Link to="/users" className="sidebar-link">
          <FontAwesomeIcon icon={faUsers} />
        </Link>
        <Link to="/messages" className="sidebar-link">
          <FontAwesomeIcon icon={faComments} />
        </Link>
        <Link to="/locations" className="sidebar-link">
          <FontAwesomeIcon icon={faMapMarkerAlt} />
        </Link>
        <Link to="/profile" className="sidebar-link">
          <FontAwesomeIcon icon={faUser} />
        </Link>
        <Link to="/settings" className="sidebar-link">
          <FontAwesomeIcon icon={faCog} />
        </Link>
      </nav>

      {/* Мобильная версия */}
      <nav className="bottom-nav">
        <Link to="/" className="bottom-nav-link">
          <FontAwesomeIcon icon={faHome} />
        </Link>
        <Link to="/phone" className="bottom-nav-link">
          <FontAwesomeIcon icon={faMobile} />
        </Link>
        <Link to="/users" className="bottom-nav-link">
          <FontAwesomeIcon icon={faUsers} />
        </Link>
        <Link to="/messages" className="bottom-nav-link">
          <FontAwesomeIcon icon={faComments} />
        </Link>
        <Link to="/locations" className="bottom-nav-link">
          <FontAwesomeIcon icon={faMapMarkerAlt} />
        </Link>
        <Link to="/profile" className="bottom-nav-link">
          <FontAwesomeIcon icon={faUser} />
        </Link>
        <Link to="/settings" className="bottom-nav-link">
          <FontAwesomeIcon icon={faCog} />
        </Link>
      </nav>
    </>
  );
};

export default Sidebar;
