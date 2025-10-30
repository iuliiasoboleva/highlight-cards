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
          <CustomModal.SecondaryButton
            onClick={onConfirm}
            style={{ background: '#f5f5f5', color: '#2c3e50' }}
          >
            Удалить
          </CustomModal.SecondaryButton>
          <CustomModal.PrimaryButton
            onClick={onCancel}
            style={{ background: '#bf4756' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#a63d49';
              e.currentTarget.style.color = '#fff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#bf4756';
              e.currentTarget.style.color = '';
            }}
          >
            Отменить
          </CustomModal.PrimaryButton>
        </>
      }
    >
      <p style={{ margin: '12px 0', fontWeight: 500 }}>Информация будет удалена безвозвратно</p>
      <p style={{ margin: '16px 0 0' }}>Удалить клиента {fullName}?</p>
    </CustomModal>
  );
};

export default DeleteClientModal;
