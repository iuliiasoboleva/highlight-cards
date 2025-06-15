import React from 'react';

import './styles.css';

const Footer = () => (
  <footer className="footer">
    <div className="footer-left">
      <p className="company">ООО "ПРО М8"</p>
      <p className="inn">ИНН 7743406170</p>
    </div>

    <div className="footer-center">
      <a href="mailto:info@loyalclub.ru" className="footer-link">
        info@loyalclub.ru
      </a>
      <span className="separator">|</span>
      <a href="mailto:support@loyalclub.ru" className="footer-link">
        support@loyalclub.ru
      </a>
      <span className="separator">|</span>
      <span className="phone">8 (800) 770-71-58</span>
    </div>

    <div className="footer-right">
      <a href="/oferta" target="_blank" rel="noopener noreferrer" className="footer-link">
        Публичная оферта
      </a>
      <span className="separator">|</span>
      <a href="/privacy" target="_blank" rel="noopener noreferrer" className="footer-link">
        Политика конфиденциальности
      </a>
    </div>
  </footer>
);

export default Footer;
