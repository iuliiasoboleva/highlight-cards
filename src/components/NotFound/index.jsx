import React from 'react';
import { Link } from 'react-router-dom';

import './styles.css';

const NotFound = () => {
  return (
    <div className="not-found">
      <h1>Такой страницы не существует</h1>
      <Link to="/" className="custom-main-button">
        Вернуться на главную страницу
      </Link>
    </div>
  );
};

export default NotFound;
