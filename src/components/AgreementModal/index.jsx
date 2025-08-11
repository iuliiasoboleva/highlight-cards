import React, { useState } from 'react';

import CustomCheckbox from '../../customs/CustomCheckbox';

import './styles.css';

const AgreementModal = ({ onClose, onConfirm }) => {
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="modal-backdrop">
      <div className="agreement-modal">
        <div className="modal-header">
          <h3>Договор-оферта</h3>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-content">
          <textarea readOnly defaultValue={termsText} />
        </div>
        <label className="checkbox-row">
          <CustomCheckbox
            checked={agreed}
            onChange={() => setAgreed(!agreed)}
            label={
              <>
                Я принимаю{' '}
                <a href="https://loyalclub.ru/oferta" target="_blank" rel="noopener noreferrer">
                  условия соглашения
                </a>{' '}
                и{' '}
                <a href="https://loyalclub.ru/policy" target="_blank" rel="noopener noreferrer">
                  политику обработки персональных данных
                </a>
              </>
            }
          />
        </label>

        <div className="modal-actions">
          <button className="btn-dark" disabled={!agreed} onClick={onConfirm}>
            Перейти к оплате
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgreementModal;

const termsText = `
Terms of Use

Welcome to highlightcards.co.uk (together with any related websites, the “Site”). The Site is owned and operated by Highlight Hub Ltd. (“Highlightcards”). Please read these Terms of Use (“Terms”) carefully before using the Site...

1. Subscription Agreement.

These Terms do not govern the use of the digital customer loyalty program service as...
`;
