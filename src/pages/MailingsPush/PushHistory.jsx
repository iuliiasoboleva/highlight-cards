import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Copy, Inbox, Trash2 } from 'lucide-react';

import axiosInstance from '../../axiosInstance';
import Pagination from '../../components/Pagination';
import TitleWithHelp from '../../components/TitleWithHelp';
import { useToast } from '../../components/Toast';
import { fetchCards, setCurrentCard } from '../../store/cardsSlice';
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
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [recipientFilter, setRecipientFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [mailingToDelete, setMailingToDelete] = useState(null);
  const [fetching, setFetching] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const allCards = useSelector((state) => state.cards.cards);
  // Фильтруем карты, исключая служебную карту 'fixed'
  const cards = allCards.filter((card) => card.id !== 'fixed');
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

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const fetchHistory = useCallback(async () => {
    if (!user.organization_id) return;
    try {
      setFetching(true);
      const params = {
        organization_id: user.organization_id,
        page,
        page_size: pageSize,
        sort_by: 'date_time',
        sort_order: sortOrder,
        mailing_type: 'Push',
      };
      if (debouncedSearch) params.search = debouncedSearch;
      if (recipientFilter) params.recipient_filter = recipientFilter;

      const res = await axiosInstance.get('/mailings', { params });
      const data = res.data || {};
      const items = (Array.isArray(data.items) ? data.items : []).map((m) => {
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
    } finally {
      setFetching(false);
    }
  }, [tz, user.organization_id, page, pageSize, debouncedSearch, recipientFilter, sortOrder]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  useEffect(() => {
    // Загружаем карты при монтировании, если их нет
    if (!allCards || allCards.length === 0) {
      dispatch(fetchCards());
    }
  }, [dispatch, allCards]);

  const onDelete = async () => {
    if (!mailingToDelete) return;
    try {
      await axiosInstance.delete(`/mailings/${mailingToDelete}`);
      setDeleteModalOpen(false);
      setMailingToDelete(null);
      toast.success('Рассылка успешно удалена');
      fetchHistory();
    } catch (e) {
      console.error(e);
      toast.error('Ошибка при удалении рассылки');
      setDeleteModalOpen(false);
      setMailingToDelete(null);
    }
  };

  const handleCopy = async (mailingItem) => {
    try {
      let card = cards.find((c) => {
        return (
          c.id === mailingItem.cardId ||
          c.uuid === mailingItem.cardId ||
          String(c.id) === String(mailingItem.cardId) ||
          String(c.uuid) === String(mailingItem.cardId)
        );
      });

      if (!card) {
        try {
          const cardResponse = await axiosInstance.get(`/cards/${mailingItem.cardId}`);
          card = cardResponse.data;
        } catch (apiError) {
          toast.error(`Карта не найдена (ID: ${mailingItem.cardId}). Возможно, она была удалена.`);
          return;
        }
      }

      dispatch(
        setCurrentCard({
          ...card,
          pushNotification: {
            message: mailingItem.message || '',
            scheduledDate: '',
          },
        }),
      );

      toast.success('Параметры рассылки скопированы');
      setTimeout(() => navigate(`/mailings/push`), 300);
    } catch (e) {
      toast.error('Ошибка при копировании рассылки');
    }
  };

  const openDeleteModal = (id) => {
    setMailingToDelete(id);
    setDeleteModalOpen(true);
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
              fontSize: '14px',
            }}
          />
          <select
            value={recipientFilter}
            onChange={handleRecipientFilterChange}
            style={{
              flex: '1',
              minWidth: '200px',
              padding: '8px 12px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              fontSize: '14px',
              cursor: 'pointer',
            }}
          >
            <option value="">Всем</option>
            <option value="need-attention">Требуют внимания</option>
            <option value="loyal-regulars">Лояльные - постоянные</option>
            <option value="champions">Чемпионы</option>
            <option value="at-risk">В зоне риска</option>
            <option value="borderline">Средние (на грани)</option>
            <option value="growing">Растущие</option>
          </select>
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
                cursor: 'pointer',
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
              backgroundColor: '#fff',
            }}
          >
            Дата: {sortOrder === 'desc' ? '↓ Новые сверху' : '↑ Старые сверху'}
          </button>

          <span style={{ fontSize: '14px', color: '#666' }}>Всего: {total}</span>
        </div>
      </div>

      <div style={{ position: 'relative', minHeight: '300px' }}>
        {fetching && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(255, 255, 255, 0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10,
            }}
          >
            <div style={{ fontSize: '14px', color: '#666' }}>Загрузка...</div>
          </div>
        )}
        <PushHistoryList>
          {history.length === 0 ? (
            <EmptyStub>
              <Inbox size={22} />
              <div>История пустая</div>
              <p>Отправьте первое push-уведомление — здесь появится запись.</p>
            </EmptyStub>
          ) : (
            history.map((item) => (
              <PushHistoryItem key={item.id}>
                <PushHistoryTop>
                  <PushHistoryDates>{item.dateTime}</PushHistoryDates>

                  <PushHistoryControls>
                    <span>{item.status}</span>
                    <PushHistoryIcon
                      onClick={() => handleCopy(item)}
                      title="Создать рассылку с этими параметрами"
                    >
                      <Copy size={16} />
                    </PushHistoryIcon>
                    <PushHistoryIcon
                      className="danger"
                      onClick={() => openDeleteModal(item.id)}
                      title="Удалить"
                    >
                      <Trash2 size={16} />
                    </PushHistoryIcon>
                  </PushHistoryControls>
                </PushHistoryTop>

                <PushHistoryMessage>
                  {item.message?.trim() ? item.message : <EmptyMessage>Нет текста</EmptyMessage>}
                </PushHistoryMessage>
              </PushHistoryItem>
            ))
          )}
        </PushHistoryList>
      </div>

      <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />

      {/* Модалка подтверждения удаления */}
      {deleteModalOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
          }}
          onClick={() => {
            setDeleteModalOpen(false);
            setMailingToDelete(null);
          }}
        >
          <div
            style={{
              backgroundColor: '#fff',
              borderRadius: '12px',
              padding: '24px',
              maxWidth: '400px',
              width: '90%',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: '0 0 12px 0', fontSize: '18px', fontWeight: 600 }}>
              Удалить рассылку?
            </h3>
            <p style={{ margin: '0 0 24px 0', color: '#666', fontSize: '14px' }}>
              История рассылки будет удалена безвозвратно
            </p>
            <div
              style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'space-between',
                flexDirection: 'column',
              }}
            >
              <button
                onClick={onDelete}
                style={{
                  width: '100%',
                  padding: '10px 16px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  backgroundColor: '#f5f5f5',
                  color: '#2c3e50',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = '#e5e5e5')}
                onMouseLeave={(e) => (e.target.style.backgroundColor = '#f5f5f5')}
              >
                Удалить
              </button>
              <button
                onClick={() => {
                  setDeleteModalOpen(false);
                  setMailingToDelete(null);
                }}
                style={{
                  width: '100%',
                  padding: '10px 16px',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  backgroundColor: '#bf4756',
                  color: '#fff',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = '#a63d49')}
                onMouseLeave={(e) => (e.target.style.backgroundColor = '#bf4756')}
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </PushHistoryWrapper>
  );
};

export default PushHistory;
