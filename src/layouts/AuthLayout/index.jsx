import React from 'react';
import './styles.css';

const AuthLayout = ({ children }) => {
  return (
    <div className="container">
      <div className="left">
        <div className="highlight-card">
          <img src="/logoColored.png" alt="Logo" className='logo'/>
          <p>Электронные карты для Apple Wallet и Google Pay</p>
        </div>
      </div>

      <div className="right">
        <div className="mobile-highlight-card">
          <img src="/logoColored.png" alt="Logo" className='logo'/>
          <p>Электронные карты для Apple Wallet и Google Pay</p>
        </div>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
