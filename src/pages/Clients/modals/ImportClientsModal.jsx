import React from 'react';

import { Download } from 'lucide-react';

import CustomMainButton from '../../../customs/CustomMainButton';
import {
  ClientsModal,
  ClientsModalActions,
  ClientsModalOverlay,
  ClientsModalTitle,
} from '../styles';

const ImportClientsModal = ({ onClose, handleExportToExcel }) => {
  return (
    <ClientsModalOverlay onClick={onClose}>
      <ClientsModal onClick={(e) => e.stopPropagation()}>
        <ClientsModalTitle>Импорт клиентов</ClientsModalTitle>
        <p style={{ marginBottom: 12 }}>Импортируйте клиентов в систему с помощью xlsx шаблона</p>
        <span className="scanner-icon">
          <Download size={18} />
        </span>
        <ClientsModalActions>
          <CustomMainButton
            onClick={() => window.open('/import_customers_template.xlsx', '_blank')}
          >
            Скачать шаблон импорта
          </CustomMainButton>
          <CustomMainButton onClick={handleExportToExcel}>Импортировать клиентов</CustomMainButton>
        </ClientsModalActions>
      </ClientsModal>
    </ClientsModalOverlay>
  );
};

export default ImportClientsModal;
