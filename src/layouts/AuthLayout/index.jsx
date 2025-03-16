import React from 'react';
import './styles.css';

const AuthLayout = ({ children }) => {
  return (
    <div className="container">
      <div className="left">
        <div className="highlight-card">
          <h2>HIGHLIGHT <span>CARDS</span></h2>
          <p>Электронные карты для Apple Wallet и Google Pay</p>
          <img src="/login.png" alt="Card" className="card-image" />
        </div>
      </div>
      <div className="right">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
