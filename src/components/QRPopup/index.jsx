import React, { useEffect, useState } from 'react';
import QRCodeComponent from 'react-qr-code';
import { useSelector } from 'react-redux';

import CustomModal from '../../customs/CustomModal';
import { Actions, Content, QRBlock, QRLink } from './styles';

import { generatePDF } from '../../utils/pdfGenerator';

const QRPopup = ({ cardId, onClose, activateCard, open = true }) => {
  const currentCard = useSelector((state) => state.cards.currentCard);
  const [isCopied, setIsCopied] = useState(false);

  const link = currentCard?.urlCopy || 'https://example.com';

  const copyToClipboard = () => {
    if (!link) return;
    navigator.clipboard.writeText(link);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = open ? 'hidden' : prev;
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <CustomModal
      open={open}
      onClose={onClose}
      title="Посмотреть на своём телефоне"
      maxWidth={520}
      closeOnOverlayClick
    >
      <Content>
        <QRBlock>
          <QRCodeComponent value={link} size={200} />
          <QRLink>{link}</QRLink>
        </QRBlock>

        {/* Если понадобится — добавь блок статуса/информации */}
        {/* <InfoCard>
          <InfoTitle>Статус карты</InfoTitle>
          <p>{currentCard?.isActive ? 'Активна' : 'Не активна'}</p>
        </InfoCard> */}

        <Actions>
          <CustomModal.SecondaryButton onClick={() => generatePDF(currentCard)}>
            Печать QR-кода
          </CustomModal.SecondaryButton>

          <CustomModal.SecondaryButton onClick={copyToClipboard}>
            {isCopied ? 'Скопировано!' : 'Скопировать ссылку'}
          </CustomModal.SecondaryButton>

          <CustomModal.PrimaryButton onClick={activateCard}>
            {currentCard?.isActive ? 'Деактивировать карту' : 'Сохранить карту'}
          </CustomModal.PrimaryButton>
        </Actions>
      </Content>
    </CustomModal>
  );
};

export default QRPopup;
