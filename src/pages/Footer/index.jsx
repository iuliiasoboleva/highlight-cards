import React from 'react';

import { HelpCircle } from 'lucide-react';

import './styles.css';

const Footer = () => (
  <footer className="footer">
    <div className="footer-section">
      <a href="mailto:support@example.com" className="footer-link">
        <HelpCircle size={16} />
        Написать в техподдержку
      </a>
    </div>

    <div className="footer-section">
      <a href="/oferta" className="footer-link" target="_blank" rel="noopener noreferrer">
        Оферта
      </a>
      <a href="/consent" className="footer-link" target="_blank" rel="noopener noreferrer">
        Согласие на обработку
      </a>
    </div>

    <div className="footer-section">
      <p>ООО "Моя Компания" • ИНН 1234567890</p>
      <p>Email: support@example.com • Тел: +7 (999) 123-45-67</p>
    </div>
  </footer>
);

export default Footer;
