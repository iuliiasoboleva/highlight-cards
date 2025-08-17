import React, { useCallback } from 'react';

import CustomMainButton from '../../../customs/CustomMainButton';
import CustomModal from '../../../customs/CustomModal';
import { ActionsRow, Description } from '../styles';

const ClientAddedModal = ({ open, onClose, link }) => {
  const text = `Здравствуйте! Для активации карты лояльности перейдите по ссылке: ${link}`;

  const handleWhatsApp = useCallback(() => {
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    onClose?.();
  }, [text, onClose]);

  return (
    <CustomModal
      open={open}
      onClose={onClose}
      title="Клиент успешно добавлен"
      actions={<CustomModal.SecondaryButton onClick={onClose}>Закрыть</CustomModal.SecondaryButton>}
    >
      <Description>
        Клиент успешно добавлен в базу. Отправьте клиенту ссылку для активации карты.
      </Description>

      <ActionsRow>
        <CustomMainButton onClick={handleWhatsApp}>WhatsApp Business</CustomMainButton>

        <CustomMainButton
          onClick={() => {
            window.dispatchEvent(new CustomEvent('open-sms-wallet-modal'));
            onClose?.();
          }}
        >
          СМС
        </CustomMainButton>
      </ActionsRow>
    </CustomModal>
  );
};

export default ClientAddedModal;
