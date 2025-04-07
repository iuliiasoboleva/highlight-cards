import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { faCircleQuestion } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import CardInfo from '../../components/CardInfo';
import BarcodeRadio from './BarcodeRadio';
import LocationModal from './LocationModal';

import './styles.css';

const EditSettings = ({ cardType }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  const [activeTab, setActiveTab] = useState('description');

  const [showLocationModal, setShowLocationModal] = useState(false);
  const [barcodeType, setBarcodeType] = useState('qrcode');
  const [rewardProgram, setRewardProgram] = useState('spending');
  const [cardLimit, setCardLimit] = useState('cardUnlimit');
  const [stampLimit, setStampLimit] = useState('stampUnlimit');
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
    navigate(`/cards/${id}/edit/design`);
  };

  const radioConfigs = [
    {
      options: [
        { value: 'pdf417', label: 'PDF 417' },
        { value: 'qrcode', label: 'QR Code' },
      ],
      selected: barcodeType,
      onChange: setBarcodeType,
      title: 'Тип штрихкода',
      name: 'barcode-type',
    },
    {
      options: [
        {
          value: 'spending',
          label: 'Расход (Начисление штампов в зависимости от расходов клиента)',
        },
        {
          value: 'visit',
          label: 'Визит (Начисление штампов в зависимости от количества посещений клиента)',
        },
        { value: 'stamps', label: 'Штампы (Начисление штампов в соответствии с вашими правилами)' },
      ],
      selected: rewardProgram,
      onChange: setRewardProgram,
      title: 'Программа вознаграждения',
      name: 'reward-program',
    },
    {
      options: [
        { value: 'cardUnlimit', label: 'Неограниченный' },
        { value: 'cardFixed', label: 'Фиксированный срок' },
        { value: 'cardFixedLater', label: 'Фиксированный срок после регистрации карты' },
      ],
      selected: cardLimit,
      onChange: setCardLimit,
      title: 'Срок действия карты',
      name: 'card-limit',
    },
    {
      options: [
        { value: 'stampUnlimit', label: 'Неограниченный' },
        { value: 'stampFixedLater', label: 'Фиксированный срок после получения штампов' },
      ],
      selected: stampLimit,
      onChange: setStampLimit,
      title: 'Срок жизни штампа',
      name: 'stamp-limit',
    },
  ];

  const settingsContent = (
    <>
      <h2>
        Настройки <FontAwesomeIcon icon={faCircleQuestion} style={{ fontSize: 16 }} />
      </h2>
      <hr />

      {radioConfigs.map((config, index) => (
        <React.Fragment key={config.name}>
          <BarcodeRadio {...config} />
          {index < radioConfigs.length - 1 && <hr />}
        </React.Fragment>
      ))}

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
    </>
  );

  const cardPreviewContent = (
    <div className="type-card-image-container">
      <img className="card-image-add" src="/phone.svg" alt="preview" />
      <CardInfo card={{ id, title: 'Карта', name: 'Накопительная карта' }} />
    </div>
  );

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
          {activeTab === 'description' && <div className="edit-type-page">{settingsContent}</div>}

          {activeTab === 'card' && cardPreviewContent}
        </div>
      ) : (
        <>
          <div className="edit-type-page">{settingsContent}</div>
          {cardPreviewContent}
        </>
      )}
    </div>
  );
};

export default EditSettings;
