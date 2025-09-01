import React, { useState } from 'react';

import CustomCheckbox from '../../customs/CustomCheckbox';
import CustomModal from '../../customs/CustomModal';
import CustomTextArea from '../../customs/CustomTextarea';
import { CheckboxRow, Links, ModalContent } from './styles';

const AgreementModal = ({ open, onClose, onConfirm }) => {
  const [agreed, setAgreed] = useState(false);

  return (
    <CustomModal
      open={open}
      onClose={onClose}
      title="Договор-оферта"
      maxWidth={600}
      actions={
        <>
          <CustomModal.SecondaryButton onClick={onClose}>Отмена</CustomModal.SecondaryButton>
          <CustomModal.PrimaryButton onClick={onConfirm} disabled={!agreed}>
            Перейти к оплате
          </CustomModal.PrimaryButton>
        </>
      }
    >
      <ModalContent>
        <CustomTextArea readOnly value={termsText} rows={12} />

        <CheckboxRow>
          <CustomCheckbox
            checked={agreed}
            onChange={() => setAgreed((v) => !v)}
            label={
              <Links>
                Я принимаю{' '}
                <a href="https://loyalclub.ru/oferta" target="_blank" rel="noopener noreferrer">
                  условия соглашения
                </a>{' '}
                и{' '}
                <a href="https://loyalclub.ru/policy" target="_blank" rel="noopener noreferrer">
                  политику обработки персональных данных
                </a>
              </Links>
            }
          />
        </CheckboxRow>
      </ModalContent>
    </CustomModal>
  );
};

export default AgreementModal;

const termsText = `
Terms of Use

Welcome to highlightcards.co.uk (together with any related websites, the “Site”). The Site is owned and operated by Highlight Hub Ltd. (“Highlightcards”). Please read these Terms of Use (“Terms”) carefully before using the Site...

1. Subscription Agreement.

These Terms do not govern the use of the digital customer loyalty program service as...
`;
