import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import { Copy, Download, Power, X } from 'lucide-react';

import { copyCard, deleteCard, downloadCard, updateCardById } from '../../store/cardsSlice';

import './styles.css';

const CardButtons = ({ isFixed, cardId }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const isTemplatePage = location.pathname === '/cards/template';

  const card = useSelector((state) => state.cards.cards.find((c) => c.id === cardId));

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

  const handleToggleActive = () => {
    dispatch(
      updateCardById({
        id: cardId,
        changes: { isActive: !card.isActive },
      }),
    );
  };

  const handleDownload = () => {
    dispatch(downloadCard(cardId));
  };

  const handleCopy = () => {
    dispatch(copyCard(cardId));
  };

  const handleDelete = () => {
    dispatch(deleteCard(cardId));
  };

  return (
    <div className="card-buttons-block">
      <button onClick={() => navigate(`/cards/${cardId}`)}>Перейти</button>
      <div className="icon-buttons">
        <button onClick={handleToggleActive} title="Включить/выключить">
          <Power size={20} />
        </button>
        <button onClick={handleDownload} title="Скачать">
          <Download size={20} />
        </button>
        <button onClick={handleCopy} title="Копировать">
          <Copy size={20} />
        </button>
        <button onClick={handleDelete} title="Удалить">
          <X size={20} />
        </button>
      </div>
    </div>
  );
};

export default CardButtons;
