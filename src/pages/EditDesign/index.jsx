import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { faCircleQuestion } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import CardInfo from '../../components/CardInfo';
import {
  updateBackground,
  updateColors,
  updateIcon,
  updateLogo,
} from '../../store/cardDesignSlice';

import './styles.css';

const EditDesign = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const designState = useSelector((state) => state.cardDesign);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  const [activeTab, setActiveTab] = useState('description');

  const { logo, icon, background, colors } = designState;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleImageChange = (e, action) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      dispatch(action(imageUrl));
    }
  };

  const handleColorChange = (key, value) => {
    const updatedColors = {
      ...colors,
      [key]: value,
    };
    dispatch(updateColors(updatedColors));
  };

  const handleSave = () => {
    navigate(`/cards/${id}/edit/info`);
  };

  const previewCardData = {
    id,
    title: 'Карта',
    name: 'Накопительная карта',
    status: 'stamp',
    cardImg: background || '/default-card-bg.png',
    pdfImg: '/default-qr.png',
    ...designState,
  };

  const designContent = (
    <div className="design-section">
      <h2>
        Настройки <FontAwesomeIcon icon={faCircleQuestion} style={{ fontSize: 16 }} />
      </h2>
      <hr />
      <div className="design-row">
        <div className="upload-box">
          <label className="upload-label">Логотип</label>
          <div className="upload-area">
            {logo ? (
              <img src={logo} alt="logo" className="preview-img" />
            ) : (
              <div className="upload-placeholder">📁</div>
            )}
            <input
              type="file"
              id="logo"
              hidden
              onChange={(e) => handleImageChange(e, updateLogo)}
            />
            <label htmlFor="logo" className="upload-button">
              Выбрать файл
            </label>
          </div>
          <p className="upload-description">
            Рекомендуемый размер: 480x150 пикселей. Только PNG. 3 МБ
          </p>
        </div>

        <div className="upload-box">
          <label className="upload-label">Иконка</label>
          <div className="upload-area">
            {icon ? (
              <img src={icon} alt="icon" className="preview-img" />
            ) : (
              <div className="upload-placeholder">📁</div>
            )}
            <input
              type="file"
              id="icon"
              hidden
              onChange={(e) => handleImageChange(e, updateIcon)}
            />
            <label htmlFor="icon" className="upload-button">
              Выбрать файл
            </label>
          </div>
          <p className="upload-description">
            Рекомендуемый размер: 512x512 пикселей. Только PNG. 3 МБ
          </p>
        </div>
      </div>

      <div className="upload-box full-width">
        <label className="upload-label">Фон центральной части</label>
        <div className="upload-area">
          {background ? (
            <img src={background} alt="background" className="preview-img" />
          ) : (
            <div className="upload-placeholder">📁</div>
          )}
          <input
            type="file"
            id="background"
            hidden
            onChange={(e) => handleImageChange(e, updateBackground)}
          />
          <label htmlFor="background" className="upload-button">
            Выбрать файл
          </label>
        </div>
        <p className="upload-description">Минимальный размер: 1125x432. Только PNG. 3 МБ</p>
      </div>

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

  const cardPreview = (
    <div className="type-card-image-container">
      <img className="card-image-add" src="/phone.svg" alt="preview" />
      <CardInfo card={previewCardData} />
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
          {activeTab === 'description' && <div className="edit-type-page">{designContent}</div>}
          {activeTab === 'card' && cardPreview}
        </div>
      ) : (
        <>
          <div className="edit-type-page">{designContent}</div>
          {cardPreview}
        </>
      )}
    </div>
  );
};

export default EditDesign;
