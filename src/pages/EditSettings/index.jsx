import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { faCircleQuestion } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import CardInfo from '../../components/CardInfo';
import CustomSelect from '../../components/CustomSelect';
import { updateCurrentCard } from '../../store/cardsSlice';
import BarcodeRadio from './BarcodeRadio';
import LocationModal from './LocationModal';

import './styles.css';

const EditSettings = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentCard = useSelector((state) => state.cards.currentCard);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  const [activeTab, setActiveTab] = useState('description');

  const [showLocationModal, setShowLocationModal] = useState(false);
  const [settings, setSettings] = useState({
    barcodeType: currentCard.settings?.barcodeType || 'qrcode',
    rewardProgram: currentCard.settings?.rewardProgram || 'spending',
    cardLimit: currentCard.settings?.cardLimit || 'cardUnlimit',
    stampLimit: currentCard.settings?.stampLimit || 'stampUnlimit',
    stampDuration: currentCard.settings?.stampDuration || { value: 1, unit: 'days' },
    locations: currentCard.settings?.locations || [],
  });

  const durationOptions = [
    { value: 'days', label: 'Дней' },
    { value: 'months', label: 'Месяцев' },
    { value: 'years', label: 'Лет' },
  ];

  const numberOptions = Array.from({ length: 30 }, (_, i) => ({
    value: i + 1,
    label: (i + 1).toString(),
  }));

  const handleBarcodeTypeChange = (value) => {
    dispatch(
      updateCurrentCard({
        settings: {
          barcodeType: value
        }
      }))
    setSettings((prev) => ({ ...prev, barcodeType: value }));
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth >= 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSave = () => {
    dispatch(
      updateCurrentCard({
        settings: {
          ...settings,
          updatedAt: new Date().toISOString(),
        },
      }),
    );
    navigate(`/cards/${id}/edit/design`);
  };

  const handleAddLocation = (location) => {
    setSettings((prev) => ({
      ...prev,
      locations: [...prev.locations, location],
    }));
  };

  const radioConfigs = [
    {
      options: [
        { value: 'pdf417', label: 'PDF 417' },
        { value: 'qrcode', label: 'QR Code' },
      ],
      selected: settings.barcodeType,
      onChange: handleBarcodeTypeChange,
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
      selected: settings.rewardProgram,
      onChange: (value) => setSettings((prev) => ({ ...prev, rewardProgram: value })),
      title: 'Программа вознаграждения',
      name: 'reward-program',
    },
    {
      options: [
        { value: 'cardUnlimit', label: 'Неограниченный' },
        { value: 'cardFixed', label: 'Фиксированный срок' },
        { value: 'cardFixedLater', label: 'Фиксированный срок после регистрации карты' },
      ],
      selected: settings.cardLimit,
      onChange: (value) => setSettings((prev) => ({ ...prev, cardLimit: value })),
      title: 'Срок действия карты',
      name: 'card-limit',
    },
    {
      options: [
        { value: 'stampUnlimit', label: 'Неограниченный' },
        { value: 'stampFixedLater', label: 'Фиксированный срок после получения штампов' },
      ],
      selected: settings.stampLimit,
      onChange: (value) => setSettings((prev) => ({ ...prev, stampLimit: value })),
      title: 'Срок жизни штампа',
      name: 'stamp-limit',
      additionalContentKey: 'stampFixedLater',
      additionalContent: (
        <>
          <h3 className="barcode-radio-title">Срок</h3>
          <div className="stamp-duration-selector">
            <CustomSelect
              value={settings.stampDuration.value}
              onChange={(value) =>
                setSettings((prev) => ({
                  ...prev,
                  stampDuration: {
                    ...prev.stampDuration,
                    value: parseInt(value),
                  },
                }))
              }
              options={numberOptions}
              className="duration-number-select"
            />
            <CustomSelect
              value={settings.stampDuration.unit}
              onChange={(unit) =>
                setSettings((prev) => ({
                  ...prev,
                  stampDuration: {
                    ...prev.stampDuration,
                    unit,
                  },
                }))
              }
              options={durationOptions}
              className="duration-unit-select"
            />
          </div>
        </>
      ),
    },
  ];

  const settingsContent = (
    <div className="settings-inputs-container">
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
        <LocationModal onClose={() => setShowLocationModal(false)} onSave={handleAddLocation} />
      )}
      {settings.locations.length === 0
        ? <div className='no-location-wrapper'>
          У вас еще не создано ни одной локации
          <button onClick={() => setShowLocationModal(true)}>Добавить локацию</button>
        </div>
        : <>
        </>
      }
      <button onClick={handleSave} className="create-button">
        Сохранить и продолжить
      </button>
    </div>
  );

  const cardPreviewContent = (
    <div className="type-card-image-container">
      <img className="card-image-add" src={currentCard.frameUrl || '/phone.svg'} alt="preview" />
      <CardInfo card={currentCard} />
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
