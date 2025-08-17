import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import EditLayout from '../../components/EditLayout';
import TitleWithHelp from '../../components/TitleWithHelp';
import { setCurrentCard, updateCurrentCardField } from '../../store/cardsSlice';
import { cardTypes } from './cardTypes';
import {
  BottomText,
  CreateButton,
  Divider,
  Grid,
  StepNote,
  TitleRow,
  TypeCard,
  TypeDesc,
  TypeName,
  TypeTag,
} from './styles';

const EditType = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentCard, cards } = useSelector((state) => state.cards);

  const [selectedType, setSelectedType] = useState(currentCard.status || 'stamp');

  useEffect(() => {
    if (!currentCard.id) {
      const newId = cards?.length > 0 ? Math.max(...cards.map((c) => c.id)) + 1 : 1;
      dispatch(setCurrentCard({ id: newId, status: 'stamp', name: 'Штамп' }));
    }
  }, [dispatch, cards, currentCard.id]);

  useEffect(() => {
    if (currentCard.status) {
      setSelectedType(currentCard.status);
    }
  }, [currentCard.status]);

  const handleTypeSelect = (typeId) => {
    setSelectedType(typeId);
    const cardName = cardTypes.find((t) => t.id === typeId)?.name || 'Карта';
    dispatch(updateCurrentCardField({ path: 'status', value: typeId }));
    dispatch(updateCurrentCardField({ path: 'name', value: cardName }));
  };

  const handleContinue = () => {
    if (!selectedType) return;
    navigate(`/cards/${currentCard.id}/edit/design`);
  };

  return (
    <EditLayout>
      <div>
        <TitleRow>
          <TitleWithHelp
            title="Выберите тип карты"
            tooltipId="edit-type-help"
            tooltipHtml
            tooltipContent="Выберите тип карты для дальнейшей настройки"
          />
          <StepNote>Шаг 1 из 4</StepNote>
        </TitleRow>
        <Divider />
      </div>
      <Grid>
        {cardTypes.map((type) => {
          const Icon = type.icon;
          const isSelected = selectedType === type.id;
          return (
            <TypeCard
              key={type.id}
              type="button"
              $selected={isSelected}
              onClick={() => handleTypeSelect(type.id)}
              aria-pressed={isSelected}
            >
              <Icon />
              <TypeName>{type.name}</TypeName>
              <TypeDesc $selected={isSelected}>{type.desc}</TypeDesc>
              <TypeTag $kind={type.tag}>
                {type.tag === 'high' ? 'Высокий уровень удержания' : 'Лучшее для покупок'}
              </TypeTag>
            </TypeCard>
          );
        })}
      </Grid>

      <CreateButton onClick={handleContinue} disabled={!selectedType}>
        Перейти к следующему шагу
      </CreateButton>
      <BottomText>
        Вы выбрали карту типа {selectedType}. Перейдите к следующему шагу, чтобы настроить срок
        действия и другие параметры
      </BottomText>
    </EditLayout>
  );
};

export default EditType;
