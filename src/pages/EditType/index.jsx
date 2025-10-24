import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import axiosInstance from '../../axiosInstance';
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
  TopRow,
  TypeCard,
  TypeDesc,
  TypeName,
  TypeTag,
} from './styles';

const EditType = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { currentCard, cards } = useSelector((state) => state.cards);
  const user = useSelector((state) => state.user);

  const [selectedType, setSelectedType] = useState(currentCard.status || 'stamp');
  const selectedTypeName = cardTypes.find((t) => t.id === selectedType)?.name || '';

  useEffect(() => {
    const loadCardData = async () => {
      if (!currentCard.id) {
        // Для редактирования существующей карты
        if (id) {
          // Сначала проверим в локальном состоянии
          const existingCard = cards.find((c) => c.id === id);
          if (existingCard) {
            dispatch(setCurrentCard(existingCard));
            return;
          }

          // Если не нашли в локальном состоянии, загрузим по API
          try {
            const response = await axiosInstance.get(`/cards/${id}`);
            dispatch(setCurrentCard(response.data));
            return;
          } catch (error) {
            console.error('Ошибка загрузки карты:', error);
          }
        }

        // Для создания новой карты
        dispatch(setCurrentCard({ 
          id: null, 
          status: 'stamp', 
          name: 'Штамп',
          infoFields: {
            issuerName: user.company || '',
            issuerEmail: user.email || '',
            issuerPhone: user.phone || '',
          }
        }));
      }
    };

    loadCardData();
  }, [dispatch, cards, currentCard.id, id, user.company, user.email, user.phone]);

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
    dispatch(updateCurrentCardField({ path: 'typeReady', value: true }));
    navigate(`/cards/${currentCard.id}/edit/design`);
  };

  return (
    <EditLayout>
      <div>
        <TopRow>
          <TitleWithHelp
            title="Выберите тип карты"
            tooltipId="edit-type-help"
            tooltipHtml
            tooltipContent="Выберите тип карты для дальнейшей настройки"
          />
          <StepNote>Шаг 1 из 5</StepNote>
        </TopRow>
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
        Вы выбрали карту типа {selectedTypeName}. Перейдите к следующему шагу, чтобы настроить срок
        действия и другие параметры
      </BottomText>
    </EditLayout>
  );
};

export default EditType;
