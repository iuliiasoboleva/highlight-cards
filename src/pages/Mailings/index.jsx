import React from 'react';
import { Outlet } from 'react-router-dom';

import './styles.css';

const Mailings = () => {
  return (
    <div className="mailings-container">
      <Outlet />
    </div>
  );
};

export default Mailings;
