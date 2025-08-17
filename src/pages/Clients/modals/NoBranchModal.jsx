import React from 'react';
import { useNavigate } from 'react-router-dom';

import CustomModal from '../../../customs/CustomModal';
import { FooterCardDescription } from '../styles';

const NoBranchModal = ({ open, onClose }) => {
  const navigate = useNavigate();
  if (!open) return null;

  return (
    <CustomModal
      open={open}
      onClose={onClose}
      title="Нет точек продаж"
      actions={
        <>
          <CustomModal.PrimaryButton onClick={() => navigate('/managers')}>
            Перейти
          </CustomModal.PrimaryButton>
          <CustomModal.SecondaryButton onClick={onClose}>Отменить</CustomModal.SecondaryButton>
        </>
      }
    >
      <FooterCardDescription>Сначала необходимо добавить точку продаж.</FooterCardDescription>
    </CustomModal>
  );
};

export default NoBranchModal;
