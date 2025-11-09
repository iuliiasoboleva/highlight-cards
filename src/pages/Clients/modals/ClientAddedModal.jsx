import React, { useCallback } from 'react';

import CustomMainButton from '../../../customs/CustomMainButton';
import CustomModal from '../../../customs/CustomModal';
import { ActionsRow, Description } from '../styles';

const ClientAddedModal = ({ open, onClose, link, phone }) => {
  const androidLink = link?.androidLink || '';
  const iosLink = link?.iosLink || '';
  
  const text = androidLink && iosLink 
    ? `Ваша карта доступна по ссылке ниже\nAndroid: ${androidLink}\niOS: ${iosLink}`
    : 'Ваша карта лояльности готова';

  const handleWhatsApp = useCallback(() => {
    const cleanPhone = phone ? phone.replace(/\D/g, '') : '';
    const phoneParam = cleanPhone ? `phone=${cleanPhone}&` : '';
    const url = `https://api.whatsapp.com/send/?${phoneParam}text=${encodeURIComponent(text)}&type=phone_number&app_absent=0`;
    window.open(url, '_blank', 'noopener,noreferrer');
    onClose?.();
  }, [text, phone, onClose]);

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
      </ActionsRow>
    </CustomModal>
  );
};

export default ClientAddedModal;
