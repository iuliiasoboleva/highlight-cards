import React from 'react';
import { useNavigate } from 'react-router-dom';

import {
  ClientsModal,
  ClientsModalActions,
  ClientsModalButtonPrimary,
  ClientsModalButtonSecondary,
  ClientsModalOverlay,
  ClientsModalTitle,
  FooterCardDescription,
} from '../styles';

const NoBranchModal = ({ open, onClose }) => {
  const navigate = useNavigate();
  if (!open) return null;

  return (
    <ClientsModalOverlay onClick={onClose}>
      <ClientsModal onClick={(e) => e.stopPropagation()}>
        <ClientsModalTitle>Нет точек продаж</ClientsModalTitle>
        <FooterCardDescription>Сначала необходимо добавить точку продаж.</FooterCardDescription>
        <ClientsModalActions>
          <ClientsModalButtonPrimary onClick={() => navigate('/managers')}>
            Перейти
          </ClientsModalButtonPrimary>
          <ClientsModalButtonSecondary onClick={onClose}>Отменить</ClientsModalButtonSecondary>
        </ClientsModalActions>
      </ClientsModal>
    </ClientsModalOverlay>
  );
};

export default NoBranchModal;
