import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CardInfo from '../../components/CardInfo';
import BarcodeTypeSelector from './BarcodeTypeSelector';
import RewardProgramSelector from './RewardProgramSelector';
import PointsEarningConfig from './PointsEarningConfig';
import './styles.css';
import LocationModal from './LocationModal';

const EditSettings = ({ cardType }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [showLocationModal, setShowLocationModal] = useState(false);
  const [barcodeType, setBarcodeType] = useState('qrcode');
  const [rewardProgram, setRewardProgram] = useState('spending');
  const [earningConfig, setEarningConfig] = useState({
    spendingAmount: 1.0,
    points: 10,
  });

  const handleSave = () => {
    console.log({
      barcodeType,
      rewardProgram,
      earningConfig,
    });
    navigate(`/cards/${id}/edit/design`);
  };

  return (
    <div className="edit-type-main-container">
      <div className="edit-type-page">
        <h2>Настройки</h2>
        <hr />

        <BarcodeTypeSelector value={barcodeType} onChange={setBarcodeType} />
        <RewardProgramSelector value={rewardProgram} onChange={setRewardProgram} />
        <PointsEarningConfig {...earningConfig} onChange={setEarningConfig} />

        {showLocationModal && (
          <LocationModal
            onClose={() => setShowLocationModal(false)}
            onSave={(location) => {
              console.log('Добавлена локация:', location);
              // setLocations([...locations, location]) — если хочешь хранить
            }}
          />
        )}

        <button onClick={() => setShowLocationModal(true)}>
          Добавить локацию
        </button>

        <button onClick={handleSave} className="create-button">
          Сохранить и продолжить
        </button>
      </div>

      <div className="type-card-image-container">
        <img className="card-image-add" src="/phone.svg" alt="preview" />
        <CardInfo card={{ id, title: 'Карта', name: 'Накопительная карта' }} />
      </div>
    </div>
  );
};

export default EditSettings;
