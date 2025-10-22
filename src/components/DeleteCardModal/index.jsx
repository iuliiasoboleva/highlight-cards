import React from 'react';

import CustomModal from '../../customs/CustomModal';
import { CancelButton, DangerButton, Question, Subtitle } from './styles';

const DeleteCardModal = ({ open = true, cardName, onConfirm, onCancel }) => {
  return (
    <CustomModal
      open={open}
      onClose={onCancel}
      title="Удаление карты"
      actions={
        <>
          <DangerButton onClick={onConfirm}>Удалить</DangerButton>
          <CancelButton onClick={onCancel}>Отменить</CancelButton>
        </>
      }
    >
      <Subtitle>Карта будет удалена безвозвратно.</Subtitle>
      <Question>Удалить карту {cardName ? `«${cardName}»` : ''}?</Question>
    </CustomModal>
  );
};

export default DeleteCardModal;
