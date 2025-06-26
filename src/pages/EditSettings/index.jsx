import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';

import { HelpCircle } from 'lucide-react';

import CustomSelect from '../../components/CustomSelect';
import EditLayout from '../../components/EditLayout';
import ToggleSwitch from '../../components/ToggleSwitch';
import {
  addCurrentCardArrayItem,
  removeCurrentCardArrayItem,
  updateCurrentCardField,
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
  const location = useLocation();
  const dispatch = useDispatch();

  const currentCard = useSelector((state) => state.cards.currentCard);
  const settings = currentCard.settings || {};
  const policySettings = currentCard.policySettings;
  const cardStatus = currentCard.status;

  const [showLocationModal, setShowLocationModal] = useState(false);

  const formRef = useRef(null);

  const handleSave = () => {
    if (policySettings?.policyEnabled) {
      if (!policySettings?.policyText.trim() || !policySettings?.fullPolicyText.trim()) {
        alert('Заполните все обязательные поля');
        return;
      }
    }
    navigate(`/cards/${id}/edit/design`);
  };

  const updateSettingsField = (field, value) => {
    dispatch(updateCurrentCardField({ path: `settings.${field}`, value }));
  };

  const handleAddLocation = (location) => {
    dispatch(addCurrentCardArrayItem({ path: 'settings.locations', item: location }));
  };

  const handleRemoveLocation = (index) => {
    dispatch(removeCurrentCardArrayItem({ path: 'settings.locations', index }));
  };

  const settingsContent = (
    <div className="settings-inputs-container" ref={formRef}>
      <h2 className="subtitle">
        Настройки
        <HelpCircle
          size={16}
          style={{ cursor: 'pointer' }}
          data-tooltip-id="settings-help"
          data-tooltip-html="Настройки карты и формы установки карты"
        />
      </h2>
      <Tooltip id="settings-help" className="custom-tooltip" />
      <hr />

      <RadioConfigs cardStatus={cardStatus} />

      {showLocationModal && (
        <LocationModal onClose={() => setShowLocationModal(false)} onSave={handleAddLocation} />
      )}

      <hr />
      <h3 className="barcode-radio-title">
        Локации
        <HelpCircle
          size={16}
          style={{ marginLeft: 6, cursor: 'pointer', outline: 'none' }}
          data-tooltip-id="location-help"
          data-tooltip-html="Локации, к которым привязана карта"
        />
      </h3>
      <Tooltip id="location-help" className="custom-tooltip" />
      {settings?.locations?.length === 0 ? (
        <div className="no-location-wrapper">
          У вас еще не создано ни одной локации
          <button onClick={() => setShowLocationModal(true)}>Добавить локацию</button>
        </div>
      ) : (
        <>
          <div className="locations-wrapper">
            {settings?.locations?.map((location, index) => (
              <div key={index} className="location-tag">
                {location.name}
                <button className="remove-btn" onClick={() => handleRemoveLocation(index)}>
                  ×
                </button>
              </div>
            ))}
            <button className="add-btn" onClick={() => setShowLocationModal(true)}>
              +
            </button>
            <button className="clear-btn" onClick={() => updateSettingsField('locations', [])}>
              ×
            </button>
          </div>
        </>
      )}
      <hr />

      <h3 className="barcode-radio-title">
        Язык карты
        <HelpCircle
          size={16}
          style={{ marginLeft: 6, cursor: 'pointer', outline: 'none' }}
          data-tooltip-id="language-help"
          data-tooltip-html="Язык, на котором будет отображаться информация карты"
        />
      </h3>
      <Tooltip id="language-help" className="custom-tooltip" />
      <CustomSelect
        value={settings.language?.value || 'ru'}
        onChange={(value) => updateSettingsField('language', { ...settings.language, value })}
        options={[{ value: 'ru', label: 'Русский (ru)' }]}
      />
      <hr />

      <h3 className="barcode-radio-title">
        Форма выдачи карты
        <HelpCircle
          size={16}
          style={{ marginLeft: 6, cursor: 'pointer', outline: 'none' }}
          data-tooltip-id="fields-help"
          data-tooltip-html="Поля, которые будут заполнять клиенты при установке карты"
        />
      </h3>
      <Tooltip id="fields-help" className="custom-tooltip" />
      <CardIssueForm
        formFields={currentCard.issueFormFields}
        onFieldChange={(index, key, value) =>
          dispatch(updateCurrentCardField({ path: `issueFormFields.${index}.${key}`, value }))
        }
        onAddField={() =>
          dispatch(
            addCurrentCardArrayItem({
              path: 'issueFormFields',
              item: { type: 'text', name: 'Текст', required: false, unique: false },
            }),
          )
        }
        onRemoveField={(index) =>
          dispatch(removeCurrentCardArrayItem({ path: 'issueFormFields', index }))
        }
      />
      <hr />

      <h3 className="barcode-radio-title">
        UTM
        <HelpCircle
          size={16}
          style={{ marginLeft: 6, cursor: 'pointer', outline: 'none' }}
          data-tooltip-id="utm-help"
          data-tooltip-html="UTM метки для формы установки карты"
        />
      </h3>
      <Tooltip id="utm-help" className="custom-tooltip" />
      <UTMLinks
        utmLinks={currentCard.utmLinks}
        onAddLink={(source) =>
          dispatch(
            addCurrentCardArrayItem({
              path: 'utmLinks',
              item: {
                source,
                url: `http://147.45.229.94:3000/${Math.random().toString(36).substr(2, 5)}`,
              },
            }),
          )
        }
        onRemoveLink={(index) => dispatch(removeCurrentCardArrayItem({ path: 'utmLinks', index }))}
      />
      <hr />

      <h3 className="barcode-radio-title">
        Маска для номера телефона
        <HelpCircle
          size={16}
          style={{ marginLeft: 6, cursor: 'pointer', outline: 'none' }}
          data-tooltip-id="mask-help"
          data-tooltip-html="Выберите маску телефона, в зависимости от страны использования карты. Для формы установки карты"
        />
      </h3>
      <Tooltip id="mask-help" className="custom-tooltip" />
      <CustomSelect
        value={settings.phoneMask?.value || 'Russia'}
        onChange={(value) => updateSettingsField('phoneMask', { ...settings.phoneMask, value })}
        options={[{ value: 'Russia', label: 'РФ (+7)' }]}
      />
      <hr />

      <PersonalDataPolicy
        settings={policySettings}
        onToggle={(key) =>
          dispatch(
            updateCurrentCardField({ path: `policySettings.${key}`, value: !policySettings[key] }),
          )
        }
        onTextChange={(key, value) =>
          dispatch(updateCurrentCardField({ path: `policySettings.${key}`, value }))
        }
      />
      <hr />

      <CardLimit
        value={currentCard.issueLimit}
        onChange={(value) => dispatch(updateCurrentCardField({ path: 'issueLimit', value }))}
        title="Ограничить количество выданных карт"
        subtitle="0 — без ограничений"
      />
      <hr />

      {(cardStatus === 'cashback' || cardStatus === 'certificate') && (
        <CardLimit
          value={currentCard.initialPointsOnIssue}
          onChange={(value) => dispatch(updateCurrentCardField({ path: 'initialPointsOnIssue', value }))}
          title="Количество баллов при выпуске карты"
        />
      )}
      {cardStatus === 'stamp' && (
        <CardLimit
          value={currentCard.initialStampsOnIssue}
          onChange={(value) =>
            dispatch(updateCurrentCardField({ path: 'initialStampsOnIssue', value }))
          }
          title="Количество штампов при выпуске карты"
          tooltip="Столько штампов начислится клиенту при выпуске карты"
        />
      )}
      {cardStatus === 'stamp' && (
        <CardLimit
          value={currentCard.stampDailyLimit}
          onChange={(value) => dispatch(updateCurrentCardField({ path: 'stampDailyLimit', value }))}
          title="Ограничить количество начислений штампов в день"
          subtitle="0 — без ограничений"
        />
      )}

      {(cardStatus === 'discount' || cardStatus === 'cashback') && (
        <>
          <h3 className="barcode-radio-title">Статус держателя карты</h3>
          <CardStatusForm
            statusFields={currentCard.statusFields}
            onFieldChange={(index, key, value) =>
              dispatch(updateCurrentCardField({ path: `statusFields.${index}.${key}`, value }))
            }
            onAddField={() =>
              dispatch(
                addCurrentCardArrayItem({
                  path: 'statusFields',
                  item: { name: '', cost: '', percent: '' },
                }),
              )
            }
            onRemoveField={(index) =>
              dispatch(removeCurrentCardArrayItem({ path: 'statusFields', index }))
            }
          />
          <hr />
        </>
      )}

      <h3 className="barcode-radio-title">Сумма покупки при начислении</h3>
      <div className="policy-section policy-bordered">
        <div className="policy-bordered-header">
          <h3 className="barcode-radio-subtitle">
            Требовать указания суммы покупки при начислении
          </h3>
          <ToggleSwitch
            checked={currentCard.requirePurchaseAmountOnAccrual}
            onChange={() =>
              dispatch(
                updateCurrentCardField({
                  path: 'requirePurchaseAmountOnAccrual',
                  value: !currentCard.requirePurchaseAmountOnAccrual,
                }),
              )
            }
          />
        </div>
      </div>

      <button
        onClick={handleSave}
        className="create-button"
        disabled={
          policySettings?.policyEnabled &&
          (!policySettings?.policyText.trim() || !policySettings?.fullPolicyText.trim())
        }
      >
        Продолжить
      </button>
    </div>
  );

  const flashInput = useCallback((key) => {
    const el = formRef.current?.querySelector(`[data-settings-key="${key}"]`);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    el.classList.add('flash-border');
    setTimeout(() => el.classList.remove('flash-border'), 1000);
  }, []);

  useEffect(() => {
    if (location.state?.flashKey) {
      flashInput(location.state.flashKey);
    }
  }, [location.state, flashInput]);

  return <EditLayout onFieldClick={flashInput}>{settingsContent}</EditLayout>;
};

export default EditSettings;
