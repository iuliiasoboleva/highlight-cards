import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import axiosInstance from '../../axiosInstance';
import EditLayout from '../../components/EditLayout';
import TitleWithHelp from '../../components/TitleWithHelp';
import {
  createCard,
  saveCard,
  setCurrentCard,
  updateCurrentCardField,
} from '../../store/cardsSlice';
import { CreateButton } from '../EditDesign/styles';
import IntegrationPicker from './IntegrationPicker';
import { Divider, StepNote, TopRow } from './styles';

const EditIntegration = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const currentCard = useSelector((state) => state.cards.currentCard);
  const [isLoading, setIsLoading] = React.useState(false);
  const [pendingIntegration, setPendingIntegration] = React.useState(null);

  const isCreatingNewCard = !id || id === 'new' || id === 'fixed';
  const integration = currentCard?.integration || null;

  const handlePick = (key) => {
    dispatch(updateCurrentCardField({ path: 'integration', value: key }));
  };

  const handlePendingIntegration = (data) => {
    setPendingIntegration(data);
  };

  const createIntegrationForCard = async (cardId) => {
    if (!pendingIntegration || pendingIntegration.type !== 'r_keeper') return;
    
    try {
      await axiosInstance.post('/rkeeper/integration', {
        card_id: cardId,
        restaurant_code: pendingIntegration.restaurant_code,
      });
    } catch (err) {
      console.error('Ошибка при создании интеграции:', err);
    }
  };

  const handleActivate = async () => {
    setIsLoading(true);
    try {
      if (isCreatingNewCard) {
        const createdCard = await dispatch(createCard()).unwrap();
        
        if (pendingIntegration) {
          await createIntegrationForCard(createdCard.id);
        }
        
        dispatch(setCurrentCard(createdCard));
        dispatch(updateCurrentCardField({ path: 'typeReady', value: true }));
        dispatch(updateCurrentCardField({ path: 'designReady', value: true }));
        dispatch(updateCurrentCardField({ path: 'settingsReady', value: true }));
        dispatch(updateCurrentCardField({ path: 'infoReady', value: true }));
        navigate(`/cards/${createdCard.id}/info`, { state: { skipLeaveGuard: true } });
        return;
      } else {
        const savedCard = await dispatch(saveCard()).unwrap();
        dispatch(setCurrentCard(savedCard));
        dispatch(updateCurrentCardField({ path: 'typeReady', value: true }));
        dispatch(updateCurrentCardField({ path: 'designReady', value: true }));
        dispatch(updateCurrentCardField({ path: 'settingsReady', value: true }));
        dispatch(updateCurrentCardField({ path: 'infoReady', value: true }));
        dispatch(updateCurrentCardField({ path: 'active', value: true }));
        navigate(`/cards/${savedCard.id}/info`, { state: { skipLeaveGuard: true } });
        return;
      }
    } catch (e) {
      console.error('Ошибка при активации карты', e);
      setIsLoading(false);
      if (e?.detail === 'Карта не найдена') {
        alert('Карта не найдена. Возможно, она была удалена. Перенаправляем на список карт.');
        navigate('/cards');
      } else {
        alert(`Ошибка: ${e?.detail || e?.message || 'Не удалось сохранить карту'}`);
      }
    }
  };

  const integrationContent = (
    <>
      <div>
        <TopRow>
          <TitleWithHelp
            title={'Интеграция'}
            tooltipId="integration-help"
            tooltipHtml
            tooltipContent={``}
          />
          <StepNote>Шаг 5 из 5</StepNote>
        </TopRow>
        <Divider />
      </div>
      <IntegrationPicker 
        value={integration} 
        onChange={handlePick} 
        isCreatingCard={isCreatingNewCard}
        onPendingIntegration={handlePendingIntegration}
        pendingIntegration={pendingIntegration}
      />

      <CreateButton onClick={handleActivate} disabled={isLoading}>
        {isLoading
          ? 'Создаю...'
          : isCreatingNewCard
            ? 'Создать карту'
            : 'Сохранить изменения'}
      </CreateButton>
    </>
  );

  return <EditLayout>{integrationContent}</EditLayout>;
};

export default EditIntegration;
