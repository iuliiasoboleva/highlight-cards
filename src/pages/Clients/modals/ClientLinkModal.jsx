import React, { useCallback, useState } from 'react';

import CustomInput from '../../../customs/CustomInput';
import {
  ClientsModal,
  ClientsModalActions,
  ClientsModalButtonPrimary,
  ClientsModalButtonSecondary,
  ClientsModalOverlay,
  ClientsModalTitle,
  FooterCardDescription,
  LinkContainer,
} from '../styles';

const ClientLinkModal = ({ open, onClose, link }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    if (!link) return;
    navigator.clipboard
      .writeText(link)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {
        const ta = document.createElement('textarea');
        ta.value = link;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
  }, [link]);

  if (!open) return null;

  return (
    <ClientsModalOverlay onClick={onClose}>
      <ClientsModal onClick={(e) => e.stopPropagation()}>
        <ClientsModalTitle>Ссылка для клиента</ClientsModalTitle>
        <FooterCardDescription>
          Отправьте эту ссылку клиенту для добавления карты лояльности:
        </FooterCardDescription>

        <LinkContainer>
          <CustomInput type="text" value={link || ''} readOnly />
          <ClientsModalButtonSecondary onClick={handleCopy}>
            {copied ? 'Скопировано!' : 'Копировать'}
          </ClientsModalButtonSecondary>
        </LinkContainer>

        <ClientsModalActions>
          <ClientsModalButtonPrimary onClick={onClose}>Готово</ClientsModalButtonPrimary>
        </ClientsModalActions>
      </ClientsModal>
    </ClientsModalOverlay>
  );
};

export default ClientLinkModal;
