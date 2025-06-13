import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { HelpCircle } from 'lucide-react';

import EditLayout from '../../components/EditLayout';
import QRPopup from '../../components/QRPopup';
import { updateCurrentCardField } from '../../store/cardsSlice';
import BarcodeRadio from '../EditSettings/BarcodeRadio';
import LabeledTextarea from './LabeledTextarea';
import ReferralProgramConfig from './ReferralProgramConfig';

import './styles.css';

const EditInfo = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const currentCard = useSelector((state) => state.cards.currentCard);
  const [showQRPopup, setShowQRPopup] = useState(false);

  const infoFields = currentCard.infoFields || {
    description: '',
    howToGetStamp: '',
    companyName: '',
    rewardDescription: '',
    stampMessage: '',
    claimRewardMessage: '',
  };

  const handleFieldChange = useCallback(
    (field) => (e) => {
      const newInfoFields = {
        ...infoFields,
        [field]: e.target.value,
      };
      dispatch(updateCurrentCardField({ path: 'infoFields', value: newInfoFields }));
    },
    [dispatch, infoFields],
  );

  const handleMultiRewardsChange = (e) => {
    const rawValue = e.target.value;

    const numberArray = rawValue
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item !== '')
      .map((item) => parseInt(item, 10))
      .filter((num) => !isNaN(num));

    dispatch(
      updateCurrentCardField({
        path: 'infoFields',
        value: {
          ...infoFields,
          multiRewardsInput: rawValue,
          multiRewards: numberArray,
        },
      }),
    );
  };

  const infoContent = (
    <div className="settings-inputs-container">
      <h2>
        Информация <HelpCircle size={16} />
      </h2>
      <hr />

      <LabeledTextarea
        label="Описание карты"
        value={infoFields.description}
        onChange={handleFieldChange('description')}
        placeholder="Введите описание карты"
        required
      />
      <LabeledTextarea
        label="Как клиенту получить штамп"
        value={infoFields.howToGetStamp}
        onChange={handleFieldChange('howToGetStamp')}
        placeholder=""
        required
      />
      <LabeledTextarea
        label="Название компании"
        value={infoFields.companyName}
        onChange={handleFieldChange('companyName')}
        placeholder="Название компании"
        required
      />
      <LabeledTextarea
        label="Описание награды"
        value={infoFields.rewardDescription}
        onChange={handleFieldChange('rewardDescription')}
        placeholder=""
        required
      />
      <LabeledTextarea
        label="Сообщение о начисленном штампе"
        value={infoFields.stampMessage}
        subtitle={'Тег {#} обязателен для заполнения'}
        onChange={handleFieldChange('stampMessage')}
        placeholder=""
        required
      />
      <LabeledTextarea
        label="Сообщение о начисленной награде"
        value={infoFields.claimRewardMessage}
        onChange={handleFieldChange('claimRewardMessage')}
        placeholder=""
        required
      />
      <hr />
      <LabeledTextarea
        label="Мультинаграды"
        subtitle={
          'Укажите через запятую, при каких количествах полученных штампов будет начисляться данная награда. Если оставить поле пустым, то награда будет начисляться при достижении максимального количества штампов.'
        }
        value={infoFields.multiRewardsInput || ''}
        onChange={handleMultiRewardsChange}
        placeholder="Например: 3,5,7"
      />
      <BarcodeRadio
        options={[
          { value: 'true', label: 'Да' },
          { value: 'false', label: 'Нет' },
        ]}
        title="Списывать награду автоматически?"
        subtitle="После накопления необходимого количества штампов награда будет списана автоматически при очередном визите"
        selected={String(infoFields.autoRedeem)}
        onChange={(value) => {
          dispatch(
            updateCurrentCardField({ path: 'infoFields.autoRedeem', value: value === 'true' }),
          );
        }}
        name="auto-redeem"
        additionalContentByValue={{}}
      />

      <hr />
      <ReferralProgramConfig />

      <button onClick={() => setShowQRPopup(true)} className="create-button">
        Завершить
      </button>
    </div>
  );

  return (
    <>
      <EditLayout>{infoContent}</EditLayout>
      {showQRPopup && <QRPopup cardId={id} onClose={() => setShowQRPopup(false)} />}
    </>
  );
};

export default EditInfo;
