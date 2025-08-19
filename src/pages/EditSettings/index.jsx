import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import EditLayout from '../../components/EditLayout';
import TitleWithHelp from '../../components/TitleWithHelp';
import CustomSelect from '../../customs/CustomSelect';
import ToggleSwitch from '../../customs/CustomToggleSwitch';
import CustomTooltip from '../../customs/CustomTooltip';
import { formatCoords } from '../../helpers/formatCoords';
import {
  addCurrentCardArrayItem,
  removeCurrentCardArrayItem,
  updateCurrentCardField,
} from '../../store/cardsSlice';
import { BarcodeRadioTitle, CreateButton } from '../EditDesign/styles';
import CardIssueForm from './CardIssueForm';
import CardLimit from './CardLimit';
import CardStatusForm from './CardStatusForm';
import LocationModal from './LocationModal';
import RadioConfigs from './RadioConfigs';
import {
  Divider,
  EmptyLocations,
  EmptyLocationsButton,
  FullWidthHr,
  LocationTag,
  LocationsWrapper,
  PolicyBordered,
  PolicyBorderedHeader,
  SectionTitle,
  SettingsInputsContainer,
  SmallActionButton,
  StampSectionLabel,
  StepNote,
  TagIconButton,
  TopRow,
} from './styles';

const EditSettings = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const currentCard = useSelector((state) => state.cards.currentCard);
  const settings = currentCard.settings || {};
  const policySettings = currentCard.policySettings;
  const cardStatus = currentCard.status;

  const locations = settings?.locations && settings.locations.length > 0 ? settings.locations : [];

  const [showLocationModal, setShowLocationModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [initialLocation, setInitialLocation] = useState(null);

  const handleAddLocation = () => {
    setEditingIndex(null);
    setInitialLocation(null);
    setShowLocationModal(true);
  };

  const handleEditLocation = (idx) => {
    const loc = locations[idx] || {};

    const safeAddress =
      loc.address ??
      (loc?.coords && typeof loc.coords.lat === 'number' && typeof loc.coords.lng === 'number'
        ? formatCoords(loc.coords)
        : '');

    setEditingIndex(idx);
    setInitialLocation({ ...loc, address: safeAddress });
    setShowLocationModal(true);
  };

  const updateSettingsField = (field, value) => {
    dispatch(updateCurrentCardField({ path: `settings.${field}`, value }));
  };

  const handleSaveLocation = (loc) => {
    if (editingIndex !== null) {
      const next = locations.map((l, i) => (i === editingIndex ? loc : l));
      updateSettingsField('locations', next);
    } else {
      updateSettingsField('locations', [...locations, loc]);
    }
    setShowLocationModal(false);
    setEditingIndex(null);
    setInitialLocation(null);
  };

  const handleRemoveLocation = (index) => {
    const next = locations.filter((_, i) => i !== index);
    updateSettingsField('locations', next);
    dispatch(removeCurrentCardArrayItem({ path: 'settings.locations', index }));
  };

  const formRef = useRef(null);

  const handleSave = () => {
    if (policySettings?.policyEnabled) {
      if (!policySettings?.policyText.trim() || !policySettings?.fullPolicyText.trim()) {
        alert('Заполните все обязательные поля');
        return;
      }
    }
    dispatch(updateCurrentCardField({ path: 'settingsReady', value: true }));
    navigate(`/cards/${id}/edit/info`);
  };

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

  const settingsContent = (
    <SettingsInputsContainer ref={formRef}>
      <div>
        <TopRow>
          <TitleWithHelp
            title={'Настройки'}
            tooltipId="settings-help"
            tooltipHtml
            tooltipContent={`Настройки карты и формы установки карты`}
          />
          <StepNote>Шаг 3 из 4</StepNote>
        </TopRow>
        <Divider />
      </div>

      <RadioConfigs cardStatus={cardStatus} />

      {showLocationModal && (
        <LocationModal
          isOpen={showLocationModal}
          onClose={() => {
            setShowLocationModal(false);
            setEditingIndex(null);
            setInitialLocation(null);
          }}
          onSave={handleSaveLocation}
          initialData={initialLocation || {}}
          isEdit={editingIndex !== null}
        />
      )}

      <FullWidthHr />
      <StampSectionLabel>
        <BarcodeRadioTitle>Адрес точки продаж</BarcodeRadioTitle>
        <CustomTooltip
          id="location-help"
          html
          content={`Здесь указываем где именно клиент сможет использовать вашу карту`}
        />
      </StampSectionLabel>
      {locations.length === 0 ? (
        <EmptyLocations onClick={handleAddLocation}>
          У вас еще не создано ни одной локации
          <EmptyLocationsButton type="button" onClick={handleAddLocation}>
            Добавить локацию
          </EmptyLocationsButton>
        </EmptyLocations>
      ) : (
        <LocationsWrapper>
          {locations.map((location, index) => (
            <LocationTag key={index}>
              {location.name}
              <TagIconButton
                title="Редактировать"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditLocation(index);
                }}
              >
                ✏
              </TagIconButton>

              <TagIconButton
                title="Удалить"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveLocation(index);
                }}
              >
                ×
              </TagIconButton>
            </LocationTag>
          ))}

          <SmallActionButton onClick={handleAddLocation}>＋</SmallActionButton>
          <SmallActionButton onClick={() => updateSettingsField('locations', [])}>
            ×
          </SmallActionButton>
        </LocationsWrapper>
      )}

      <FullWidthHr />
      <StampSectionLabel>
        <BarcodeRadioTitle>Язык карты</BarcodeRadioTitle>
        <CustomTooltip
          id="language-help"
          html
          content={`Язык, на котором будет отображаться информация карты`}
        />
      </StampSectionLabel>
      <CustomSelect
        value={settings.language?.value || 'ru'}
        onChange={(value) => updateSettingsField('language', { ...settings.language, value })}
        options={[{ value: 'ru', label: 'Русский (ru)' }]}
      />

      <FullWidthHr />
      <StampSectionLabel>
        <BarcodeRadioTitle>Анкета клиента при установке карты</BarcodeRadioTitle>
        <CustomTooltip
          id="fields-help"
          html
          content={`Эти поля заполняет клиент, когда оформляет карту. Отсюда начинается его знакомство с вами`}
        />
      </StampSectionLabel>
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

      <FullWidthHr />
      <StampSectionLabel>
        <BarcodeRadioTitle>Код страны</BarcodeRadioTitle>
        <CustomTooltip
          id="mask-help"
          html
          content={`Выберите маску телефона, в зависимости от страны использования карты. Для формы установки карты`}
        />
      </StampSectionLabel>
      <CustomSelect
        value={settings.phoneMask?.value || 'Russia'}
        onChange={(value) => updateSettingsField('phoneMask', { ...settings.phoneMask, value })}
        options={[{ value: 'Russia', label: '+7 (XXX) XXX-XX-XX' }]}
      />

      <FullWidthHr />

      <CardLimit
        value={currentCard.issueLimit}
        onChange={(value) => dispatch(updateCurrentCardField({ path: 'issueLimit', value }))}
        title="Ограничить количество выданных карт"
        subtitle="0 — без ограничений"
      />

      <FullWidthHr />
      {(cardStatus === 'cashback' || cardStatus === 'certificate') && (
        <CardLimit
          value={currentCard.initialPointsOnIssue}
          onChange={(value) =>
            dispatch(updateCurrentCardField({ path: 'initialPointsOnIssue', value }))
          }
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
          <SectionTitle>Статус держателя карты</SectionTitle>
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
          <FullWidthHr />
        </>
      )}

      <SectionTitle>Сумма покупки при начислении</SectionTitle>
      <PolicyBordered className="policy-bordered">
        <PolicyBorderedHeader className="policy-bordered-header">
          <BarcodeRadioTitle>Требовать указания суммы покупки при начислении</BarcodeRadioTitle>
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
        </PolicyBorderedHeader>
      </PolicyBordered>

      <CreateButton
        onClick={handleSave}
        disabled={
          policySettings?.policyEnabled &&
          (!policySettings?.policyText.trim() || !policySettings?.fullPolicyText.trim())
        }
      >
        Перейти к следующему шагу
      </CreateButton>
    </SettingsInputsContainer>
  );

  return <EditLayout onFieldClick={flashInput}>{settingsContent}</EditLayout>;
};

export default EditSettings;
