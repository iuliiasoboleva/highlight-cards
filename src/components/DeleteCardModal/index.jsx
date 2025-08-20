import React from 'react';

import CustomModal from '../../customs/CustomModal';
import { DangerButton, Question, Subtitle } from './styles';

const DeleteCardModal = ({ open = true, cardName, onConfirm, onCancel }) => {
  return (
    <CustomModal
      open={open}
      onClose={onCancel}
      title="Удаление карты"
      actions={
        <>
          <DangerButton onClick={onConfirm}>Удалить</DangerButton>
          <CustomModal.SecondaryButton onClick={onCancel}>Отменить</CustomModal.SecondaryButton>
        </>
      }
    >
      <Subtitle>Карта будет удалена безвозвратно.</Subtitle>
      <Question>Удалить карту {cardName ? `«${cardName}»` : ''}?</Question>
    </CustomModal>
  );
};

export default DeleteCardModal;
