import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import {
  faCheck,
  faCircleQuestion,
  faFire,
  faGem,
  faHeart,
  faStar,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import CardInfo from '../../components/CardInfo';
import { updateCardById } from '../../store/cardsSlice';

import './styles.css';

const STAMP_ICONS = [
  { id: 1, name: 'Звезда', icon: faStar },
  { id: 2, name: 'Сердце', icon: faHeart },
  { id: 3, name: 'Галочка', icon: faCheck },
  { id: 4, name: 'Огонь', icon: faFire },
  { id: 5, name: 'Бриллиант', icon: faGem },
];

const EditDesign = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const currentCard = useSelector((state) =>
    state.cards.cards.find((c) => String(c.id) === id)
  ) || {
    design: {
      logo: null,
      icon: null,
      background: null,
      colors: {
        cardBackground: '#FFFFFF',
        centerBackground: '#F6F6F6',
        textColor: '#1F1E1F',
      },
      stampIcon: STAMP_ICONS[0].icon,
      stampsQuantity: 0,
    },
  };

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  const [activeTab, setActiveTab] = useState('description');

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
    stampIcon = STAMP_ICONS[0].icon,
    stampsQuantity = 0,
  } = design;

  const isStampCard = ['stamp', 'subscription'].includes(currentCard.status);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleImageChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      dispatch(
        updateCardById({
          id: currentCard.id,
          changes: {
            design: {
              ...design,
              [field]: imageUrl,
            },
          },
        })
      );
    }
  };

  const handleColorChange = (key, value) => {
    dispatch(
      updateCardById({
        id: currentCard.id,
        changes: {
          design: {
            ...design,
            colors: {
              ...colors,
              [key]: value,
            },
          },
        },
      })
    );
  };

  const handleStampsChange = (e) => {
    const value = Math.min(30, Math.max(0, parseInt(e.target.value) || 0));
    dispatch(
      updateCardById({
        id: currentCard.id,
        changes: {
          design: {
            ...design,
            stampsQuantity: value,
          },
        },
      })
    );
  };

  const handleStampIconChange = (icon) => {
    dispatch(
      updateCardById({
        id: currentCard.id,
        changes: {
          design: {
            ...design,
            stampIcon: icon,
          },
        },
      })
    );
  };

  const handleSave = () => {
    navigate(`/cards/${id}/edit/info`);
  };

  const previewCardData = {
    ...currentCard,
    cardImg: background || '/default-card-bg.png',
    qrImg: '/default-qr.png',
    design: {
      ...design,
      stampsQuantity,
      stampIcon,
    },
  };

  const renderStampControls = () => (
    <div className="design-stamp-controls">
      <h3>Настройки штампов</h3>
      <div className="stamp-count-control">
        <label>Количество штампов (0-30)</label>
        <input
          type="number"
          min="0"
          max="30"
          value={stampsQuantity}
          onChange={handleStampsChange}
        />
      </div>

      <div className="stamp-icon-control">
        <label>Выберите иконку штампа</label>
        <div className="stamp-icon-options">
          {STAMP_ICONS.map(({ id, name, icon }) => (
            <button
              key={id}
              className={`stamp-icon-option ${stampIcon === icon ? 'active' : ''}`}
              onClick={() => handleStampIconChange(icon)}
              title={name}
            >
              <FontAwesomeIcon icon={icon} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const designContent = (
    <div className="design-section">
      <h2>
        Настройки <FontAwesomeIcon icon={faCircleQuestion} style={{ fontSize: 16 }} />
      </h2>
      <hr />

      {isStampCard && renderStampControls()}

      <div className="design-row">
        <div className="upload-box">
          <h3>Логотип</h3>
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
              onChange={(e) => handleImageChange(e, 'logo')}
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
          <h3>Иконка</h3>
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
              onChange={(e) => handleImageChange(e, 'icon')}
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

      {!isStampCard && (
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
