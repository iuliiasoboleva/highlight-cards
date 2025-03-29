import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CardInfo from '../../components/CardInfo';
import './styles.css';

const EditDesign = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [logo, setLogo] = useState(null);
  const [icon, setIcon] = useState(null);
  const [background, setBackground] = useState(null);

  const [colors, setColors] = useState({
    cardBackground: '#FFFFFF',
    centerBackground: '#F6F6F6',
    textColor: '#1F1E1F',
  });

  const handleImageChange = (e, setter) => {
    const file = e.target.files[0];
    if (file) {
      setter(URL.createObjectURL(file));
    }
  };

  const handleColorChange = (key, value) => {
    setColors(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveDesign = () => {
    console.log('Сохранение дизайна:', { logo, icon, background, colors });
    navigate(`/cards/${id}/edit/info`);
  };

  return (
    <div className='edit-type-main-container'>
      <div className="edit-type-page">
        <h2>Дизайн</h2>
        <hr />
        <div className="design-section">
          <div className="design-row">
            <div className="upload-box">
              <label className="upload-label">Логотип 🛈</label>
              <div className="upload-area">
                {logo ? (
                  <img src={logo} alt="logo" className="preview-img" />
                ) : (
                  <div className="upload-placeholder">📁</div>
                )}
                <input type="file" id="logo" hidden onChange={(e) => handleImageChange(e, setLogo)} />
                <label htmlFor="logo" className="upload-button">Выбрать файл</label>
              </div>
              <p className="upload-description">Рекомендуемый размер: 480x150 пикселей. Только PNG. 3 МБ</p>
            </div>

            <div className="upload-box">
              <label className="upload-label">Иконка 🛈</label>
              <div className="upload-area">
                {icon ? (
                  <img src={icon} alt="icon" className="preview-img" />
                ) : (
                  <div className="upload-placeholder">📁</div>
                )}
                <input type="file" id="icon" hidden onChange={(e) => handleImageChange(e, setIcon)} />
                <label htmlFor="icon" className="upload-button">Выбрать файл</label>
              </div>
              <p className="upload-description">Рекомендуемый размер: 512x512 пикселей. Только PNG. 3 МБ</p>
            </div>
          </div>

          <div className="upload-box full-width">
            <label className="upload-label">Фон центральной части 🛈</label>
            <div className="upload-area">
              {background ? (
                <img src={background} alt="background" className="preview-img" />
              ) : (
                <div className="upload-placeholder">📁</div>
              )}
              <input type="file" id="background" hidden onChange={(e) => handleImageChange(e, setBackground)} />
              <label htmlFor="background" className="upload-button">Выбрать файл</label>
            </div>
            <p className="upload-description">Минимальный размер: 1125x432. Только PNG. 3 МБ</p>
          </div>

          <h3>Цвета 🛈</h3>
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

          <button className="upload-button" onClick={handleSaveDesign}>
            Сохранить и продолжить
          </button>
        </div>
      </div>

      <div className="type-card-image-container">
        <img className="card-image-add" src="/phone.svg" alt="preview" />
        <CardInfo card={{ id, title: 'Карта', name: 'Накопительная карта' }} />
      </div>
    </div>
  );
};

export default EditDesign;
