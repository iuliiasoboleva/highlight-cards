import React from 'react';

import { Download } from 'lucide-react';

import CustomModal from '../../../customs/CustomModal';
import { GhostButton, Hint, IconWrap, Row } from '../styles';

const ImportClientsModal = ({ open, onClose, handleExportToExcel }) => {
  if (!open) return null;

  const handleDownloadTemplate = () => window.open('/import_customers_template.xlsx', '_blank');

  return (
    <CustomModal
      open={open}
      onClose={onClose}
      title="Импорт клиентов"
      actions={
        <>
          <CustomModal.PrimaryButton onClick={handleExportToExcel}>
            Импортировать клиентов
          </CustomModal.PrimaryButton>
          <CustomModal.SecondaryButton onClick={onClose}>Закрыть</CustomModal.SecondaryButton>
        </>
      }
    >
      <Hint>Импортируйте клиентов в систему с помощью xlsx шаблона.</Hint>

      <Row>
        <IconWrap>
          <Download size={18} />
        </IconWrap>
        <GhostButton onClick={handleDownloadTemplate}>Скачать шаблон импорта</GhostButton>
      </Row>
    </CustomModal>
  );
};

export default ImportClientsModal;
