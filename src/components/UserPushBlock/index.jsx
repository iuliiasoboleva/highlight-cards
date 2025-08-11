import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import CustomInput from '../../customs/CustomInput';
import CustomSelect from '../../customs/CustomSelect';
import { mockUserPushes } from '../../mocks/mockUserPushes';
import { updateCurrentCardField } from '../../store/cardsSlice';
import {
  Actions,
  BlackButton,
  CardOption,
  CardPicker,
  FormTitle,
  FormWrapper,
  Label,
  Tag,
  TagWrapper,
  WhiteButton,
} from './styles';

const UserPushBlock = () => {
  const dispatch = useDispatch();

  const allCards = useSelector((state) => state.cards.cards);
  const currentCard = useSelector((state) => state.cards.currentCard);
  const pushNotification = currentCard?.pushNotification || {};

  const selectedTriggerKey = pushNotification?.triggerKey || null;
  const message = pushNotification?.message || '';
  const delayValue = pushNotification?.delay?.value || 0;
  const delayUnit = pushNotification?.delay?.unit || 'days';
  const selectedCards = pushNotification?.cards || [];

  const [showCardOptions, setShowCardOptions] = useState(false);

  const handleTriggerSelect = (key) => {
    const selected = mockUserPushes.find((item) => item.key === key);
    dispatch(
      updateCurrentCardField({
        path: 'pushNotification.triggerKey',
        value: key,
      }),
    );
    dispatch(
      updateCurrentCardField({
        path: 'pushNotification.message',
        value: selected?.defaultMessage || '',
      }),
    );
  };

  const handleMessageChange = (e) => {
    dispatch(
      updateCurrentCardField({
        path: 'pushNotification.message',
        value: e.target.value,
      }),
    );
  };

  const handleDelayValueChange = (e) => {
    dispatch(
      updateCurrentCardField({
        path: 'pushNotification.delay.value',
        value: Number(e.target.value),
      }),
    );
  };

  const handleDelayUnitChange = (unit) => {
    dispatch(
      updateCurrentCardField({
        path: 'pushNotification.delay.unit',
        value: unit,
      }),
    );
  };

  const handleAddCard = (card) => {
    const exists = selectedCards.some((c) => c.id === card.id);
    if (!exists) {
      const newCards = [...selectedCards, card];
      dispatch(
        updateCurrentCardField({
          path: 'pushNotification.cards',
          value: newCards,
        }),
      );
    }
    setShowCardOptions(false);
  };

  const handleRemoveCard = (id) => {
    const newCards = selectedCards.filter((c) => c.id !== id);
    dispatch(
      updateCurrentCardField({
        path: 'pushNotification.cards',
        value: newCards,
      }),
    );
  };

  const handleCancel = () => {
    dispatch(updateCurrentCardField({ path: 'pushNotification', value: {} }));
    setShowCardOptions(false);
  };

  return (
    <FormWrapper>
      <FormTitle>Добавить авто-push</FormTitle>
      <Label>Настройте сценарий отправки автоматического push-уведомления</Label>

      {!selectedTriggerKey ? (
        <CustomSelect
          value={selectedTriggerKey}
          onChange={handleTriggerSelect}
          placeholder="Выберите триггер для запуска авто-push"
          options={mockUserPushes.map((item) => ({
            value: item.key,
            label: item.title,
          }))}
        />
      ) : (
        <>
          <CustomSelect
            value={selectedTriggerKey}
            onChange={handleTriggerSelect}
            placeholder="Для условия"
            options={mockUserPushes.map((item) => ({
              value: item.key,
              label: item.title,
            }))}
          />

          <Label>
            Для условия "{mockUserPushes.find((i) => i.key === selectedTriggerKey)?.title}"
          </Label>

          <CustomInput value={message} onChange={handleMessageChange} placeholder="Введите текст" />
          <Label>Сообщение будет выслано по истечении</Label>
          <CustomInput type="number" value={delayValue} onChange={handleDelayValueChange} min={0} />
          <CustomSelect
            value={delayUnit}
            onChange={handleDelayUnitChange}
            options={[
              { value: 'minutes', label: 'Минут' },
              { value: 'hours', label: 'Часов' },
              { value: 'days', label: 'Дней' },
              { value: 'weeks', label: 'Недель' },
              { value: 'months', label: 'Месяцев' },
            ]}
            placeholder="Дней"
          />

          {/* Блок тегов */}
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
                .filter((card) => !selectedCards.some((c) => c.id === card.id))
                .map((card) => (
                  <CardOption key={card.id} onClick={() => handleAddCard(card)}>
                    {card.name || card.title} <span>＋</span>
                  </CardOption>
                ))}
            </CardPicker>
          )}

          <Actions>
            <BlackButton>Сохранить</BlackButton>
            <WhiteButton onClick={handleCancel}>Отменить</WhiteButton>
          </Actions>
        </>
      )}
    </FormWrapper>
  );
};

export default UserPushBlock;
