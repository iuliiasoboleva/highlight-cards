import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

import CustomTable from '../../components/CustomTable';
import { mockClientStats, mockClientsHeaders } from '../../mocks/clientsInfo';
import { addClient } from '../../store/clientsSlice';

import './styles.css';

const Clients = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [generatedLink, setGeneratedLink] = useState('');
  const [newClient, setNewClient] = useState({
    surname: '',
    name: '',
    phone: '',
    email: '',
    birthday: '',
  });
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard
      .writeText(generatedLink)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch((err) => {
        console.error('Ошибка копирования: ', err);
        const textArea = document.createElement('textarea');
        textArea.value = generatedLink;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      });
  };

  const clients = useSelector((state) => state.clients);

  const columns = [
    ...mockClientsHeaders.map((header) => ({
      key: header.key,
      title: header.label,
      className: 'text-left',
      cellClassName: 'text-left',
    })),
    {
      key: 'actions',
      title: 'Действия',
      render: (row) => (
        <a className="copy-link-button" onClick={() => generateClientLink(row.id)}>
          Получить ссылку
        </a>
      ),
    },
  ];

  const generateClientLink = (clientId) => {
    const link = '/example';
    setGeneratedLink(link);
    setShowLinkModal(true);
  };

  const handleAddClient = () => {
    const clientId = Date.now();
    dispatch(
      addClient({
        ...newClient,
        id: clientId,
        createdAt: new Date().toLocaleString(),
      }),
    );
    generateClientLink(clientId);
    setShowModal(false);
    setNewClient({ surname: '', name: '', phone: '', email: '', birthday: '' });
  };

  const handleExportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(clients);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Клиенты');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(data, 'clients.xlsx');
  };

  return (
    <div className="clients-container">
      <h2 className="page-title">Клиентская база</h2>
      <p className="page-subtitle">
        Здесь вы управляете своей клиентской базой: добавляете новых клиентов, импортируете
        существующих и отправляете push-уведомления
      </p>

      <div className="clients-stats-grid">
        <div className="clients-stat-card">
          <span className="stat-clients-value">{clients.length}</span>
          <span className="stat-clients-label">Клиентов в базе</span>
        </div>
        <div className="clients-stat-card">
          <span className="stat-clients-value">{mockClientStats.transactions}</span>
          <span className="stat-clients-label">Транзакций по картам</span>
        </div>
        <div className="clients-stat-card">
          <span className="stat-clients-value">{mockClientStats.cardsIssued}</span>
          <span className="stat-clients-label">Карт установлено</span>
        </div>
        <div className="clients-stat-card clients-tooltip-wrapper">
          <span className="stat-clients-value">{mockClientStats.returnRate}%</span>
          <span className="stat-clients-label">Возвращаемость</span>
          <div className="clients-tooltip">
            Процент клиентов, которые вернулись к вам хотя бы один раз.
          </div>
        </div>
      </div>

      <div className="clients-actions-bar">
        <button className="clients-add-button" onClick={() => setShowModal(true)}>
          + Добавить клиента
        </button>
      </div>

      <div className="table-wrapper">
        <CustomTable columns={columns} rows={clients} />
      </div>

      {showModal && (
        <div className="clients-modal-overlay">
          <div className="clients-modal">
            <h3 className="clients-modal-title">Добавить клиента</h3>
            <div className="clients-modal-form-group">
              <input
                className="clients-modal-input"
                placeholder="Фамилия"
                type="text"
                value={newClient.surname}
                onChange={(e) => setNewClient({ ...newClient, surname: e.target.value })}
              />
            </div>
            <div className="clients-modal-form-group">
              <input
                className="clients-modal-input"
                placeholder="Имя"
                type="text"
                value={newClient.name}
                onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
              />
            </div>
            <div className="clients-modal-form-group">
              <input
                className="clients-modal-input"
                placeholder="Телефон"
                type="number"
                value={newClient.phone}
                onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
              />
            </div>
            <div className="clients-modal-form-group">
              <input
                className="clients-modal-input"
                placeholder="Email"
                type="email"
                value={newClient.email}
                onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
              />
            </div>
            <div className="clients-modal-form-group">
              <input
                className="clients-modal-input"
                type="date"
                value={newClient.birthday}
                onChange={(e) => setNewClient({ ...newClient, birthday: e.target.value })}
              />
            </div>
            <div className="clients-modal-actions">
              <button
                className="clients-modal-button clients-modal-button-primary"
                onClick={handleAddClient}
              >
                Добавить клиента
              </button>
              <button
                className="clients-modal-button clients-modal-button-secondary"
                onClick={() => setShowModal(false)}
              >
                Отменить
              </button>
            </div>
          </div>
        </div>
      )}

      {showLinkModal && (
        <div className="clients-modal-overlay">
          <div className="clients-modal">
            <h3 className="clients-modal-title">Ссылка для клиента</h3>
            <p className="clients-modal-description">
              Отправьте эту ссылку клиенту для добавления карты лояльности:
            </p>

            <div className="link-container">
              <input type="text" value={generatedLink} readOnly className="push-input" />
              <button onClick={handleCopy} className={`btn-light ${isCopied ? 'copied' : ''}`}>
                {isCopied ? 'Скопировано!' : 'Копировать'}
              </button>
            </div>
            <div className="clients-modal-actions">
              <button
                className="clients-modal-button clients-modal-button-primary"
                onClick={() => setShowLinkModal(false)}
              >
                Готово
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="clients-footer-grid">
        <div className="footer-card">
          <h4 className="footer-card-title">Импорт клиентов</h4>
          <p className="footer-card-description">
            Импортируйте клиентов в систему с помощью xlsx шаблона
          </p>
          <div className="footer-card-actions">
            <button className="footer-button" onClick={handleExportToExcel}>
              Импортировать клиентов
            </button>
          </div>
        </div>
        <div className="footer-card">
          <h4 className="footer-card-title">Рассылка push</h4>
          <p className="footer-card-description">Отправляйте своим клиентам push-уведомления</p>
          <button className="footer-button" onClick={() => navigate('/mailings/push')}>
            Создать рассылку
          </button>
        </div>
      </div>
    </div>
  );
};

export default Clients;
