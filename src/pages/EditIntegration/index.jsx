import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import EditLayout from '../../components/EditLayout';
import TitleWithHelp from '../../components/TitleWithHelp';
import { createCard, saveCard, setCurrentCard, updateCurrentCardField } from '../../store/cardsSlice';
import { CreateButton } from '../EditDesign/styles';
import IntegrationPicker from './IntegrationPicker';
import { Divider, StepNote, TopRow } from './styles';

const EditIntegration = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const currentCard = useSelector((state) => state.cards.currentCard);

  const cards = useSelector((state) => state.cards.cards);
  const exists = cards.some((c) => c.id === currentCard?.id && c.id !== 'fixed');
  const integration = currentCard?.integration || null;

  const handlePick = (key) => {
    dispatch(updateCurrentCardField({ path: 'integration', value: key }));
  };

  const handleActivate = async () => {
    try {
      if (!exists) {
        const createdCard = await dispatch(createCard()).unwrap();
        // Обновляем currentCard данными созданной карты
        dispatch(setCurrentCard(createdCard));
        // Устанавливаем все поля готовности в true, поскольку карта создана
        dispatch(updateCurrentCardField({ path: 'typeReady', value: true }));
        dispatch(updateCurrentCardField({ path: 'designReady', value: true }));
        dispatch(updateCurrentCardField({ path: 'settingsReady', value: true }));
        dispatch(updateCurrentCardField({ path: 'infoReady', value: true }));
        // Переходим сразу на страницу info созданной карты
        navigate(`/cards/${createdCard.id}/info`, { state: { skipLeaveGuard: true } });
        return;
      } else {
        await dispatch(saveCard()).unwrap();
      }
      dispatch(updateCurrentCardField({ path: 'active', value: true }));
      navigate('/cards', { state: { skipLeaveGuard: true } });
    } catch (e) {
      console.error('Ошибка при активации карты', e);
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
      <IntegrationPicker value={integration} onChange={handlePick} />

      <CreateButton onClick={handleActivate}>Продолжить</CreateButton>
    </>
  );

  return <EditLayout>{integrationContent}</EditLayout>;
};

export default EditIntegration;
