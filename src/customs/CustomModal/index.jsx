import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

import { X } from 'lucide-react';

import {
  Actions,
  CloseBtn,
  Content,
  Dialog,
  Header,
  Overlay,
  PrimaryButton,
  SecondaryButton,
  Title,
} from './styles';

const CustomModal = ({
  open,
  onClose,
  title,
  children,
  actions,
  maxWidth = 500,
  closeOnOverlayClick = true,
  'aria-label': ariaLabel,
}) => {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  const handleOverlayClick = () => {
    if (closeOnOverlayClick) onClose?.();
  };

  const modalContent = (
    <Overlay onClick={handleOverlayClick} aria-hidden>
      <Dialog
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel || (typeof title === 'string' ? title : 'Модальное окно')}
        style={{ maxWidth }}
        onClick={(e) => e.stopPropagation()}
      >
        <Header>
          {!!title && <Title>{title}</Title>}
          <CloseBtn aria-label="Закрыть" onClick={onClose}>
            <X size={18} />
          </CloseBtn>
        </Header>

        <Content>{children}</Content>

        {actions && <Actions>{actions}</Actions>}
      </Dialog>
    </Overlay>
  );

  return createPortal(modalContent, document.body);
};

CustomModal.PrimaryButton = PrimaryButton;
CustomModal.SecondaryButton = SecondaryButton;

export default CustomModal;
