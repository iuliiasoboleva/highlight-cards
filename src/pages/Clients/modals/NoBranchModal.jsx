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
      title="Необходимо создать точку продаж"
      actions={
        <>
          <CustomModal.PrimaryButton
            onClick={() => {
              onClose();
              navigate('/managers');
            }}
          >
            Создать точку продаж
          </CustomModal.PrimaryButton>
          <CustomModal.SecondaryButton onClick={onClose}>Отменить</CustomModal.SecondaryButton>
        </>
      }
    >
      <FooterCardDescription>
        Для добавления клиента необходимо сначала создать точку продаж.
      </FooterCardDescription>
    </CustomModal>
  );
};

export default NoBranchModal;
