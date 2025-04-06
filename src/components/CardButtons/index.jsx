import React from 'react';
import { useNavigate } from 'react-router-dom';

import { faCopy, faDownload, faToggleOn, faTrash } from '@fortawesome/free-solid-svg-icons';

import IconButton from '../IconButton';

import './styles.css';

const CardButtons = ({ isFixed, cardId }) => {
  const navigate = useNavigate();

  return isFixed ? (
    <div className="card-buttons">
      <button onClick={() => navigate('/cards/create')}>На шаблоне</button>
      <button onClick={() => navigate('/cards/create')}>Без шаблона</button>
    </div>
  ) : (
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
