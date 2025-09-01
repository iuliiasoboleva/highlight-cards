import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import EditLayout from '../../components/EditLayout';
import QRPopup from '../../components/QRPopup';
import TitleWithHelp from '../../components/TitleWithHelp';
import { createCard, saveCard, updateCurrentCardField } from '../../store/cardsSlice';
import { CreateButton } from '../EditDesign/styles';
import IntegrationPicker from './IntegrationPicker';
import { Divider, StepNote, TopRow } from './styles';

const EditIntegration = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const currentCard = useSelector((state) => state.cards.currentCard);
  const [showQRPopup, setShowQRPopup] = useState(false);

  const cards = useSelector((state) => state.cards.cards);
  const exists = cards.some((c) => c.id === currentCard?.id && c.id !== 'fixed');
  const integration = currentCard?.integration || null;

  const handlePick = (key) => {
    dispatch(updateCurrentCardField({ path: 'integration', value: key }));
  };

  const handleActivate = async () => {
    try {
      if (!exists) {
        await dispatch(createCard()).unwrap();
      } else {
        await dispatch(saveCard()).unwrap();
      }
      dispatch(updateCurrentCardField({ path: 'active', value: true }));
    } catch (e) {
      console.error('Ошибка при активации карты', e);
    } finally {
      navigate('/cards', { state: { skipLeaveGuard: true } });
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

      <CreateButton onClick={() => setShowQRPopup(true)}>Продолжить</CreateButton>
    </>
  );

  return (
    <>
      <EditLayout>{integrationContent}</EditLayout>
      {showQRPopup && (
        <QRPopup
          cardId={id}
          onClose={() => {
            setShowQRPopup(false);
          }}
          activateCard={handleActivate}
        />
      )}
    </>
  );
};

export default EditIntegration;
