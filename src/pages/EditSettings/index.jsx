import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import CardInfo from '../../components/CardInfo';
import BarcodeTypeSelector from './BarcodeRadio';
import LocationModal from './LocationModal';
import PointsEarningConfig from './PointsEarningConfig';
import RewardProgramSelector from './RewardProgramSelector';

import './styles.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleQuestion } from '@fortawesome/free-solid-svg-icons';
import BarcodeCheckbox from './BarcodeRadio';

const EditSettings = ({ cardType }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  const [activeTab, setActiveTab] = useState('description');

  const [showLocationModal, setShowLocationModal] = useState(false);
  const [barcodeTypes, setBarcodeTypes] = useState(['qrcode']);
  const [barcodeType, setBarcodeType] = useState('qrcode');
  const [rewardProgram, setRewardProgram] = useState('spending');
  const [earningConfig, setEarningConfig] = useState({
    spendingAmount: 1.0,
    points: 10,
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth >= 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
      {isMobile && (
        <div className="edit-type-tabs">
          <button
            className={`edit-type-tab ${activeTab === 'description' ? 'active' : ''}`}
            onClick={() => setActiveTab('description')}
          >
            Описание
          </button>
          <button
            className={`edit-type-tab ${activeTab === 'card' ? 'active' : ''}`}
            onClick={() => setActiveTab('card')}
          >
            Карта
          </button>
        </div>
      )}

      {isMobile ? (
        <div className="edit-type-content">
          {activeTab === 'description' && (
            <div className="edit-type-page">
              <h2>
                Настройки <FontAwesomeIcon icon={faCircleQuestion} style={{ fontSize: 16 }} />
              </h2>
              <hr />

              <BarcodeCheckbox
                options={[
                  { value: 'pdf417', label: 'PDF 417' },
                  { value: 'qrcode', label: 'QR Code' }
                ]}
                selected={barcodeType}
                onChange={(value) => setBarcodeType(value)}
                title={'Тип штрихкода'}
              />
              <RewardProgramSelector value={rewardProgram} onChange={setRewardProgram} />
              <PointsEarningConfig {...earningConfig} onChange={setEarningConfig} />

              {showLocationModal && (
                <LocationModal
                  onClose={() => setShowLocationModal(false)}
                  onSave={(location) => {
                    console.log('Добавлена локация:', location);
                  }}
                />
              )}

              <button onClick={() => setShowLocationModal(true)}>Добавить локацию</button>

              <button onClick={handleSave} className="create-button">
                Сохранить и продолжить
              </button>
            </div>
          )}

          {activeTab === 'card' && (
            <div className="type-card-image-container">
              <img className="card-image-add" src="/phone.svg" alt="preview" />
              <CardInfo card={{ id, title: 'Карта', name: 'Накопительная карта' }} />
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="edit-type-page">
            <h2>Настройки</h2>
            <hr />

            {/* <BarcodeTypeSelector value={barcodeType} onChange={setBarcodeType} /> */}
            <RewardProgramSelector value={rewardProgram} onChange={setRewardProgram} />
            <PointsEarningConfig {...earningConfig} onChange={setEarningConfig} />

            {showLocationModal && (
              <LocationModal
                onClose={() => setShowLocationModal(false)}
                onSave={(location) => {
                  console.log('Добавлена локация:', location);
                }}
              />
            )}

            <button onClick={() => setShowLocationModal(true)}>Добавить локацию</button>

            <button onClick={handleSave} className="create-button">
              Сохранить и продолжить
            </button>
          </div>

          <div className="type-card-image-container">
            <img className="card-image-add" src="/phone.svg" alt="preview" />
            <CardInfo card={{ id, title: 'Карта', name: 'Накопительная карта' }} />
          </div>
        </>
      )}
    </div>
  );
};

export default EditSettings;
