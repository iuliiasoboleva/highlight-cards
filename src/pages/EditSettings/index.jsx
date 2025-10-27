import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { Pencil } from 'lucide-react';

import EditLayout from '../../components/EditLayout';
import TitleWithHelp from '../../components/TitleWithHelp';
import { useToast } from '../../components/Toast';
import CustomInput from '../../customs/CustomInput';
import CustomSelect from '../../customs/CustomSelect';
import ToggleSwitch from '../../customs/CustomToggleSwitch';
import CustomTooltip from '../../customs/CustomTooltip';
import { formatCoords } from '../../helpers/formatCoords';
import {
  addCurrentCardArrayItem,
  removeCurrentCardArrayItem,
  updateCurrentCardField,
} from '../../store/cardsSlice';
import { createBranch, fetchBranches } from '../../store/salesPointsSlice';
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
  SettingsInputsContainer,
  SmallActionButton,
  SpendingLabel,
  StampSectionLabel,
  StepNote,
  SubTitle,
  TagIconButton,
  TopRow,
  Warning,
} from './styles';
import { HintDanger } from './styles';

const EditSettings = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const toast = useToast();
  const [redeemWarn, setRedeemWarn] = useState(false);
  const warnTimerRef = useRef(null);

  const currentCard = useSelector((state) => state.cards.currentCard);
  const settings = currentCard.settings || {};
  const policySettings = currentCard.policySettings;
  const cardStatus = currentCard.status;
  const subscription = useSelector((state) => state.subscription.info);
  const organizationId = useSelector((state) => state.user.organization_id);
  const orgLocations = useSelector((state) => state.locations.list || []);

  const isStampCard = cardStatus === 'stamp';
  const locations = settings?.locations && settings.locations.length > 0 ? settings.locations : [];

  const [showLocationModal, setShowLocationModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [initialLocation, setInitialLocation] = useState(null);

  const handleAddLocation = () => {
    const isTrial = String(subscription?.status || '').toLowerCase() === 'trial';
    if (isTrial && locations.length >= 1) {
      toast.info('На демо-тарифе доступна одна точка продаж');
      return;
    }
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

  useEffect(() => {
    if (organizationId) {
      dispatch(fetchBranches());
    }
  }, [organizationId, dispatch]);

  useEffect(() => {
    const hasCardLocations = Array.isArray(settings?.locations) && settings.locations.length > 0;
    if (hasCardLocations) return;
    if (!orgLocations || orgLocations.length === 0) return;
    const mapped = orgLocations.map((b) => ({
      name: b.name || b.address || 'Локация',
      address: b.address || b.name || '',
      coords: b.coords || null,
    }));
    if (mapped.length > 0) updateSettingsField('locations', mapped);
  }, [orgLocations, settings?.locations]);

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

    try {
      const addr = (loc?.address || '').trim();
      const name = loc?.name || addr || 'Локация';
      if (organizationId && addr) {
        dispatch(createBranch({ name, address: addr, organization_id: organizationId }))
          .unwrap()
          .catch(() => {});
      }
    } catch (_) {}
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
        toast.error('Заполните все обязательные поля');
        return;
      }
    }

    const fields = currentCard.issueFormFields || [];
    const hasRequiredContact = fields.some(
      (f) => (f.type === 'phone' || f.type === 'email') && !!f.required,
    );
    if (!hasRequiredContact) {
      toast.error('Добавьте обязательное поле Телефон или Email в анкету клиента');
      flashInput('issueFormFields');
      return;
    }

    dispatch(updateCurrentCardField({ path: 'settingsReady', value: true }));
    const path = id ? `/cards/${id}/edit/info` : '/cards/create/info';
    navigate(path);
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
          <StepNote>Шаг 3 из 5</StepNote>
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
                <Pencil size={16} />
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
          title="Приветственные баллы для клиента"
          placeholder="₽"
        />
      )}
      {cardStatus === 'stamp' && (
        <CardLimit
          value={currentCard.initialStampsOnIssue}
          onChange={(value) =>
            dispatch(updateCurrentCardField({ path: 'initialStampsOnIssue', value }))
          }
          title="Количество приветственных штампов"
          tooltip="Столько штампов начислится клиенту при выпуске карты"
        />
      )}
      {cardStatus === 'stamp' && (
        <CardLimit
          value={currentCard.stampDailyLimit}
          onChange={(value) => dispatch(updateCurrentCardField({ path: 'stampDailyLimit', value }))}
          title="Ограничить количество начислений штампов в день"
          subtitle="0 — без ограничений"
          tooltip="Укажите максимальное количество штампов, которое можно начислить одному клиенту за день. 0 — без ограничений."
        />
      )}

      {cardStatus === 'discount' && (
        <>
          <BarcodeRadioTitle>Статус держателя карты</BarcodeRadioTitle>
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

      {cardStatus === 'cashback' && (
        <>
          <BarcodeRadioTitle>Процент начисления кэшбэка</BarcodeRadioTitle>
          <SubTitle>
            Установите, сколько баллов получит клиент при выпуске карты - теплый старт работает
            лучше всего
          </SubTitle>

          <SpendingLabel style={{ marginTop: 8 }}>
            <CustomInput
              type="number"
              min="0"
              max="100"
              step="1"
              value={settings.cashbackAccrualPercent ?? ''}
              onChange={(e) => {
                let raw = e.target.value;
                if (raw === '') {
                  updateSettingsField('cashbackAccrualPercent', '');
                  return;
                }
                // Убираем лидирующие нули
                if (raw.length > 1 && raw.startsWith('0')) {
                  raw = raw.replace(/^0+/, '') || '0';
                  e.target.value = raw;
                }
                const n = parseInt(raw || '0', 10);
                const v = isNaN(n) ? 0 : Math.max(0, Math.min(100, n));
                updateSettingsField('cashbackAccrualPercent', v);
              }}
              onBlur={(e) => {
                if (e.target.value === '' || e.target.value == null) {
                  updateSettingsField('cashbackAccrualPercent', 0);
                }
              }}
              placeholder="Например: 5"
              suffix="%"
            />
          </SpendingLabel>

          {/* Подсказка к проценту начисления кэшбэка (показываем только при 100%) */}
          {Number(settings.cashbackAccrualPercent) === 100 && (
            <HintDanger>
              Мы не рекомендуем устанавливать 100% начисления кэшбэка. Обычно отлично работают 1–10%:
              клиент видит ощутимую выгоду, а программа остаётся прибыльной.
            </HintDanger>
          )}

          <FullWidthHr />

          {/* Процент оплаты кэшбэком (разрешаем до 100%, предупреждаем > 50%) */}
          <BarcodeRadioTitle>Процент оплаты кэшбэком</BarcodeRadioTitle>
          <SubTitle>
            Это максимум, который клиент сможет оплатить бонусами за покупку. Например, если вы
            укажете 10%, клиент сможет списать до 10% от чека.
          </SubTitle>

          <SpendingLabel style={{ marginTop: 8 }}>
            <CustomInput
              type="number"
              min="0"
              max="100"
              step="1"
              value={
                typeof currentCard?.maxRedeemPercent === 'number'
                  ? currentCard.maxRedeemPercent
                  : ''
              }
              onChange={(e) => {
                let raw = e.target.value;
                if (raw === '') {
                  dispatch(updateCurrentCardField({ path: 'maxRedeemPercent', value: '' }));
                  return;
                }
                // Убираем лидирующие нули
                if (raw.length > 1 && raw.startsWith('0')) {
                  raw = raw.replace(/^0+/, '') || '0';
                  e.target.value = raw;
                }
                const n = parseInt(raw || '0', 10);

                if (!isNaN(n) && n > 50) {
                  setRedeemWarn(true);
                  if (warnTimerRef.current) clearTimeout(warnTimerRef.current);
                  warnTimerRef.current = setTimeout(() => setRedeemWarn(false), 6000);
                } else if (!isNaN(n) && n <= 50 && redeemWarn) {
                  setRedeemWarn(false);
                }

                const v = isNaN(n) ? 0 : Math.max(0, Math.min(100, n));
                dispatch(updateCurrentCardField({ path: 'maxRedeemPercent', value: v }));
              }}
              onBlur={(e) => {
                if (e.target.value === '' || e.target.value == null) {
                  dispatch(updateCurrentCardField({ path: 'maxRedeemPercent', value: 0 }));
                }
              }}
              placeholder="Например: 30"
              suffix="%"
            />
          </SpendingLabel>

          {redeemWarn && (
            <Warning role="alert" style={{ marginTop: 8 }}>
              Мы рекомендуем устанавливать не более 50%, чтобы бонусы не съедали всю прибыль. Так вы
              сохраните мотивацию к покупкам — и маржинальность бизнеса.
            </Warning>
          )}

          <FullWidthHr />

          {/* Срок действия кэшбэка, в днях */}
          <BarcodeRadioTitle>Срок действия кэшбэка</BarcodeRadioTitle>
          <SubTitle>
            Задайте, сколько времени будут действовать бонусы. Например, <b>60 дней</b> — это
            стимулирует клиента вернуться.
          </SubTitle>

          <SpendingLabel style={{ marginTop: 8 }}>
            <CustomInput
              type="number"
              min="0"
              step="1"
              value={settings.cashbackLifetimeDays ?? ''}
              onChange={(e) => {
                let raw = e.target.value;
                if (raw === '') {
                  updateSettingsField('cashbackLifetimeDays', '');
                  return;
                }
                // Убираем лидирующие нули
                if (raw.length > 1 && raw.startsWith('0')) {
                  raw = raw.replace(/^0+/, '') || '0';
                  e.target.value = raw;
                }
                const n = parseInt(raw || '0', 10);
                const v = isNaN(n) ? 0 : Math.max(0, n);
                updateSettingsField('cashbackLifetimeDays', v);
              }}
              onBlur={(e) => {
                if (e.target.value === '' || e.target.value == null) {
                  updateSettingsField('cashbackLifetimeDays', 0);
                }
              }}
              placeholder="Например: 60"
              suffix="дней"
            />
          </SpendingLabel>

          <FullWidthHr />

          {/* Как списываются бонусы */}
          <BarcodeRadioTitle>Как списываются бонусы</BarcodeRadioTitle>
          <SubTitle>
            Выберите, как клиент будет использовать бонусы — автоматически или по запросу.
          </SubTitle>

          <CustomSelect
            value={settings.cashbackRedemptionMode || 'auto'}
            onChange={(value) => updateSettingsField('cashbackRedemptionMode', value)}
            options={[
              { value: 'auto', label: 'Автоматически' },
              { value: 'manual', label: 'Вручную по запросу клиента' },
            ]}
          />

          <FullWidthHr />
        </>
      )}

      {cardStatus !== 'subscription' && cardStatus !== 'certificate' && (
        <BarcodeRadioTitle>
          {isStampCard
            ? 'Минимальная сумма чека для начисления штампов'
            : 'Сумма покупки при начислении'}
        </BarcodeRadioTitle>
      )}

      {cardStatus !== 'subscription' && cardStatus !== 'certificate' && (
        <SpendingLabel>
          <CustomInput
            type="number"
            min="0"
            step="1"
            value={currentCard?.minCheckForStamps ?? ''}
            onChange={(e) => {
              let raw = e.target.value;
              if (raw === '') {
                dispatch(updateCurrentCardField({ path: 'minCheckForStamps', value: '' }));
                return;
              }
              // Убираем лидирующие нули
              if (raw.length > 1 && raw.startsWith('0')) {
                raw = raw.replace(/^0+/, '') || '0';
                e.target.value = raw;
              }
              const n = parseInt(raw, 10);
              const v = Number.isNaN(n) ? 0 : Math.max(0, n);
              dispatch(updateCurrentCardField({ path: 'minCheckForStamps', value: v }));
            }}
            onBlur={(e) => {
              if (e.target.value === '' || e.target.value == null) {
                dispatch(updateCurrentCardField({ path: 'minCheckForStamps', value: 0 }));
              }
            }}
            placeholder="Например: 500₽"
          />
        </SpendingLabel>
      )}

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
