import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import { Copy, Download, Power, X } from 'lucide-react';

import {
  copyCard,
  copyCardAsync,
  downloadCard,
  setCurrentCard,
  updateCard,
  deleteCardAsync,
} from '../../store/cardsSlice';

import DeleteCardModal from '../DeleteCardModal';

import './styles.css';

const CardButtons = ({ isFixed, cardId }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const isTemplatePage = location.pathname === '/cards/template';

  const card = useSelector((state) => state.cards.cards.find((c) => c.id === cardId));

  const [showDel, setShowDel] = React.useState(false);
  const [copyLoading, setCopyLoading] = React.useState(false);

  if (!card) return null;

  if (isFixed) {
    return (
      <div className="card-buttons">
        {isTemplatePage ? (
          <button
            onClick={() => {
              dispatch(setCurrentCard({})); // инициализация пустой карты
              navigate('/cards/create');
            }}
          >
            Без шаблона
          </button>
        ) : (
          <>
            <button onClick={() => navigate('/cards/template')}>На шаблоне</button>
            <button
              onClick={() => {
                dispatch(setCurrentCard({}));
                navigate('/cards/create');
              }}
            >
              Без шаблона
            </button>
          </>
        )}
      </div>
    );
  }

  if (isTemplatePage) {
    const handleTemplateSelect = () => {
      dispatch(setCurrentCard(card));
      navigate('/cards/create');
    };

    return (
      <div className="card-buttons">
        <button className="template-select-button" onClick={handleTemplateSelect}>
          Выбрать шаблон
        </button>
      </div>
    );
  }

  const handleToggleActive = () => {
    dispatch(
      updateCard({
        id: cardId,
        changes: { isActive: !card.isActive },
      }),
    );
  };

  const handleDownload = () => {
    dispatch(downloadCard(cardId));
  };

  const handleCopy = () => {
    setCopyLoading(true);
    dispatch(copyCardAsync(cardId))
      .unwrap()
      .finally(() => setCopyLoading(false));
  };

  const handleDelete = () => setShowDel(true);

  const confirmDelete = () => {
    dispatch(deleteCardAsync(cardId));
    setShowDel(false);
  };

  return (
    <div className="card-buttons-block">
      <button onClick={() => navigate(`/cards/${cardId}/info`)}>Перейти</button>
      <div className="icon-buttons">
        <button onClick={handleToggleActive} title="Включить/выключить">
          <Power size={20} />
        </button>
        <button onClick={handleDownload} title="Скачать">
          <Download size={20} />
        </button>
        <button onClick={handleCopy} title="Копировать" disabled={copyLoading}>
          <Copy size={20} />
        </button>
        <button onClick={handleDelete} title="Удалить">
          <X size={20} />
        </button>
      </div>
      {showDel && (
        <DeleteCardModal
          cardName={card.name}
          onConfirm={confirmDelete}
          onCancel={() => setShowDel(false)}
        />
      )}
    </div>
  );
};

export default CardButtons;
