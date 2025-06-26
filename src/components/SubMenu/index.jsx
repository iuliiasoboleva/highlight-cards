import React, { useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createCard, saveCard, setCurrentCard } from '../../store/cardsSlice';

import { HelpCircle, QrCode } from 'lucide-react';

import QRPopup from '../QRPopup';

import './styles.css';

const SubMenu = ({
  menuItems,
  showNameInput,
  onNameChange,
  initialName,
  icon: Icon,
  showRightActions,
}) => {
  const { id } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();
  const cards = useSelector((state) => state.cards.cards);
  const currentCard = useSelector((state) => state.cards.currentCard);
  const [name, setName] = useState(initialName || '');
  const [showQRPopup, setShowQRPopup] = useState(false);

  const handleNameChange = (e) => {
    const newName = e.target.value;
    setName(newName);
    onNameChange?.(newName);
  };

  return (
    <div className="submenu-wrapper">
      <div className="submenu-inner">
        <div className="submenu-left">
          <div className="submenu-page-icon">{Icon && <Icon size={22} color="#fff" />}</div>
          {showNameInput && (
            <div className="name-editor">
              <input
                type="text"
                value={name}
                onChange={handleNameChange}
                placeholder="Название карты"
                className="card-name-button"
              />
              <span className="required-star">*</span>
            </div>
          )}
        </div>

        <div className="submenu-center" style={showRightActions ? { flex: '1' } : {}}>
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.to;
            return (
              <React.Fragment key={item.label}>
                {index !== 0 && showRightActions && <span className="divider">—</span>}
                {item.disabled ? (
                  <button className="submenu-tab disabled" disabled>
                    {item.label}
                  </button>
                ) : (
                  <Link to={item.to} className={`submenu-tab ${isActive ? 'active' : ''}`}>
                    {item.label}
                  </Link>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {!showRightActions && id && (
          <div className="submenu-right" style={{ marginLeft: 'auto' }}>
            <Link to={`/cards/${id}/edit/type`} className="submenu-tab" onClick={() => {
              const cardData = cards.find((c) => c.id === Number(id));
              if (cardData) dispatch(setCurrentCard(cardData));
            }}>
              Редактировать
            </Link>
          </div>
        )}

        {showRightActions && (
          <div className="submenu-right">
            <button className="submenu-icon-button" title="Помощь">
              <HelpCircle size={16} color="#aaa" />
            </button>
            <button
              className="submenu-tab submenu-save-button"
              onClick={async () => {
                const exists = cards.some((c) => c.id === currentCard.id && c.id !== 'fixed');
                try {
                  if (!exists) {
                    await dispatch(createCard()).unwrap();
                  } else {
                    await dispatch(saveCard()).unwrap();
                  }
                  window.location.href = '/cards';
                } catch {
                  setShowQRPopup(true);
                }
              }}
            >
              Сохранить и посмотреть
            </button>
            <button className="submenu-icon-button" title="QR">
              <QrCode size={16} color="#aaa" />
            </button>
          </div>
        )}
        {showQRPopup && <QRPopup cardId={id} onClose={() => setShowQRPopup(false)} />}
      </div>
    </div>
  );
};

export default SubMenu;
