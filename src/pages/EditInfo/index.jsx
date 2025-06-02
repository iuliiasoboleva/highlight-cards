import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { HelpCircle } from 'lucide-react';

import EditLayout from '../../components/EditLayout';
import QRPopup from '../../components/QRPopup';
import { updateCurrentCardField } from '../../store/cardsSlice';
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

  const infoContent = (
    <div className="settings-inputs-container">
      <h2>
        Информация <HelpCircle size={16} />
      </h2>
      <hr />

      <h3 className="barcode-radio-title">
        Описание карты <HelpCircle size={16} style={{ marginLeft: 6 }} />
      </h3>
      <textarea
        className="custom-textarea"
        value={infoFields.description}
        onChange={handleFieldChange('description')}
        placeholder="Введите описание карты"
      />

      <h3 className="barcode-radio-title">
        Название компании <HelpCircle size={16} style={{ marginLeft: 6 }} />
      </h3>
      <textarea
        className="custom-textarea"
        value={infoFields.companyName}
        onChange={handleFieldChange('companyName')}
        placeholder="Название компании"
      />

      <hr />
      <ReferralProgramConfig />

      <h3 className="barcode-radio-title">
        Название компании <HelpCircle size={16} style={{ marginLeft: 6 }} />
      </h3>
      <input
        type="text"
        className="custom-input"
        value={infoFields.companyName}
        onChange={handleFieldChange('companyName')}
        placeholder="Введите название компании"
      />

      <h3 className="barcode-radio-title">
        Описание награды <HelpCircle size={16} style={{ marginLeft: 6 }} />
      </h3>
      <textarea
        className="custom-textarea"
        value={infoFields.rewardDescription}
        onChange={handleFieldChange('rewardDescription')}
        placeholder="Введите описание награды"
      />

      <h3 className="barcode-radio-title">
        Сообщение о начисленном штампе <HelpCircle size={16} style={{ marginLeft: 6 }} />
      </h3>
      <input
        type="text"
        className="custom-input"
        value={infoFields.stampMessage}
        onChange={handleFieldChange('stampMessage')}
        placeholder="Введите сообщение"
      />

      <h3 className="barcode-radio-title">
        Сообщение о начисленной награде <HelpCircle size={16} style={{ marginLeft: 6 }} />
      </h3>
      <input
        type="text"
        className="custom-input"
        value={infoFields.claimRewardMessage}
        onChange={handleFieldChange('claimRewardMessage')}
        placeholder="Введите сообщение"
      />

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
