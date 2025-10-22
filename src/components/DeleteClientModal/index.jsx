import React from 'react';

import CustomModal from '../../customs/CustomModal';
import { CancelButton, DangerButton, Question, Subtitle } from './styles';

const DeleteClientModal = ({ open = true, clientName, onConfirm, onCancel }) => {
  return (
    <CustomModal
      open={open}
      onClose={onCancel}
      title="Удаление клиента"
      actions={
        <>
          <DangerButton onClick={onConfirm}>Удалить</DangerButton>
          <CancelButton onClick={onCancel}>Отменить</CancelButton>
        </>
      }
    >
      <Subtitle>Все данные клиента будут удалены безвозвратно.</Subtitle>
      <Question>Удалить клиента {clientName ? `«${clientName}»` : ''}?</Question>
    </CustomModal>
  );
};

export default DeleteClientModal;
