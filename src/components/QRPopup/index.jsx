import React, { useState } from 'react';
import QRCode from 'react-qr-code';

import { saveAs } from 'file-saver';

import './styles.css';

const QRPopup = ({ cardId, onClose }) => {
  const [isCopied, setIsCopied] = useState(false);
  const link = `https://dde3-2800-810-5fe-1d3-ef-4c2d-76b7-163c.ngrok-free.app/customer/10`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(link);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const downloadPDF = () => {
    const pdfBlob = new Blob([`QR Code Link: ${link}`], { type: 'application/pdf' });
    saveAs(pdfBlob, `card-${cardId}.pdf`);
  };

  const activateCard = () => {
    console.log('Card activated');
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
        <div className="qr-code-wrapper">
          <QRCode value={link} size={200} />
          <p className="qr-link">{link}</p>
        </div>

        <div className="action-buttons">
          <button onClick={copyToClipboard} className="action-button">
            {isCopied ? 'Скопировано!' : 'Скопировать ссылку'}
          </button>
          <button onClick={downloadPDF} className="action-button">
            Скачать PDF
          </button>
          <button onClick={activateCard} className="action-button primary">
            Активировать карту
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRPopup;
