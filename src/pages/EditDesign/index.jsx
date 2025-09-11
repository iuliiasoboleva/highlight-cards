import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import html2canvas from 'html2canvas';

import EditLayout from '../../components/EditLayout';
import TitleWithHelp from '../../components/TitleWithHelp';
import CustomTooltip from '../../customs/CustomTooltip';
import { updateCurrentCardField } from '../../store/cardsSlice';
import { stampIcons } from '../../utils/stampIcons';
import ColorSettings from './ColorSettings';
import ImageUploader from './ImageUploader';
import StampIconSelector from './StampIconSelector';
import StatusFieldConfig from './StatusFieldConfig';
import {
  BarcodeRadioTitle,
  CreateButton,
  DesignSection,
  Divider,
  StampQuantityButton,
  StampQuantityGrid,
  StampSectionLabel,
  StampSettings,
  StampSettingsBlock,
  StepNote,
  TopRow,
  Wrapper,
} from './styles';

const EditDesign = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const mainImgRef = useRef(null);

  const [hoverDesignKey, setHoverDesignKey] = useState(null);
  const [isDirty, setIsDirty] = useState(false);

  const currentCard = useSelector((state) => state.cards.currentCard);
  const fieldsName = useSelector((state) => state.cards.currentCard.fieldsName) || [];
  const statusType = currentCard?.status;
  const design = currentCard?.design || {};
  const { stampsQuantity = 0 } = design;

  const isStampCard = ['stamp', 'subscription'].includes(statusType);
  const isSubscription = statusType === 'subscription';
  const isCashback = statusType === 'cashback';

  const TEXT = {
    qtyTitle: isSubscription ? 'Количество визитов' : 'Количество штампов',
    qtyTooltip: isSubscription
      ? 'Количество визитов, отображаемых на карте'
      : 'Количество штампов, отображаемых на карте',
    activeLabel: isSubscription ? 'Активный визит' : 'Активный штамп',
    activeTooltip: isSubscription ? 'Дизайн активного визита' : 'Дизайн активного штампа',
    inactiveLabel: isSubscription ? 'Неактивный визит' : 'Неактивный штамп',
    inactiveTooltip: isSubscription ? 'Дизайн неактивного визита' : 'Дизайн неактивного штампа',
    centerTooltip: isSubscription
      ? 'Дизайн фоновой части под визитами'
      : 'Дизайн фоновой части под штампами',
  };

  const formRef = useRef(null);
  const stampSectionRef = useRef(null);

  const flashInput = useCallback((key) => {
    const el = formRef.current?.querySelector(`[data-design-key="${key}"]`);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    el.classList.add('flash-border');
    setTimeout(() => el.classList.remove('flash-border'), 1000);
  }, []);

  const handleFieldClick = useCallback(
    (key) => {
      if (['stampsQuantity', 'stampIcons', 'activeStamp', 'inactiveStamp'].includes(key)) {
        stampSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      flashInput(key);
    },
    [flashInput],
  );

  useEffect(() => {
    if (isStampCard && (!design.stampsQuantity || design.stampsQuantity === 0)) {
      dispatch(updateCurrentCardField({ path: 'design.stampsQuantity', value: 10 }));
    }
    if (location.state?.flashKey) {
      handleFieldClick(location.state.flashKey);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isStampCard, location.state, handleFieldClick]);

  const handleStampIconChange = (path, iconName) => {
    dispatch(updateCurrentCardField({ path, value: iconName }));
    setIsDirty(true);
  };

  const handleImageChangeFromEditor = (croppedImage, field) => {
    dispatch(updateCurrentCardField({ path: `design.${field}`, value: croppedImage }));
    setIsDirty(true);
  };

  const handleSave = async () => {
    if (isStampCard) {
      const targetEl = mainImgRef.current;
      if (targetEl) {
        try {
          const overlay = targetEl.querySelector('[data-stamp-overlay]');
          if (
            overlay &&
            (!design.stampBackground || overlay.style.backgroundImage.includes('null'))
          ) {
            overlay.style.backgroundImage = 'none';
          }

          const canvas = await html2canvas(targetEl, {
            scale: 3,
            backgroundColor: null,
            useCORS: true,
            allowTaint: false,
            logging: false,
          });

          const dataUrl = canvas.toDataURL('image/png');
          dispatch(updateCurrentCardField({ path: 'design.stampBackground', value: dataUrl }));
        } catch (e) {
          // no-op
        }
      }
    }

    dispatch(updateCurrentCardField({ path: 'designReady', value: true }));
    setIsDirty(false);
    navigate(`/cards/${id}/edit/settings`);
  };

  const renderStampControls = () => (
    <>
      <Wrapper ref={stampSectionRef} data-design-key="stampsQuantity">
        <StampSectionLabel>
          <BarcodeRadioTitle>{TEXT.qtyTitle}</BarcodeRadioTitle>
          <CustomTooltip id="stamps-help" html content={TEXT.qtyTooltip} />
        </StampSectionLabel>

        <StampQuantityGrid>
          {Array.from({ length: 30 }, (_, i) => i + 1).map((num) => (
            <StampQuantityButton
              key={num}
              $active={num <= stampsQuantity}
              onClick={() =>
                {
                  dispatch(updateCurrentCardField({ path: 'design.stampsQuantity', value: num }));
                  setIsDirty(true);
                }
              }
            >
              {num}
            </StampQuantityButton>
          ))}
        </StampQuantityGrid>
      </Wrapper>

      <hr />

      <StampSettings>
        <StampSettingsBlock data-design-key="activeStamp">
          <StampIconSelector
            label={TEXT.activeLabel}
            tooltip={TEXT.activeTooltip}
            value={typeof design.activeStamp === 'string' ? design.activeStamp : 'Star'}
            options={stampIcons}
            onChange={(val) => {
              handleStampIconChange('design.activeStamp', val);
              dispatch(updateCurrentCardField({ path: 'design.activeStampImage', value: null }));
            }}
          />

          <ImageUploader
            inputId="active-stamp-upload"
            infoText="Минимальный размер файла 200×200 пикселей. Поддерживаемые форматы: PNG, JPEG. До 3 МБ."
            onSave={(img) => handleImageChangeFromEditor(img, 'activeStampImage')}
            externalImage={design.activeStampImage}
          />
        </StampSettingsBlock>

        <StampSettingsBlock data-design-key="inactiveStamp">
          <StampIconSelector
            label={TEXT.inactiveLabel}
            tooltip={TEXT.inactiveTooltip}
            value={typeof design.inactiveStamp === 'string' ? design.inactiveStamp : 'Star'}
            options={stampIcons}
            onChange={(val) => {
              handleStampIconChange('design.inactiveStamp', val);
              dispatch(updateCurrentCardField({ path: 'design.inactiveStampImage', value: null }));
            }}
          />

          <ImageUploader
            inputId="inactive-stamp-upload"
            infoText="Минимальный размер файла 200×200 пикселей. Поддерживаемые форматы: PNG, JPEG. До 3 МБ."
            onSave={(img) => handleImageChangeFromEditor(img, 'inactiveStampImage')}
            externalImage={design.inactiveStampImage}
          />
        </StampSettingsBlock>
      </StampSettings>

      <hr />
    </>
  );

  const designContent = (
    <DesignSection ref={formRef}>
      <div>
        <TopRow>
          <TitleWithHelp
            title="Выберите тип карты"
            tooltipId="edit-type-help"
            tooltipHtml
            tooltipContent="Выберите тип карты для дальнейшей настройки"
          />
          <StepNote>Шаг 2 из 5</StepNote>
        </TopRow>
        <Divider />
      </div>

      {isStampCard && renderStampControls()}

      <StampSettings>
        <StampSettingsBlock data-design-key="logo">
          <StampSectionLabel>
            <BarcodeRadioTitle>Логотип</BarcodeRadioTitle>
            <CustomTooltip
              id="logo-help"
              html
              content="Логотип будет отображаться на карте, а так же в форме выпуска карты (если настройка включена)"
            />
          </StampSectionLabel>

          <ImageUploader
            inputId="logo-upload"
            infoText="Рекомендованный размер: 480×150 пикселей (минимальная высота 150). Поддерживаемые форматы: PNG, JPEG. До 3 МБ."
            onSave={(img) => handleImageChangeFromEditor(img, 'logo')}
            aspect={16 / 5}
          />
        </StampSettingsBlock>

        <StampSettingsBlock data-design-key="icon">
          <StampSectionLabel>
            <BarcodeRadioTitle>Иконка push-уведомления</BarcodeRadioTitle>
            <CustomTooltip
              id="icon-help"
              html
              content="Иконка будет отображаться в push-сообщениях, а так же при установке карты на Домашний экран"
            />
          </StampSectionLabel>
          <ImageUploader
            inputId="icon-upload"
            infoText="Рекомендованный размер иконки: 512×512 (квадрат). Поддерживаемые форматы: PNG, JPEG. До 3 МБ."
            onSave={(img) => handleImageChangeFromEditor(img, 'icon')}
            aspect={1}
          />
        </StampSettingsBlock>
      </StampSettings>

      <StampSettings>
        <StampSettingsBlock data-design-key="stampBackground">
          <StampSectionLabel>
            <BarcodeRadioTitle>Фон центральной части</BarcodeRadioTitle>
            <CustomTooltip id="center-help" html content={TEXT.centerTooltip} />
          </StampSectionLabel>

          <ImageUploader
            inputId="stamp-background-upload"
            infoText="Минимальный размер файла 1125×432 пикселя. Поддерживаемые форматы: PNG, JPEG. До 3 МБ."
            onSave={(img) => handleImageChangeFromEditor(img, 'stampBackground')}
            aspect={1125 / 432}
          />
        </StampSettingsBlock>

        <StampSettingsBlock />
      </StampSettings>

      <hr />
      <StampSectionLabel>
        <BarcodeRadioTitle>Цвета</BarcodeRadioTitle>
        <CustomTooltip id="color-help" html content="Настройка цветов карты" />
      </StampSectionLabel>

      <ColorSettings
        colors={design.colors}
        handleColorChange={(key, value) => {
          dispatch(updateCurrentCardField({ path: `design.colors.${key}`, value }));
          setIsDirty(true);
        }}
        isStampCard={isStampCard}
        onHoverKeyChange={(key) => setHoverDesignKey(key)}
      />
      <hr />

      {!isCashback && (
        <>
          <StampSectionLabel>
            <BarcodeRadioTitle>Названия дополнительных полей</BarcodeRadioTitle>
            <CustomTooltip
              id="color-fields-help"
              html
              content="Настройка полей для отображения на лицевой стороне карты (только для iPhone)"
            />
          </StampSectionLabel>

          <StatusFieldConfig statusType={statusType} fields={fieldsName} />
        </>
      )}
    </DesignSection>
  );

  useEffect(() => {
    const onBeforeUnload = (e) => {
      if (!isDirty) return;
      e.preventDefault();
      e.returnValue = 'Последние изменения не сохранены';
      return 'Последние изменения не сохранены';
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [isDirty]);

  return (
    <EditLayout
      onFieldClick={handleFieldClick}
      hoverDesignKey={hoverDesignKey}
      mainImgRef={mainImgRef}
    >
      {designContent}
      <CreateButton onClick={handleSave}>Перейти к следующему шагу</CreateButton>
    </EditLayout>
  );
};

export default EditDesign;
