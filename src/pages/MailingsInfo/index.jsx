import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Tooltip } from 'react-tooltip';

// import { useNavigate } from 'react-router-dom';

import { HelpCircle, Loader2 } from 'lucide-react';

import axiosInstance from '../../axiosInstance';
import CustomTable from '../../components/CustomTable';
import TopUpModal from '../../components/TopUpModal';
import { mailingsHeaders } from '../../mocks/mockMailings';
import { fetchBalance, topUpBalance } from '../../store/balanceSlice';
import MailingDetailsModal from './MailingDetailsModal';

import './styles.css';

const MailingsInfo = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);

  const orgId = useSelector((state) => state.user.organization_id);
  const dispatch = useDispatch();

  const { amount: smsBalance = 0, loading: smsLoading } = useSelector(
    (state) => state.balance || {},
  );
  const [topUpOpen, setTopUpOpen] = useState(false);
  const [hoverSms, setHoverSms] = useState(false);
  // const navigate = useNavigate();

  useEffect(() => {
    if (!orgId) return;

    dispatch(fetchBalance(orgId));

    (async () => {
      try {
        const res = await axiosInstance.get('/mailings', { params: { organization_id: orgId } });
        setRows(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [orgId, dispatch]);

  const handleTopUpConfirm = (amount) => {
    setTopUpOpen(false);
    dispatch(topUpBalance({ orgId, amount }));
  };

  const columns = mailingsHeaders.map((header) => ({
    key: header.key,
    title: header.label,
    className: 'text-left',
    cellClassName: 'text-left',
  }));

  const statusColumnIndex = columns.findIndex((col) => col.key === 'status');
  const recipientsIdx = columns.findIndex((col) => col.key === 'recipients');

  if (statusColumnIndex !== -1) {
    columns[statusColumnIndex].render = (row) => {
      let statusClass = '';
      switch (row.status) {
        case 'Запланирована':
          statusClass = 'status-planned';
          break;
        case 'Отправлена':
          statusClass = 'status-sent';
          break;
        case 'Черновик':
          statusClass = 'status-draft';
          break;
        case 'Ошибка':
          statusClass = 'status-error';
          break;
        default:
          statusClass = '';
      }
      return <span className={`status-badge ${statusClass}`}>{row.status}</span>;
    };
    columns[statusColumnIndex].className = 'text-center';
    columns[statusColumnIndex].cellClassName = 'text-center';
  }

  if (recipientsIdx !== -1) {
    columns[recipientsIdx].render = (row) => {
      if (row.recipients === 'all') return 'Всем';
      return row.recipients;
    };
  }

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
    <div className="mailings-container">
      <h2>
        Рассылки
        <HelpCircle
          size={16}
          style={{ marginLeft: 6, cursor: 'pointer', outline: 'none' }}
          data-tooltip-id="mailings-help"
          data-tooltip-html=" Здесь вы управляете своими рассылками: создавайте, планируйте, отправляйте Push клиентам для
        повышения лояльности."
        />
      </h2>
      <Tooltip id="mailings-help" className="custom-tooltip" />
      <div className="stats-cards">
        {[
          { value: '0', label: 'Клиентов в базе' },
          { value: 'Бесплатно!', label: 'Push и Web-push', className: 'highlight' },
          { value: smsLoading ? '...' : smsBalance, label: 'Баланс SMS', clickable: true },
        ].map((card, index) => {
          const isSms = card.label === 'Баланс SMS';
          return (
            <div
              className="mailing-card"
              key={index}
              onMouseEnter={() => isSms && setHoverSms(true)}
              onMouseLeave={() => isSms && setHoverSms(false)}
              onClick={() => isSms && setTopUpOpen(true)}
              style={{ cursor: isSms ? 'pointer' : 'default' }}
            >
              <div className={`value ${card.className || ''}`}>
                {isSms && hoverSms ? 'Пополнить' : card.value}
              </div>
              {!isSms || !hoverSms ? (
                <div className={`label ${card.className?.includes('small') ? 'small' : ''}`}>
                  {card.label}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      {/* кнопка «Пополнить» больше не нужна — действие на карточке */}

      <div className="table-wrapper">
        <CustomTable
          columns={columns}
          rows={rows}
          emptyText="Здесь будут ваши рассылки"
          onRowClick={(row) => setSelectedId(row.id)}
        />
      </div>

      <MailingDetailsModal
        isOpen={!!selectedId}
        mailingId={selectedId}
        onClose={() => setSelectedId(null)}
      />

      <TopUpModal
        isOpen={topUpOpen}
        onClose={() => setTopUpOpen(false)}
        onConfirm={handleTopUpConfirm}
      />
    </div>
  );
};

export default MailingsInfo;
