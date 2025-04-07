import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { faCopy, faDownload, faToggleOn, faTrash } from '@fortawesome/free-solid-svg-icons';

import IconButton from '../IconButton';

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
          Выбрать шаблон
        </button>
      </div>
    );
  }

  // Стандартное поведение для остальных карточек
  return (
    <div className="card-buttons-block">
      <button onClick={() => navigate(`/cards/${cardId}`)}>Перейти</button>
      <div className="icon-buttons">
        <IconButton
          icon={faToggleOn}
          onClick={() => console.log('Включить/выключить')}
          title="Включить/выключить"
        />
        <IconButton icon={faDownload} onClick={() => console.log('Скачать')} title="Скачать" />
        <IconButton icon={faCopy} onClick={() => console.log('Копировать')} title="Копировать" />
        <IconButton icon={faTrash} onClick={() => console.log('Удалить')} title="Удалить" />
      </div>
    </div>
  );
};

export default CardButtons;
