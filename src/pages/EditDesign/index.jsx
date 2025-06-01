import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { HelpCircle, Image as ImageIcon, Upload } from 'lucide-react';

import EditLayout from '../../components/EditLayout';
import { updateCurrentCardField } from '../../store/cardsSlice';
import { stampIcons } from '../../utils/stampIcons';
import ImageUploader from './ImageUploader';
import StampIconSelector from './StampIconSelector';

import './styles.css';

const EditDesign = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const currentCard = useSelector((state) => state.cards.currentCard);

  const design = currentCard.design || {};
  const {
    logo = null,
    icon = null,
    background = null,
    colors = {
      cardBackground: '#FFFFFF',
      centerBackground: '#F6F6F6',
      textColor: '#1F1E1F',
    },
    stampsQuantity = 0,
  } = design;

  const isStampCard = ['stamp', 'subscription'].includes(currentCard.status);

  const handleImageChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      dispatch(updateCurrentCardField({ path: `design.${field}`, value: imageUrl }));
    }
  };

  const handleColorChange = (key, value) => {
    dispatch(updateCurrentCardField({ path: `design.colors.${key}`, value }));
  };

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
            Количество штампов <HelpCircle size={16} style={{ marginLeft: 6 }} />
          </h3>
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
            value={design.activeStamp}
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
            value={design.inactiveStamp}
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
    </>
  );

  const renderUploadPlaceholder = () => (
    <div className="upload-placeholder">
      <ImageIcon size={32} />
    </div>
  );

  const designContent = (
    <div className="settings-inputs-container">
      <h2>
        Дизайн <HelpCircle size={16} />
      </h2>
      <hr />

      {isStampCard && renderStampControls()}
      <hr />

      <div className="stamp-settings">
        <div className="stamp-settings-block">
          <h3 className="barcode-radio-title">
            Логотип <HelpCircle size={16} style={{ marginLeft: 6 }} />
          </h3>
          <ImageUploader
            inputId="logo-upload"
            infoText="Рекомендованный размер: 480х150 пикселей. Минимальная высота 150 пикселей. Только PNG формат. 3 мегабайта"
            onSave={(croppedImage) => handleImageChangeFromEditor(croppedImage, 'logo')}
          />
        </div>

        <div className="stamp-settings-block">
          <h3 className="barcode-radio-title">
            Иконка <HelpCircle size={16} style={{ marginLeft: 6 }} />
          </h3>
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
            Фон под штампами <HelpCircle size={16} style={{ marginLeft: 6 }} />
          </h3>
          <ImageUploader
            inputId="stamp-background-upload"
            infoText="Минимальный размер файла 1125 х 432 пикселя. Только PNG формат. 3 мегабайта"
            onSave={(croppedImage) => handleImageChangeFromEditor(croppedImage, 'stampBackground')}
          />
        </div>
        <div className="stamp-settings-block"></div>
      </div>

      <hr />

      {!isStampCard && (
        <div className="upload-box full-width">
          <label className="upload-label">Фон центральной части</label>
          <div className="upload-area">
            {background ? (
              <img src={background} alt="background" className="preview-img" />
            ) : (
              renderUploadPlaceholder()
            )}
            <input
              type="file"
              id="background"
              hidden
              onChange={(e) => handleImageChange(e, 'background')}
            />
            <label htmlFor="background" className="upload-button">
              Выбрать файл
            </label>
          </div>
          <p className="upload-description">Минимальный размер: 1125x432. Только PNG. 3 МБ</p>
        </div>
      )}

      <h3>Цвета</h3>
      <div className="color-section">
        <div className="color-input">
          <label>Фон карты</label>
          <input
            type="color"
            value={colors.cardBackground}
            onChange={(e) => handleColorChange('cardBackground', e.target.value)}
          />
          <input type="text" value={colors.cardBackground} readOnly />
        </div>
        <div className="color-input">
          <label>Цвет текста</label>
          <input
            type="color"
            value={colors.textColor}
            onChange={(e) => handleColorChange('textColor', e.target.value)}
          />
          <input type="text" value={colors.textColor} readOnly />
        </div>
        <div className="color-input full-width">
          <label>Цвет фона центральной части</label>
          <input
            type="color"
            value={colors.centerBackground}
            onChange={(e) => handleColorChange('centerBackground', e.target.value)}
          />
          <input type="text" value={colors.centerBackground} readOnly />
        </div>
      </div>

      <button onClick={handleSave} className="create-button">
        Сохранить и продолжить
      </button>
    </div>
  );

  return <EditLayout>{designContent}</EditLayout>;
};

export default EditDesign;
