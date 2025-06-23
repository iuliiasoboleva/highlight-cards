import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';

import { saveAs } from 'file-saver';
import { Download, HelpCircle, Loader2, PlusCircle, Send } from 'lucide-react';
import * as XLSX from 'xlsx';

import FilterableTable from '../../components/FilterableTable';
import { mockClientsHeaders } from '../../mocks/clientsInfo';
import { addClientLocal, createClient, fetchClients } from '../../store/clientsSlice';
import CustomSelect from '../../components/CustomSelect';

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
  const [selectedBranches, setSelectedBranches] = useState([]);
  const [selectedNetwork, setSelectedNetwork] = useState(null);
  const [mode, setMode] = useState('branches'); // 'branches' | 'network'
  const [isCopied, setIsCopied] = useState(false);

  const { list: clients, loading } = useSelector((state) => state.clients);
  const orgId = useSelector((state) => state.user.organization_id);
  const branches = useSelector((state) => state.locations.list);
  const networks = useSelector((state) => state.networks.list);

  const formatPhone = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (!digits) return '';

    const parts = [
      '+7',
      digits.slice(1, 4),
      digits.slice(4, 7),
      digits.slice(7, 9),
      digits.slice(9, 11),
    ];

    let formatted = `${parts[0]}`;
    if (parts[1]) formatted += `(${parts[1]}`;
    if (digits.length > 3) formatted += ')';
    if (parts[2]) formatted += `-${parts[2]}`;
    if (parts[3]) formatted += `-${parts[3]}`;
    if (parts[4]) formatted += `-${parts[4]}`;

    return formatted;
  };

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

  const columns = [
    ...mockClientsHeaders.map((header) => ({
      key: header.key,
      title: header.label,
      className: 'text-center',
      cellClassName: 'text-center',
    })),
  ];

  const generateClientLink = (clientId) => {
    const link = '/example';
    setGeneratedLink(link);
    setShowLinkModal(true);
  };

  const phoneDigits = newClient.phone.replace(/\D/g, '');
  const isEmailValid = newClient.email ? /^\S+@\S+\.\S+$/.test(newClient.email) : false;

  const handleAddClient = () => {
    const payload = {
      ...newClient,
      phone: phoneDigits,
      organization_id: orgId,
      branch_ids: mode === 'branches' ? selectedBranches : undefined,
      network_id: mode === 'network' ? selectedNetwork : undefined,
    };
    dispatch(createClient(payload))
      .unwrap()
      .then((res) => {
        generateClientLink(res.id);
        dispatch(fetchClients());
      });
    setShowModal(false);
    setNewClient({ surname: '', name: '', phone: '', email: '', birthday: '' });
    setSelectedBranches([]);
    setSelectedNetwork(null);
  };

  const handleExportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(clients);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Клиенты');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(data, 'clients.xlsx');
  };

  useEffect(() => {
    dispatch(fetchClients());
  }, [dispatch]);

  const totalClients = clients.length;
  const transactions = 0; // пока нет API
  const cardsIssued = 0;
  const returnRate = 0;

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 'calc(100vh - 200px)',
        }}
      >
        <Loader2 className="spinner" size={48} strokeWidth={1.4} />
      </div>
    );
  }

  return (
    <div className="clients-container">
      <h2>
        Клиентская база
        <HelpCircle
          size={16}
          style={{ marginLeft: 6, cursor: 'pointer', outline: 'none' }}
          data-tooltip-id="clients-help"
          data-tooltip-html=" Здесь вы управляете своей клиентской базой: добавляете новых клиентов, импортируете
        существующих и отправляете push-уведомления"
        />
      </h2>
      <Tooltip id="clients-help" className="custom-tooltip" />
      <div className="clients-stats-grid">
        <div className="clients-stat-card">
          <span className="stat-clients-value">{totalClients}</span>
          <span className="stat-clients-label">Клиентов в базе</span>
        </div>
        <div className="clients-stat-card">
          <span className="stat-clients-value">{transactions}</span>
          <span className="stat-clients-label">Транзакций по картам</span>
        </div>
        <div className="clients-stat-card">
          <span className="stat-clients-value">{cardsIssued}</span>
          <span className="stat-clients-label">Карт установлено</span>
        </div>
        <div className="clients-stat-card clients-tooltip-wrapper">
          <span className="stat-clients-value">{returnRate}%</span>
          <span className="stat-clients-label">Возвращаемость</span>
          <div className="clients-tooltip">
            Процент клиентов, которые вернулись к вам хотя бы один раз.
          </div>
        </div>
      </div>

      <div className="clients-actions-bar">
        <button className="custom-main-button" onClick={() => setShowModal(true)}>
          <span>+</span>Добавить клиента
        </button>
      </div>

      {clients.length === 0 ? (
        <div style={{ marginTop: 40, textAlign: 'center', color: '#666' }}>
          Здесь будут отображены клиенты
        </div>
      ) : (
        <div className="table-wrapper">
          <FilterableTable
            columns={columns}
            rows={clients}
            onRowClick={(row) => navigate(`/clients/${row.id}`)}
            onShowModal={() => setShowModal(true)}
          />
        </div>
      )}

      {showModal && (
        <div className="clients-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="clients-modal" onClick={(e) => e.stopPropagation()}>
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
                type="tel"
                value={newClient.phone}
                onChange={(e) => {
                  const formatted = formatPhone(e.target.value);
                  setNewClient({ ...newClient, phone: formatted });
                }}
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
              <label style={{ fontSize: 12, marginBottom: 4, display: 'block' }}>
                Дата рождения
              </label>
              <input
                className="clients-modal-input"
                type="date"
                value={newClient.birthday}
                onChange={(e) => setNewClient({ ...newClient, birthday: e.target.value })}
              />
            </div>
            <div className="clients-modal-form-group" style={{ display: 'flex', gap: 20 }}>
              <label>
                <input
                  type="radio"
                  name="mode"
                  checked={mode === 'branches'}
                  onChange={() => {
                    setMode('branches');
                    setSelectedNetwork(null);
                  }}
                />{' '}
                По точкам
              </label>
              <label>
                <input
                  type="radio"
                  name="mode"
                  checked={mode === 'network'}
                  onChange={() => {
                    setMode('network');
                    setSelectedBranches([]);
                  }}
                />{' '}
                По сети
              </label>
            </div>
            {mode === 'branches' && (
              <div className="clients-modal-form-group">
                <label style={{ fontSize: 12, marginBottom: 4, display: 'block' }}>
                  Точки продаж
                </label>
                <div style={{ maxHeight: 180, overflowY: 'auto', border: '1px solid #ccc', borderRadius: 4, padding: 6 }}>
                  {branches.map((br) => (
                    <label key={br.id} style={{ display: 'block', marginBottom: 4 }}>
                      <input
                        type="checkbox"
                        checked={selectedBranches.includes(br.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedBranches([...selectedBranches, br.id]);
                          } else {
                            setSelectedBranches(selectedBranches.filter((id) => id !== br.id));
                          }
                        }}
                      />{' '}
                      {br.name}
                    </label>
                  ))}
                  {branches.length === 0 && <p style={{ fontSize: 14 }}>Нет доступных точек.</p>}
                </div>
              </div>
            )}
            {mode === 'network' && (
              <div className="clients-modal-form-group">
                <label style={{ fontSize: 12, marginBottom: 4, display: 'block' }}>Сеть</label>
                <CustomSelect
                  value={selectedNetwork}
                  onChange={(val) => {
                    setSelectedNetwork(val);
                  }}
                  options={networks.map((n) => ({ value: n.id, label: n.name }))}
                  placeholder="Выберите сеть"
                />
              </div>
            )}
            <div className="clients-modal-actions">
              <button
                className="clients-modal-button clients-modal-button-primary"
                onClick={handleAddClient}
                disabled={
                  !(
                    newClient.name &&
                    newClient.surname &&
                    phoneDigits.length === 11 &&
                    isEmailValid &&
                    newClient.birthday &&
                    !(
                      (mode === 'branches' && selectedBranches.length === 0) ||
                      (mode === 'network' && selectedNetwork === null)
                    )
                  )
                }
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
        <div className="clients-modal-overlay" onClick={() => setShowLinkModal(false)}>
          <div className="clients-modal" onClick={(e) => e.stopPropagation()}>
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
        {/* НЕ УДАЛЯТЬ! ЭТО БУДЕТ ИСПОЛЬЗОВАНО ПОЗЖЕ */}

        {/* <div className="manager-card">
          <h4 className="footer-card-title">Импорт клиентов</h4>
          <p className="footer-card-description">
            Импортируйте клиентов в систему с помощью xlsx шаблона
          </p>
          <span className="scanner-icon">
            <Download size={18} />
          </span>
          <div className="footer-card-actions">
            <button
              className="custom-main-button"
              onClick={() => window.open('/import_customers_template.xlsx', '_blank')}
            >
              Скачать шаблон импорта
            </button>
            <button className="custom-main-button" onClick={handleExportToExcel}>
              Импортировать клиентов
            </button>
          </div>
        </div> */}
        <div className="manager-card" style={{ width: '35%' }}>
          <h4 className="footer-card-title">Рассылка push</h4>
          <p className="footer-card-description">Отправляйте своим клиентам push-уведомления</p>
          <span className="scanner-icon">
            <Send size={18} />
          </span>
          <button className="custom-main-button" onClick={() => navigate('/mailings/push')}>
            Создать рассылку
          </button>
        </div>
      </div>
    </div>
  );
};

export default Clients;
