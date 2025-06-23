import React from 'react';

const ConfirmModal = ({
  isOpen,
  message,
  confirmText = 'Да',
  cancelText = 'Отмена',
  onConfirm,
  onCancel,
  small = false,
}) => {
  if (!isOpen) return null;

  const modalStyle = small ? { width: '28%', maxWidth: 500 } : {};

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <p style={{ marginBottom: 20, fontSize: 16 }}>{message}</p>
        <div className="modal-buttons">
          <button className="btn btn-dark" onClick={onConfirm}>
            {confirmText}
          </button>
          <button className="btn-light" onClick={onCancel}>
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
