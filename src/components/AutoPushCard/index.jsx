import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import { Trash2 } from 'lucide-react';

import CustomInput from '../../customs/CustomInput';
import { addSelectedCard, removeSelectedCard } from '../../store/userPushSlice';
import ToggleSwitch from '../ToggleSwitch';
import {
  Button,
  ButtonRow,
  Card,
  CardOption,
  CardPicker,
  Label,
  Line,
  Subtitle,
  Tag,
  TagWrapper,
  Textarea,
  Title,
  TitleRow,
  TrashButton,
} from './styles';

const AutoPushCard = ({
  itemId,
  title,
  message,
  delay,
  enabled,
  onChangeMessage,
  onChangeDelay,
  onToggle,
  onSave,
  lockToggle = false,
  editableMessage = true,
  removable = false,
  onRemove,
  selectedCardIds,
  allCards = [],
}) => {
  const dispatch = useDispatch();
  const [showCardOptions, setShowCardOptions] = useState(false);

  const selectedCards = Array.isArray(selectedCardIds)
    ? selectedCardIds.map((id) => allCards.find((c) => c.id === id)).filter(Boolean)
    : null;

  const isSaveDisabled =
    removable && ((Array.isArray(selectedCards) && selectedCards.length === 0) || !message?.trim());

  const handleAddCard = (card) => {
    if (!selectedCardIds.includes(card.id)) {
      dispatch(addSelectedCard({ id: itemId, cardId: card.id }));
    }
    setShowCardOptions(false);
  };

  const handleRemoveCard = (id) => {
    dispatch(removeSelectedCard({ id: itemId, cardId: id }));
  };

  return (
    <Card>
      <TitleRow>
        <Title>{title}</Title>
        <ToggleSwitch
          checked={!!enabled}
          onChange={lockToggle ? () => {} : onToggle}
          disabled={lockToggle}
        />
      </TitleRow>

      <Subtitle>Уведомление о смене сегмента</Subtitle>
      <Line />

      <div>
        <Subtitle>Текст сообщения</Subtitle>
        <Textarea
          value={message}
          onChange={(e) => onChangeMessage(e.target.value)}
          disabled={!editableMessage}
          style={!editableMessage ? { opacity: 0.7, cursor: 'not-allowed' } : undefined}
        />
      </div>

      <div>
        <Subtitle>
          Уведомление будет выслано через указанное количество часов после смены сегмента
        </Subtitle>
        <CustomInput
          type="number"
          value={delay}
          onChange={(e) => onChangeDelay(e.target.value)}
          min={0}
          style={{
            marginLeft: '15px',
            marginRight: '15px',
          }}
        />
      </div>

      {/* Read-only теги выбранных карт (если передали selectedCardIds) */}
      {Array.isArray(selectedCards) && (
        <>
          <Line />
          <Subtitle>Применить к картам:</Subtitle>
          <TagWrapper>
            {selectedCards.length === 0 && (
              <>
                <Label>Ничего не выбрано</Label>
                <Tag onClick={() => setShowCardOptions(true)}>＋</Tag>
              </>
            )}
            {selectedCards.map((card) => (
              <Tag key={card.id}>
                {card.name || card.title}
                <span onClick={() => handleRemoveCard(card.id)}>✕</span>
              </Tag>
            ))}
            {selectedCards.length > 0 && selectedCards.length < allCards.length && (
              <Tag onClick={() => setShowCardOptions(true)}>＋</Tag>
            )}
          </TagWrapper>

          {/* Список карточек для выбора */}
          {showCardOptions && (
            <CardPicker>
              {allCards
                .filter((card) => !selectedCardIds.includes(card.id))
                .map((card) => (
                  <CardOption key={card.id} onClick={() => handleAddCard(card)}>
                    {card.name || card.title} <span>＋</span>
                  </CardOption>
                ))}
            </CardPicker>
          )}
        </>
      )}

      <ButtonRow>
        <Button onClick={onSave} disabled={isSaveDisabled}>
          Сохранить
        </Button>
        {removable && (
          <TrashButton onClick={onRemove}>
            <Trash2 size={20} />
          </TrashButton>
        )}
      </ButtonRow>
    </Card>
  );
};

export default AutoPushCard;
