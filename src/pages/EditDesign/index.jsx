import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
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
  const dispatch = useDispatch();

  const currentCard = useSelector((state) => state.cards.currentCard);
  const fieldsName = useSelector((state) => state.cards.currentCard.fieldsName) || [];
  const statusType = currentCard.status;
  const design = currentCard.design || {};
  const { stampsQuantity = 0 } = design;

  const isStampCard = ['stamp', 'subscription'].includes(currentCard.status);

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
      <div className="design-stamp-controls">
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
        <div className="stamp-settings-block">
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

        <div className="stamp-settings-block">
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
    <div className="settings-inputs-container">
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
        <div className="stamp-settings-block">
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

        <div className="stamp-settings-block">
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
        <div className="stamp-settings-block">
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
      <button onClick={handleSave} className="create-button">
        Продолжить
      </button>
    </div>
  );

  return <EditLayout>{designContent}</EditLayout>;
};

export default EditDesign;
