import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import './styles.css';

const CardButtons = ({ isFixed, cardId }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isTemplatePage = location.pathname === '/cards/template';

  // Если это фиксированная карточка (первая)
  if (isFixed) {
    return (
      <div className="card-buttons">
        {!isTemplatePage && <button onClick={() => navigate('/cards/template')}>На шаблоне</button>}
        <button onClick={() => navigate('/cards/create')}>Без шаблона</button>
      </div>
    );
  }

  // Если находимся на странице шаблонов
  if (isTemplatePage) {
    return (
      <div className="card-buttons">
        <button className="template-select-button" onClick={() => navigate('/cards/create')}>
          Выбрать этот тип
        </button>
      </div>
    );
  }

  // Стандартное поведение для остальных карточек
  return (
    <div className="card-buttons-block">
      <button onClick={() => navigate(`/cards/${cardId}`)}>Перейти</button>
      <button onClick={() => navigate(`/cards/${cardId}/edit/type`)}>Редактировать</button>
    </div>
  );
};

export default CardButtons;
