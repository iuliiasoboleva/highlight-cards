import React from 'react';

import CustomModal from '../../customs/CustomModal';

const DeleteClientModal = ({ fullName, onConfirm, onCancel }) => {
  return (
    <CustomModal
      open
      onClose={onCancel}
      title="Удаление клиента"
      maxWidth={480}
      closeOnOverlayClick={false}
      actions={
        <>
          <CustomModal.SecondaryButton onClick={onCancel}>Отменить</CustomModal.SecondaryButton>
          <CustomModal.PrimaryButton onClick={onConfirm}>Удалить</CustomModal.PrimaryButton>
        </>
      }
    >
      <p style={{ margin: '12px 0', fontWeight: 500 }}>Информация будет удалена безвозвратно</p>
      <p style={{ margin: '16px 0 0' }}>Удалить клиента {fullName}?</p>
    </CustomModal>
  );
};

export default DeleteClientModal;
