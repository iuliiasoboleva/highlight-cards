import React, { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { ChevronLeft, QrCode } from 'lucide-react';

import { createCard, saveCard, setCurrentCard } from '../../store/cardsSlice';
import QRPopup from '../QRPopup';
import {
  CardNameInput,
  IconButton,
  NameEditor,
  PageIcon,
  RequiredStar,
  SaveButton,
  SubmenuCenter,
  SubmenuInner,
  SubmenuLeft,
  SubmenuRight,
  SubmenuWrapper,
  TabButton,
  TabLink,
} from './styles';

const SubMenu = ({ menuItems, showNameInput, onNameChange, initialName, showRightActions }) => {
  const { id } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
    <SubmenuWrapper>
      <SubmenuInner>
        <SubmenuLeft>
          <PageIcon
            as="button"
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Назад"
            title="Назад"
          >
            <ChevronLeft size={18} color="#fff" />
          </PageIcon>

          {showNameInput && (
            <NameEditor>
              <CardNameInput
                type="text"
                value={name}
                onChange={handleNameChange}
                placeholder="Название карты"
              />
              <RequiredStar>*</RequiredStar>
            </NameEditor>
          )}
        </SubmenuLeft>

        <SubmenuCenter $grow={showRightActions}>
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.to;

            return (
              <React.Fragment key={item.label}>
                {item.disabled ? (
                  <TabButton disabled>{item.label}</TabButton>
                ) : (
                  <TabLink to={item.to} $active={isActive}>
                    {item.label}
                  </TabLink>
                )}
              </React.Fragment>
            );
          })}
        </SubmenuCenter>

        {!showRightActions && id && (
          <SubmenuRight>
            <TabLink
              to={`/cards/${id}/edit/type`}
              onClick={() => {
                const cardData = cards.find((c) => c.id === Number(id));
                if (cardData) dispatch(setCurrentCard(cardData));
              }}
            >
              Редактировать
            </TabLink>
          </SubmenuRight>
        )}

        {/* Правые действия */}
        {showRightActions && (
          <SubmenuRight>
            <SaveButton
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
              Сохранить
            </SaveButton>

            <IconButton aria-label="QR">
              <QrCode size={16} color="white" />
              Печать QR-кода
            </IconButton>
          </SubmenuRight>
        )}

        {showQRPopup && <QRPopup cardId={id} onClose={() => setShowQRPopup(false)} />}
      </SubmenuInner>
    </SubmenuWrapper>
  );
};

export default SubMenu;
