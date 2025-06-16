import React, { useState } from 'react';
import QRCodeComponent from 'react-qr-code';
import { useDispatch, useSelector } from 'react-redux';

import { updateCurrentCardField } from '../../store/cardsSlice';
import { generatePDF } from '../../utils/pdfGenerator';

import './styles.css';

const QRPopup = ({ cardId, onClose }) => {
  const dispatch = useDispatch();
  const currentCard = useSelector((state) => state.cards.currentCard);
  const [isCopied, setIsCopied] = useState(false);

  const link = currentCard?.urlCopy || 'https://example.com';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(link);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const activateCard = () => {
    dispatch(
      updateCurrentCardField({
        path: 'isActive',
        value: !currentCard.isActive,
      }),
    );
  };

  return (
    <div className="qr-popup-overlay">
      <div className="qr-popup-container">
        <div className="location-modal-header">
          <h2>Посмотреть на своем телефоне</h2>
          <button className="location-modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="qr-code-wrapper" id="qr-code">
          <QRCodeComponent value={link} size={200} />
          <p className="qr-link">{link}</p>
        </div>

        <div className="action-buttons">
          <button onClick={copyToClipboard} className="action-button">
            {isCopied ? 'Скопировано!' : 'Скопировать ссылку'}
          </button>
          {/* НЕ УДАЛЯТЬ, ПОЯВИТСЯ ПОЗЖЕ */}
          {/* <button onClick={() => generatePDF(currentCard)} className="action-button">
            Скачать PDF
          </button> */}
          <button onClick={activateCard} className="action-button primary">
            {currentCard.isActive ? 'Деактивировать карту' : 'Активировать карту'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRPopup;
