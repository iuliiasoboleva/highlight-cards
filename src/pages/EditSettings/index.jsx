import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { faCircleQuestion } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import CardInfo from '../../components/CardInfo';
import CustomSelect from '../../components/CustomSelect';
import { formatDateToDDMMYYYY, getMinDate } from '../../helpers/date';
import { pluralize } from '../../helpers/pluralize';
import { updateCurrentCard } from '../../store/cardsSlice';
import BarcodeRadio from './BarcodeRadio';
import LocationModal from './LocationModal';

import './styles.css';

const EditSettings = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const currentCard = useSelector((state) => state.cards.currentCard);
  const settings = useSelector((state) => state.cards.currentCard.settings || {});

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  const [activeTab, setActiveTab] = useState('description');
  const [showLocationModal, setShowLocationModal] = useState(false);

  const getDurationOptions = (count) => [
    { value: 'days', label: pluralize(count, ['день', 'дня', 'дней']) },
    { value: 'months', label: pluralize(count, ['месяц', 'месяца', 'месяцев']) },
    { value: 'years', label: pluralize(count, ['год', 'года', 'лет']) },
  ];

  const numberOptions = Array.from({ length: 30 }, (_, i) => ({
    value: i + 1,
    label: (i + 1).toString(),
  }));

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSave = () => {
    navigate(`/cards/${id}/edit/design`);
  };

  const updateSettingsField = (field, value) => {
    dispatch(
      updateCurrentCard({
        settings: {
          ...settings,
          [field]: value,
        },
      }),
    );
  };

  const handleAddLocation = (location) => {
    updateSettingsField('locations', [...(settings.locations || []), location]);
  };

  const radioConfigs = [
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
        {
          value: 'stamps',
          label: 'Штампы (Начисление штампов в соответствии с вашими правилами)',
        },
      ],
      selected: settings.rewardProgram,
      onChange: (value) => updateSettingsField('rewardProgram', value),
      title: 'Программа вознаграждения',
      name: 'reward-program',
      additionalContentByValue: {
        spending: (
          <div className="spending-config">
            <label className="spending-label">
              <span>₽</span>
              <input
                type="number"
                className="push-input"
                min="1"
                value={settings.spendingAmount || ''}
                onChange={(e) =>
                  updateSettingsField('spendingAmount', parseInt(e.target.value) || 0)
                }
              />
            </label>
            <span className="spending-equal">=</span>
            <label className="spending-label">
              <input
                type="number"
                className="push-input"
                min="1"
                value={settings.spendingStamps || ''}
                onChange={(e) =>
                  updateSettingsField('spendingStamps', parseInt(e.target.value) || 0)
                }
              />
              <span>штампов</span>
            </label>
          </div>
        ),
        visit: (
          <div className="visit-config">
            <label className="visit-label">
              <input type="number" min="1" className="push-input" value={1} disabled />
              <span className="visit-text">визит =</span>
              <input
                type="number"
                className="push-input"
                min="1"
                value={settings.visitStamps || ''}
                onChange={(e) => updateSettingsField('visitStamps', parseInt(e.target.value) || 0)}
              />
              <span className="visit-text">штампов</span>
            </label>
            <label className="custom-checkbox">
              <input
                type="checkbox"
                checked={settings.limitVisitPerDay || false}
                onChange={(e) => updateSettingsField('limitVisitPerDay', e.target.checked)}
              />
              Ограничить до 1 посещения в день
            </label>
          </div>
        ),
      },
    },
    {
      options: [
        { value: 'cardUnlimit', label: 'Неограниченный' },
        { value: 'cardFixed', label: 'Фиксированный срок' },
        { value: 'cardFixedLater', label: 'Фиксированный срок после регистрации карты' },
      ],
      selected: settings.cardLimit,
      onChange: (value) => updateSettingsField('cardLimit', value),
      title: 'Срок действия карты',
      name: 'card-limit',
      additionalContentByValue: {
        cardFixed: (
          <input
            className="push-date"
            type="date"
            value={settings.cardFixedDate || ''}
            min={getMinDate()}
            onChange={(e) => {
              const newDate = e.target.value;
              const formattedExpiration = formatDateToDDMMYYYY(newDate);

              dispatch(
                updateCurrentCard({
                  settings: {
                    ...settings,
                    cardFixedDate: newDate,
                  },
                  expirationDate: formattedExpiration,
                }),
              );
            }}
          />
        ),
        cardFixedLater: (
          <>
            <h3 className="barcode-radio-title">Срок</h3>
            <div className="stamp-duration-selector">
              <CustomSelect
                value={settings.cardDuration?.value || 1}
                onChange={(value) =>
                  updateSettingsField('cardDuration', {
                    ...settings.cardDuration,
                    value: parseInt(value),
                  })
                }
                options={numberOptions}
                className="duration-number-select"
              />
              <CustomSelect
                value={settings.cardDuration?.unit || 'days'}
                onChange={(unit) =>
                  updateSettingsField('cardDuration', {
                    ...settings.cardDuration,
                    unit,
                  })
                }
                options={getDurationOptions(settings.cardDuration?.value || 1)}
                className="duration-unit-select"
              />
            </div>
          </>
        ),
      },
    },
    {
      options: [
        { value: 'stampUnlimit', label: 'Неограниченный' },
        { value: 'stampFixedLater', label: 'Фиксированный срок после получения штампов' },
      ],
      selected: settings.stampLimit,
      onChange: (value) => updateSettingsField('stampLimit', value),
      title: 'Срок жизни штампа',
      name: 'stamp-limit',
      additionalContentByValue: {
        stampFixedLater: (
          <>
            <h3 className="barcode-radio-title">Срок</h3>
            <div className="stamp-duration-selector">
              <CustomSelect
                value={settings.stampDuration?.value || 1}
                onChange={(value) =>
                  updateSettingsField('stampDuration', {
                    ...settings.stampDuration,
                    value: parseInt(value),
                  })
                }
                options={numberOptions}
                className="duration-number-select"
              />
              <CustomSelect
                value={settings.stampDuration?.unit || 'days'}
                onChange={(unit) =>
                  updateSettingsField('stampDuration', {
                    ...settings.stampDuration,
                    unit,
                  })
                }
                options={getDurationOptions(settings.stampDuration?.value || 1)}
                className="duration-unit-select"
              />
            </div>
          </>
        ),
      },
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
      {settings.locations.length === 0 && (
        <div className="no-location-wrapper">
          У вас еще не создано ни одной локации
          <button onClick={() => setShowLocationModal(true)}>Добавить локацию</button>
        </div>
      )}
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
