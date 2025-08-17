import React from 'react';
import { useNavigate } from 'react-router-dom';

import CustomModal from '../../../customs/CustomModal';

const SmsWalletModal = ({ open, onClose }) => {
  const navigate = useNavigate();

  return (
    <CustomModal
      open={open}
      onClose={onClose}
      title="СМС-кошелёк"
      actions={
        <>
          <CustomModal.PrimaryButton
            onClick={() => {
              onClose?.();
              navigate('/settings');
            }}
          >
            Пополнить кошелёк
          </CustomModal.PrimaryButton>
          <CustomModal.SecondaryButton onClick={onClose}>Отменить</CustomModal.SecondaryButton>
        </>
      }
    >
      <p style={{ margin: 0 }}>
        Для отправки СМС необходимо пополнить СМС-кошелёк. Перейдите в настройки и пополните баланс.
      </p>
    </CustomModal>
  );
};

export default SmsWalletModal;
