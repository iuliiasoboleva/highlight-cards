import React, { useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';

import { HelpCircle } from 'lucide-react';

import EditLayout from '../../components/EditLayout';
import { updateCurrentCardField } from '../../store/cardsSlice';
import { stampIcons } from '../../utils/stampIcons';
import ColorSettings from './ColorSettings';
import ImageUploader from './ImageUploader';
import StampIconSelector from './StampIconSelector';
import StatusFieldConfig from './StatusFieldConfig';

import './styles.css';

const EditDesign = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const currentCard = useSelector((state) => state.cards.currentCard);
  const fieldsName = useSelector((state) => state.cards.currentCard.fieldsName) || [];
  const statusType = currentCard.status;
  const design = currentCard.design || {};
  const { stampsQuantity = 0 } = design;

  const isStampCard = ['stamp', 'subscription'].includes(currentCard.status);

  const formRef = useRef(null);
  const stampSectionRef = useRef(null);

  // функция подсветки
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
  };

  const handleImageChangeFromEditor = (croppedImage, field) => {
    dispatch(updateCurrentCardField({ path: `design.${field}`, value: croppedImage }));
  };

  const handleSave = () => {
    navigate(`/cards/${id}/edit/info`);
  };

  const renderStampControls = () => (
    <>
      <div ref={stampSectionRef} className="design-stamp-controls" data-design-key="stampsQuantity">
        <label className="stamp-section-label">
          <h3 className="barcode-radio-title">
            Количество штампов
            <HelpCircle
              size={16}
              style={{ marginLeft: 6, cursor: 'pointer', outline: 'none' }}
              data-tooltip-id="stamps-help"
              data-tooltip-html="Количество штампов отображаемых на карте"
            />
          </h3>
          <Tooltip id="stamps-help" className="custom-tooltip" />
        </label>
        <div className="stamp-quantity-grid">
          {Array.from({ length: 30 }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              className={`stamp-quantity-button ${num <= stampsQuantity ? 'active' : ''}`}
              onClick={() =>
                dispatch(updateCurrentCardField({ path: 'design.stampsQuantity', value: num }))
              }
            >
              {num}
            </button>
          ))}
        </div>
      </div>
      <hr />

      <div className="stamp-settings">
        <div className="stamp-settings-block" data-design-key="activeStamp">
          <StampIconSelector
            label="Активный штамп"
            tooltip={'Дизайн активного штампа'}
            value={typeof design.activeStamp === 'string' ? design.activeStamp : 'Star'}
            options={stampIcons}
            onChange={(val) => {
              handleStampIconChange(`design.activeStamp`, val);
              dispatch(updateCurrentCardField({ path: `design.activeStampImage`, value: null }));
            }}
          />
          <ImageUploader
            inputId="active-stamp-upload"
            infoText="Минимальный размер файла 200 x 200 пикселей. Только PNG формат. 3 мегабайта"
            onSave={(croppedImage) => handleImageChangeFromEditor(croppedImage, 'activeStampImage')}
            externalImage={design.activeStampImage}
          />
        </div>

        <div className="stamp-settings-block" data-design-key="inactiveStamp">
          <StampIconSelector
            label="Неактивный штамп"
            tooltip={'Дизайн неактивного штампа'}
            value={typeof design.inactiveStamp === 'string' ? design.inactiveStamp : 'Star'}
            options={stampIcons}
            onChange={(val) => {
              handleStampIconChange(`design.inactiveStamp`, val);
              dispatch(updateCurrentCardField({ path: `design.inactiveStampImage`, value: null }));
            }}
          />
          <ImageUploader
            inputId="inactive-stamp-upload"
            infoText="Минимальный размер файла 200 x 200 пикселей. Только PNG формат. 3 мегабайта"
            onSave={(croppedImage) =>
              handleImageChangeFromEditor(croppedImage, 'inactiveStampImage')
            }
            externalImage={design.inactiveStampImage}
          />
        </div>
      </div>
      <hr />
    </>
  );

  const designContent = (
    <div className="settings-inputs-container" ref={formRef}>
      <h2>
        Дизайн
        <HelpCircle
          size={16}
          style={{ marginLeft: 6, cursor: 'pointer', outline: 'none' }}
          data-tooltip-id="design-help"
          data-tooltip-html="Настройки внешнего вида карты"
        />
      </h2>
      <Tooltip id="design-help" className="custom-tooltip" />
      <hr />

      {isStampCard && renderStampControls()}

      <div className="stamp-settings">
        <div className="stamp-settings-block" data-design-key="logo">
          <h3 className="barcode-radio-title">
            Логотип
            <HelpCircle
              size={16}
              style={{ marginLeft: 6, cursor: 'pointer', outline: 'none' }}
              data-tooltip-id="logo-help"
              data-tooltip-html="Логотип будет отображаться на карте, а так же в форме выпуска карты (если настройка включена)"
            />
          </h3>
          <Tooltip id="logo-help" className="custom-tooltip" />
          <ImageUploader
            inputId="logo-upload"
            infoText="Рекомендованный размер: 480х150 пикселей. Минимальная высота 150 пикселей. Только PNG формат. 3 мегабайта"
            onSave={(croppedImage) => handleImageChangeFromEditor(croppedImage, 'logo')}
          />
        </div>

        <div className="stamp-settings-block" data-design-key="icon">
          <h3 className="barcode-radio-title">
            Иконка
            <HelpCircle
              size={16}
              style={{ marginLeft: 6, cursor: 'pointer', outline: 'none' }}
              data-tooltip-id="icon-help"
              data-tooltip-html="Иконка будет отображаться в push-сообщениях, а так же при установке карты на Домашний экран"
            />
          </h3>
          <Tooltip id="icon-help" className="custom-tooltip" />
          <ImageUploader
            inputId="icon-upload"
            infoText="Рекомендованный размер иконки: 512х512 пикселей. Изображение должно быть квадратное. Только PNG формат. 3 мегабайта"
            onSave={(croppedImage) => handleImageChangeFromEditor(croppedImage, 'icon')}
          />
        </div>
      </div>
      <div className="stamp-settings">
        <div className="stamp-settings-block" data-design-key="stampBackground">
          <h3 className="barcode-radio-title">
            Фон центральной части
            <HelpCircle
              size={16}
              style={{ marginLeft: 6, cursor: 'pointer', outline: 'none' }}
              data-tooltip-id="center-help"
              data-tooltip-html="Дизайн фоновой части под штампами"
            />
          </h3>
          <Tooltip id="center-help" className="custom-tooltip" />
          <ImageUploader
            inputId="stamp-background-upload"
            infoText="Минимальный размер файла 1125 х 432 пикселя. Только PNG формат. 3 мегабайта"
            onSave={(croppedImage) => handleImageChangeFromEditor(croppedImage, 'stampBackground')}
          />
        </div>
        <div className="stamp-settings-block"></div>
      </div>
      <hr />

      <h3 className="barcode-radio-title">
        Цвета
        <HelpCircle
          size={16}
          style={{ marginLeft: 6, cursor: 'pointer', outline: 'none' }}
          data-tooltip-id="color-help"
          data-tooltip-html="Настройка цветов карты"
        />
      </h3>
      <Tooltip id="color-help" className="custom-tooltip" />
      <ColorSettings
        colors={design.colors}
        handleColorChange={(key, value) =>
          dispatch(updateCurrentCardField({ path: `design.colors.${key}`, value }))
        }
        isStampCard={isStampCard}
      />

      <hr />
      <h3 className="barcode-radio-title">
        Названия полей
        <HelpCircle
          size={16}
          style={{ marginLeft: 6, cursor: 'pointer', outline: 'none' }}
          data-tooltip-id="color-fields-help"
          data-tooltip-html="Настройка полей для отображения на лицевой стороне карты (только для iPhone)"
        />
      </h3>
      <Tooltip id="color-fields-help" className="custom-tooltip" />
      <StatusFieldConfig statusType={statusType} fields={fieldsName} />
    </div>
  );

  return (
    <EditLayout onFieldClick={handleFieldClick}>
      {designContent}
      <div className="design-save-container">
        <button className="design-save-btn" onClick={handleSave}>
          Далее
        </button>
      </div>
    </EditLayout>
  );
};

export default EditDesign;
