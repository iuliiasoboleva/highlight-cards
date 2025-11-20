import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import { Check, Pencil } from 'lucide-react';

import moveIcon from '../../assets/move-arrows.png';
import CardButtons from '../../components/CardButtons';
import CardInfo from '../../components/CardInfo/CardInfo';
import LoaderCentered from '../../components/LoaderCentered';
import TitleWithHelp from '../../components/TitleWithHelp';
import {
  fetchCards,
  initializeCards,
  renameCardAsync,
  reorderCards,
  saveOrder,
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
  EditableName,
  NameEdit,
  NameInput,
  NameSaveBtn,
  Page,
  PhoneFrame,
  PhoneScreenImg,
  StatusIndicator,
} from './styles';

const Cards = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [editingId, setEditingId] = React.useState(null);
  const [newName, setNewName] = React.useState('');
  const [dragIndex, setDragIndex] = React.useState(null);

  const cardsState = useSelector((state) => state.cards);
  const { cards, loading, fetching } = cardsState;
  const isTemplatePage = location.pathname === '/cards/template';

  const cardsRef = React.useRef(cards);
  const saveOrderTimerRef = React.useRef(null);
  const hasAppliedOrderRef = React.useRef(false);

  React.useEffect(() => {
    cardsRef.current = cards;
  }, [cards]);

  React.useEffect(() => {
    hasAppliedOrderRef.current = false;
  }, [isTemplatePage]);

  React.useEffect(() => {
    if (cards.length <= 1 || hasAppliedOrderRef.current || isTemplatePage) return;

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
        hasAppliedOrderRef.current = true;
      }
    }
  }, [dispatch, cards, isTemplatePage]);

  React.useEffect(() => {
    if (!isTemplatePage) {
      dispatch(fetchCards(true));
    } else if (cards.length <= 1) {
      dispatch(initializeCards({ useTemplates: true }));
    }
  }, [dispatch, isTemplatePage]);

  const debouncedSaveOrder = React.useCallback(
    (ids) => {
      if (saveOrderTimerRef.current) {
        clearTimeout(saveOrderTimerRef.current);
      }
      saveOrderTimerRef.current = setTimeout(() => {
        dispatch(saveOrder(ids));
      }, 500);
    },
    [dispatch],
  );

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

      {fetching && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 9999,
            background: 'rgba(255, 255, 255, 0.9)',
            padding: '20px',
            borderRadius: '8px',
          }}
        >
          <LoaderCentered />
        </div>
      )}

      <CardsGrid>
        {cards.map((card, idx) => {
          const noHover = isTemplatePage;
          const nameText = card.name || '';
          const isLongName = nameText.length > 18;
          const nameClass = `text${isLongName ? ' marquee' : ''}`;

          return (
            <CardWrap key={card.id} $noHover={noHover}>
              {!isTemplatePage && (
                <CardState>
                  <StatusIndicator $active={card.isActive} />
                  {card.isActive ? 'Активна' : 'Неактивна'}
                </CardState>
              )}

              <CardImageBlock
                onClick={() => {
                  if (!isTemplatePage) {
                    navigate(`/cards/${card.id}/info`);
                  }
                }}
              >
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
                      debouncedSaveOrder(ids);
                      setDragIndex(null);
                    }}
                  >
                    <CardInfo card={card} isPreview={true} previewType="list" />
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
                          const trimmed = newName.trim();
                          if (trimmed && trimmed !== nameText) {
                            dispatch(renameCardAsync({ id: card.id, name: trimmed }));
                          }
                          setEditingId(null);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            const trimmed = newName.trim();
                            if (trimmed && trimmed !== nameText) {
                              dispatch(renameCardAsync({ id: card.id, name: trimmed }));
                            }
                            setEditingId(null);
                          }
                          if (e.key === 'Escape') setEditingId(null);
                        }}
                        autoFocus
                      />
                      <NameSaveBtn
                        onClick={() => {
                          const trimmed = newName.trim();
                          if (trimmed && trimmed !== nameText) {
                            dispatch(renameCardAsync({ id: card.id, name: trimmed }));
                          }
                          setEditingId(null);
                        }}
                        aria-label="Сохранить"
                        title="Сохранить"
                      >
                        <Check size={18} />
                      </NameSaveBtn>
                    </NameEdit>
                  ) : card.id === 'fixed' ? (
                    <span className="text-wrapper" title={nameText}>
                      <span className={nameClass}>{nameText}</span>
                    </span>
                  ) : (
                    <EditableName
                      type="button"
                      title="Нажмите, чтобы переименовать"
                      aria-label="Редактировать название карты"
                      onClick={() => {
                        setEditingId(card.id);
                        setNewName(nameText);
                      }}
                      onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setEditingId(card.id);
                            setNewName(nameText);
                        }
                      }}
                    >
                      <span className="text-wrapper" title={nameText}>
                        <span className={nameClass}>{nameText}</span>
                      </span>
                      <Pencil className="pencil" size={16} aria-hidden="true" />
                    </EditableName>
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
