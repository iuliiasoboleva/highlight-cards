import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { HelpCircle } from 'lucide-react';

import CardInfo from '../../components/CardInfo';
import CustomSelect from '../../components/CustomSelect';
import ToggleSwitch from '../../components/ToggleSwitch';
import {
  addIssueFormField,
  addStatusField,
  addUtmLink,
  removeIssueFormField,
  removeStatusField,
  removeUtmLink,
  togglePolicyField,
  toggleRequirePurchaseAmount,
  updateCurrentCard,
  updateInitialPointsOnIssue,
  updateIssueFormField,
  updateIssueLimit,
  updatePolicyTextField,
  updateStatusField,
} from '../../store/cardsSlice';
import CardIssueForm from './CardIssueForm';
import CardLimit from './CardLimit';
import CardStatusForm from './CardStatusForm';
import LocationModal from './LocationModal';
import PersonalDataPolicy from './PersonalDataPolicy';
import RadioConfigs from './RadioConfigs';
import UTMLinks from './UTMLinks';

import './styles.css';

const EditSettings = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const currentCard = useSelector((state) => state.cards.currentCard);
  const settings = currentCard.settings || {};
  const formFields = currentCard.issueFormFields;
  const utmLinks = currentCard.utmLinks;
  const limit = currentCard.issueLimit;
  const statusFields = currentCard.statusFields;
  const policySettings = currentCard.policySettings;
  const cardStatus = currentCard.status; // <=== ключевой момент

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  const [activeTab, setActiveTab] = useState('description');
  const [showLocationModal, setShowLocationModal] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSave = () => {
    if (policySettings.policyEnabled) {
      if (!policySettings.policyText.trim() || !policySettings.fullPolicyText.trim()) {
        alert('Заполните все обязательные поля');
        return;
      }
    }
    navigate(`/cards/${id}/edit/design`);
  };

  const updateSettingsField = (field, value) => {
    dispatch(updateCurrentCard({ settings: { ...settings, [field]: value } }));
  };

  const handleAddLocation = (location) => {
    updateSettingsField('locations', [...(settings.locations || []), location]);
  };

  const handleRemoveLocation = (index) => {
    const updatedLocations = settings.locations.filter((_, i) => i !== index);
    updateSettingsField('locations', updatedLocations);
  };

  const settingsContent = (
    <div className="settings-inputs-container">
      <h2>
        Настройки <HelpCircle size={16} />
      </h2>
      <hr />

      {/* 🛠️ Радио-блоки по статусу */}
      <RadioConfigs cardStatus={cardStatus} />

      {showLocationModal && (
        <LocationModal onClose={() => setShowLocationModal(false)} onSave={handleAddLocation} />
      )}

      <hr />
      {settings.locations.length === 0 ? (
        <div className="no-location-wrapper">
          У вас еще не создано ни одной локации
          <button onClick={() => setShowLocationModal(true)}>Добавить локацию</button>
        </div>
      ) : (
        <>
          <h3 className="barcode-radio-title">Локации</h3>
          <div className="locations-wrapper">
            {settings.locations.map((location, index) => (
              <div key={index} className="location-tag">
                {location.name}
                <button className="remove-btn" onClick={() => handleRemoveLocation(index)}>
                  ×
                </button>
              </div>
            ))}
            <button className="add-btn" onClick={() => handleAddLocation()}>
              +
            </button>
            <button className="clear-btn" onClick={() => updateSettingsField('locations', [])}>
              ×
            </button>
          </div>
        </>
      )}
      <hr />

      {/* Язык */}
      <h3 className="barcode-radio-title">Язык карты</h3>
      <CustomSelect
        value={settings.language?.value || 'ru'}
        onChange={(value) => updateSettingsField('language', { ...settings.language, value })}
        options={[
          { value: 'ru', label: 'Русский (ru)' },
          { value: 'en', label: 'Английский (en)' },
        ]}
      />
      <hr />

      {/* Форма выдачи карты */}
      <h3 className="barcode-radio-title">Форма выдачи карты</h3>
      <CardIssueForm
        formFields={formFields}
        onFieldChange={(index, key, value) => dispatch(updateIssueFormField({ index, key, value }))}
        onAddField={() => dispatch(addIssueFormField())}
        onRemoveField={(index) => dispatch(removeIssueFormField(index))}
      />
      <hr />

      {/* UTM */}
      <h3 className="barcode-radio-title">UTM</h3>
      <UTMLinks
        utmLinks={utmLinks}
        onAddLink={(source) => dispatch(addUtmLink(source))}
        onRemoveLink={(index) => dispatch(removeUtmLink(index))}
      />
      <hr />

      {/* Маска телефона */}
      <h3 className="barcode-radio-title">Маска для номера телефона</h3>
      <CustomSelect
        value={settings.phoneMask?.value || 'Russia'}
        onChange={(value) => updateSettingsField('phoneMask', { ...settings.phoneMask, value })}
        options={[
          { value: 'Russia', label: 'РФ (+7)' },
          { value: 'UAE', label: 'ОАЭ (+971)' },
        ]}
      />
      <hr />

      {/* Политика персональных данных */}
      <PersonalDataPolicy
        settings={policySettings}
        onToggle={(key) => dispatch(togglePolicyField(key))}
        onTextChange={(key, value) => dispatch(updatePolicyTextField({ key, value }))}
      />
      <hr />

      {/* Ограничения */}
      <CardLimit
        value={limit}
        onChange={(value) => dispatch(updateIssueLimit(value))}
        title="Ограничить количество выданных карт"
        subtitle="0 — без ограничений"
      />
      <hr />

      {/* Количество баллов или штампов при выпуске */}
      {(cardStatus === 'cashback' || cardStatus === 'certificate') && (
        <CardLimit
          value={currentCard.initialPointsOnIssue}
          onChange={(value) => dispatch(updateInitialPointsOnIssue(value))}
          title="Количество баллов при выпуске карты"
        />
      )}
      {cardStatus === 'stamp' && (
        <CardLimit
          value={currentCard.initialStampsOnIssue}
          onChange={(value) => dispatch(updateCurrentCard({ initialStampsOnIssue: value }))}
          title="Количество штампов при выпуске карты"
        />
      )}

      {/* Статус держателя карты */}
      {(cardStatus === 'discount' || cardStatus === 'cashback') && (
        <>
          <h3 className="barcode-radio-title">Статус держателя карты</h3>
          <CardStatusForm
            statusFields={statusFields}
            onFieldChange={(index, key, value) =>
              dispatch(updateStatusField({ index, key, value }))
            }
            onAddField={() => dispatch(addStatusField())}
            onRemoveField={(index) => dispatch(removeStatusField(index))}
          />
          <hr />
        </>
      )}

      {/* Сумма покупки при начислении */}
      <h3 className="barcode-radio-title">Сумма покупки при начислении</h3>
      <div className="policy-section policy-bordered">
        <div className="policy-bordered-header">
          <h3 className="barcode-radio-subtitle">
            Требовать указания суммы покупки при начислении
          </h3>
          <ToggleSwitch
            checked={currentCard.requirePurchaseAmountOnAccrual}
            onChange={() => dispatch(toggleRequirePurchaseAmount())}
          />
        </div>
      </div>

      <button
        onClick={handleSave}
        className="create-button"
        disabled={
          policySettings.policyEnabled &&
          (!policySettings.policyText.trim() || !policySettings.fullPolicyText.trim())
        }
      >
        Сохранить и продолжить
      </button>
    </div>
  );

  const cardPreviewContent = (
    <div className="phone-frame">
      <img className="phone-image" src={currentCard.frameUrl} alt={currentCard.name} />
      <div className="phone-screen">
        <CardInfo card={currentCard} />
      </div>
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

      <div className="edit-type-layout">
        <div className="edit-type-left">
          {(!isMobile || activeTab === 'description') && (
            <div className="edit-type-page">{settingsContent}</div>
          )}
        </div>
        <div className="edit-type-right">
          {(!isMobile || activeTab === 'card') && cardPreviewContent}
        </div>
      </div>
    </div>
  );
};

export default EditSettings;
