import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import { Check, Pin, PinOff } from 'lucide-react';

import moveIcon from '../../assets/move-arrows.png';
import CardButtons from '../../components/CardButtons';
import CardInfo from '../../components/CardInfo/CardInfo';
import LoaderCentered from '../../components/LoaderCentered';
import TitleWithHelp from '../../components/TitleWithHelp';
import {
  fetchCards,
  renameCardAsync,
  reorderCards,
  saveOrder,
  togglePinAsync,
} from '../../store/cardsSlice';
import {
  CardBottom,
  CardBottomText,
  CardImage,
  CardImageBlock,
  CardState,
  CardWrap,
  CardsGrid,
  DragHandle,
  DraggableInfo,
  NameEdit,
  NameInput,
  NameSaveBtn,
  Page,
  PhoneFrame,
  PhoneScreenImg,
  PinBtn,
  StatusIndicator,
} from './styles';

const Cards = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  const [editingId, setEditingId] = React.useState(null);
  const [newName, setNewName] = React.useState('');
  const [dragIndex, setDragIndex] = React.useState(null);

  const cardsState = useSelector((state) => state.cards);
  const { cards, loading } = cardsState;
  const isTemplatePage = location.pathname === '/cards/template';

  const cardsRef = React.useRef(cards);
  React.useEffect(() => {
    cardsRef.current = cards;
  }, [cards]);

  React.useEffect(() => {
    const savedOrder = JSON.parse(localStorage.getItem('cards_order') || '[]');
    if (savedOrder.length) {
      const ordered = [
        cards[0],
        ...savedOrder
          .map((id) => cards.find((c) => c.id === id))
          .filter(Boolean)
          .filter((c) => c.id !== 'fixed'),
      ];
      if (ordered.length === cards.length - 1) {
        dispatch(reorderCards([cards[0], ...ordered]));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  React.useEffect(() => {
    if (!isTemplatePage) {
      dispatch(fetchCards());
    }
  }, [dispatch, isTemplatePage]);

  if (loading) return <LoaderCentered />;

  return (
    <Page>
      <TitleWithHelp
        title="Создайте свою карту лояльности"
        tooltipId="cards-help"
        tooltipHtml
        tooltipContent={`Выберите тип карты, который лучше всего подходит вашему бизнесу и настройте её за несколько минут. 
После выбора вы сможете настроить логотип, цвета и правила начисления баллов.`}
      />

      <CardsGrid>
        {cards.map((card, idx) => {
          const pinned = !!card.isPinned;
          const noHover = isTemplatePage;

          return (
            <CardWrap key={card.id} $noHover={noHover}>
              {!isTemplatePage && (
                <CardState>
                  <StatusIndicator $active={card.isActive} />
                  {card.title}
                </CardState>
              )}

              <CardImageBlock>
                {!isTemplatePage && card.id !== 'fixed' && (
                  <PinBtn
                    $pinned={pinned}
                    onClick={(ev) => {
                      ev.stopPropagation();
                      dispatch(togglePinAsync(card.id));
                    }}
                  >
                    {pinned ? <PinOff size={18} /> : <Pin size={18} />}
                  </PinBtn>
                )}

                {!isTemplatePage && card.id !== 'fixed' && (
                  <DragHandle src={moveIcon} alt="Переместить" />
                )}

                {card.id === 'fixed' ? (
                  <PhoneFrame src={card.frameUrl}>
                    <PhoneScreenImg src={'/images/example.png'} alt={card.name} draggable="false" />
                  </PhoneFrame>
                ) : (
                  <CardImage
                    className="card-image"
                    src={card.frameUrl}
                    alt={card.name}
                    draggable="false"
                  />
                )}
                {card.id !== 'fixed' && (
                  <DraggableInfo
                    $draggable={!isTemplatePage}
                    onDragStart={(e) => {
                      setDragIndex(idx);
                      e.dataTransfer.effectAllowed = 'move';
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                      if (dragIndex === null || dragIndex === idx) return;
                      const updated = [...cardsRef.current];
                      const item = updated[dragIndex];
                      updated.splice(dragIndex, 1);
                      updated.splice(idx, 0, item);
                      dispatch(reorderCards(updated));
                      setDragIndex(idx);
                    }}
                    onDrop={() => {
                      const ids = cardsRef.current.slice(1).map((c) => c.id);
                      localStorage.setItem('cards_order', JSON.stringify(ids));
                      dispatch(saveOrder(ids));
                      setDragIndex(null);
                    }}
                  >
                    <CardInfo card={card} />
                  </DraggableInfo>
                )}
              </CardImageBlock>

              <CardBottom>
                <CardBottomText>
                  {editingId === card.id ? (
                    <NameEdit>
                      <NameInput
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        onBlur={() => {
                          if (newName.trim() && newName !== card.name) {
                            dispatch(renameCardAsync({ id: card.id, name: newName.trim() }));
                          }
                          setEditingId(null);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            if (newName.trim() && newName !== card.name) {
                              dispatch(renameCardAsync({ id: card.id, name: newName.trim() }));
                            }
                            setEditingId(null);
                          }
                        }}
                        autoFocus
                      />
                      <NameSaveBtn
                        onClick={() => {
                          if (newName.trim() && newName !== card.name) {
                            dispatch(renameCardAsync({ id: card.id, name: newName.trim() }));
                          }
                          setEditingId(null);
                        }}
                        aria-label="Сохранить"
                        title="Сохранить"
                      >
                        <Check size={18} />
                      </NameSaveBtn>
                    </NameEdit>
                  ) : (
                    <h3
                      onClick={() => {
                        setEditingId(card.id);
                        setNewName(card.name);
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      {card.name}
                    </h3>
                  )}
                </CardBottomText>

                <CardButtons isFixed={card.id === 'fixed'} cardId={card.id} />
              </CardBottom>
            </CardWrap>
          );
        })}
      </CardsGrid>
    </Page>
  );
};

export default Cards;
