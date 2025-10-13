import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { Copy, Inbox, Trash2 } from 'lucide-react';

import axiosInstance from '../../axiosInstance';
import TitleWithHelp from '../../components/TitleWithHelp';
import {
  EmptyMessage,
  EmptyStub,
  PushHistoryControls,
  PushHistoryDates,
  PushHistoryIcon,
  PushHistoryItem,
  PushHistoryList,
  PushHistoryMessage,
  PushHistoryTop,
  PushHistoryWrapper,
} from './styles';

const PushHistory = () => {
  const [history, setHistory] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState('');
  const [recipientFilter, setRecipientFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');

  const currentCard = useSelector((state) => state.cards.currentCard);
  const user = useSelector((state) => state.user);

  const rawTz = useSelector((state) => state.user?.timezone || 'Europe/Moscow');
  const normalizeTz = (tz) => {
    if (!tz) return 'Europe/Moscow';
    const s = String(tz);
    if (s === 'Europe/Moscow') return s;
    try {
      // eslint-disable-next-line no-new
      new Intl.DateTimeFormat('ru-RU', { timeZone: s });
      return s;
    } catch {
      const lower = s.toLowerCase();
      if (lower.includes('moscow') || lower.includes('моск')) return 'Europe/Moscow';
      return 'Europe/Moscow';
    }
  };
  const tz = normalizeTz(rawTz);

  const fetchHistory = useCallback(async () => {
    if (!user.organization_id) return;
    try {
      const params = { 
        organization_id: user.organization_id,
        page,
        page_size: pageSize,
        sort_by: 'date_time',
        sort_order: sortOrder,
        mailing_type: 'Push'
      };
      if (currentCard?.id) params.card_id = currentCard.id;
      if (search) params.search = search;
      if (recipientFilter) params.recipient_filter = recipientFilter;
      
      const res = await axiosInstance.get('/mailings', { params });
      const data = res.data || {};
      const items = (Array.isArray(data.items) ? data.items : [])
        .map((m) => {
          try {
            const iso = m.dateTime || '';
            const fixed = iso.replace(/(\.\d{3})\d+/, '$1');
            const d = new Date(fixed);
            const parts = new Intl.DateTimeFormat('ru-RU', {
              timeZone: tz,
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
            })
              .formatToParts(d)
              .reduce((acc, p) => ({ ...acc, [p.type]: p.value }), {});
            return {
              ...m,
              dateTime: `${parts.day}-${parts.month}-${parts.year} ${parts.hour}:${parts.minute}`,
            };
          } catch {
            return m;
          }
        });
      setHistory(items);
      setTotal(data.total || 0);
      setTotalPages(data.total_pages || 0);
    } catch (e) {
      console.error(e);
    }
  }, [currentCard?.id, tz, user.organization_id, page, pageSize, search, recipientFilter, sortOrder]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const onDelete = async (id) => {
    try {
      await axiosInstance.delete(`/mailings/${id}`);
      fetchHistory();
    } catch (e) {
      console.error(e);
    }
  };

  const handleCopy = (message) => {
    navigator.clipboard.writeText(message || '');
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleRecipientFilterChange = (e) => {
    setRecipientFilter(e.target.value);
    setPage(1);
  };

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setPage(1);
  };

  const handleSortToggle = () => {
    setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'));
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <PushHistoryWrapper>
      <TitleWithHelp
        title="История отправки"
        tooltipId="history-help"
        tooltipHtml
        tooltipContent={`История отправки пуш-уведомлений`}
      />

      <div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Поиск по названию или тексту..."
            value={search}
            onChange={handleSearchChange}
            style={{
              flex: '1',
              minWidth: '200px',
              padding: '8px 12px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              fontSize: '14px'
            }}
          />
          <input
            type="text"
            placeholder="Фильтр по получателям..."
            value={recipientFilter}
            onChange={handleRecipientFilterChange}
            style={{
              flex: '1',
              minWidth: '200px',
              padding: '8px 12px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              fontSize: '14px'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '14px', color: '#666' }}>Показывать:</span>
            <select
              value={pageSize}
              onChange={handlePageSizeChange}
              style={{
                padding: '6px 10px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              <option value={10}>10</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={200}>200</option>
            </select>
          </div>

          <button
            onClick={handleSortToggle}
            style={{
              padding: '6px 12px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              fontSize: '14px',
              cursor: 'pointer',
              backgroundColor: '#fff'
            }}
          >
            Дата: {sortOrder === 'desc' ? '↓ Новые сверху' : '↑ Старые сверху'}
          </button>

          <span style={{ fontSize: '14px', color: '#666', marginLeft: 'auto' }}>
            Всего: {total}
          </span>
        </div>
      </div>

      <PushHistoryList>
        {history.length === 0 ? (
          <EmptyStub>
            <Inbox size={22} />
            <div>История пустая</div>
            <p>Отправьте первое push-уведомление — здесь появится запись.</p>
          </EmptyStub>
        ) : (
          history.map(({ id, dateTime, message, status }) => (
            <PushHistoryItem key={id}>
              <PushHistoryTop>
                <PushHistoryDates>{dateTime}</PushHistoryDates>

                <PushHistoryControls>
                  <span>{status}</span>
                  <PushHistoryIcon
                    onClick={() => handleCopy(message)}
                    title="Скопировать сообщение"
                  >
                    <Copy size={16} />
                  </PushHistoryIcon>
                  <PushHistoryIcon className="danger" onClick={() => onDelete(id)} title="Удалить">
                    <Trash2 size={16} />
                  </PushHistoryIcon>
                </PushHistoryControls>
              </PushHistoryTop>

              <PushHistoryMessage>
                {message?.trim() ? message : <EmptyMessage>Нет текста</EmptyMessage>}
              </PushHistoryMessage>
            </PushHistoryItem>
          ))
        )}
      </PushHistoryList>

      {totalPages > 1 && (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          gap: '8px',
          marginTop: '20px',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => handlePageChange(1)}
            disabled={page === 1}
            style={{
              padding: '6px 12px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              fontSize: '14px',
              cursor: page === 1 ? 'not-allowed' : 'pointer',
              backgroundColor: page === 1 ? '#f5f5f5' : '#fff',
              color: page === 1 ? '#999' : '#333'
            }}
          >
            « Первая
          </button>
          
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            style={{
              padding: '6px 12px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              fontSize: '14px',
              cursor: page === 1 ? 'not-allowed' : 'pointer',
              backgroundColor: page === 1 ? '#f5f5f5' : '#fff',
              color: page === 1 ? '#999' : '#333'
            }}
          >
            ‹ Назад
          </button>

          <div style={{ 
            display: 'flex', 
            gap: '4px',
            alignItems: 'center'
          }}>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (page <= 3) {
                pageNum = i + 1;
              } else if (page >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = page - 2 + i;
              }
              
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  style={{
                    padding: '6px 12px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '14px',
                    cursor: 'pointer',
                    backgroundColor: page === pageNum ? '#007bff' : '#fff',
                    color: page === pageNum ? '#fff' : '#333',
                    fontWeight: page === pageNum ? 'bold' : 'normal'
                  }}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
            style={{
              padding: '6px 12px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              fontSize: '14px',
              cursor: page === totalPages ? 'not-allowed' : 'pointer',
              backgroundColor: page === totalPages ? '#f5f5f5' : '#fff',
              color: page === totalPages ? '#999' : '#333'
            }}
          >
            Вперед ›
          </button>

          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={page === totalPages}
            style={{
              padding: '6px 12px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              fontSize: '14px',
              cursor: page === totalPages ? 'not-allowed' : 'pointer',
              backgroundColor: page === totalPages ? '#f5f5f5' : '#fff',
              color: page === totalPages ? '#999' : '#333'
            }}
          >
            Последняя »
          </button>

          <span style={{ 
            fontSize: '14px', 
            color: '#666',
            marginLeft: '12px'
          }}>
            Страница {page} из {totalPages}
          </span>
        </div>
      )}
    </PushHistoryWrapper>
  );
};

export default PushHistory;
