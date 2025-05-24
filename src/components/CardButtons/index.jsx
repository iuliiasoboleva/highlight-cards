import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import './styles.css';

const CardButtons = ({ isFixed, cardId }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isTemplatePage = location.pathname === '/cards/template';

  if (isFixed) {
    return (
      <div className="card-buttons">
        {isTemplatePage ? (
          <button onClick={() => navigate('/cards/create')}>Без шаблона</button>
        ) : (
          <>
            <button onClick={() => navigate('/cards/template')}>На шаблоне</button>
            <button onClick={() => navigate('/cards/create')}>Без шаблона</button>
          </>
        )}
      </div>
    );
  }

  if (isTemplatePage) {
    return (
      <div className="card-buttons">
        <button className="template-select-button" onClick={() => navigate('/cards/create')}>
          Выбрать шаблон
        </button>
      </div>
    );
  }

  return (
    <div className="card-buttons-block">
      <button onClick={() => navigate(`/cards/${cardId}`)}>Перейти</button>
      <button onClick={() => navigate(`/cards/${cardId}/edit/type`)}>Редактировать</button>
    </div>
  );
};

export default CardButtons;
