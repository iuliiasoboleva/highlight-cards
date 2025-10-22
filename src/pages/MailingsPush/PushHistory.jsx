import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Copy, Inbox, Trash2 } from 'lucide-react';

import axiosInstance from '../../axiosInstance';
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
  const [recipientFilter, setRecipientFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [mailingToDelete, setMailingToDelete] = useState(null);

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
      // Не фильтруем по card_id - показываем все рассылки организации
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
  }, [tz, user.organization_id, page, pageSize, search, recipientFilter, sortOrder]);

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
      // Получаем полную информацию о рассылке
      const response = await axiosInstance.get(`/mailings/${mailingItem.id}`);
      const mailingData = response.data;

      console.log('🔍 Поиск карты для рассылки:', {
        searchCardId: mailingData.cardId,
        searchCardIdType: typeof mailingData.cardId,
        totalCardsInStore: cards.length,
        availableCardsInStore: cards.map(c => ({
          id: c.id,
          name: c.name,
          title: c.title
        }))
      });

      // Сначала пробуем найти карту в store
      let card = cards.find((c) => {
        return (
          c.id === mailingData.cardId ||
          c.uuid === mailingData.cardId ||
          String(c.id) === String(mailingData.cardId) || 
          String(c.uuid) === String(mailingData.cardId) ||
          Number(c.id) === Number(mailingData.cardId) ||
          parseInt(c.id) === parseInt(mailingData.cardId)
        );
      });

      // Если карта не найдена в store, запрашиваем напрямую из API
      if (!card) {
        console.warn('⚠️ Карта не найдена в store, запрашиваем из API...');
        try {
          const cardResponse = await axiosInstance.get(`/cards/${mailingData.cardId}`);
          card = cardResponse.data;
          console.log('✅ Карта загружена из API:', card);
        } catch (apiError) {
          console.error('❌ Карта не найдена ни в store, ни в API:', mailingData.cardId);
          toast.error(`Карта не найдена (ID: ${mailingData.cardId}). Возможно, она была удалена.`);
          return;
        }
      } else {
        console.log('✅ Карта найдена в store:', card.name || card.title);
      }
      
      // Устанавливаем выбранную карту и заполняем данные
      dispatch(setCurrentCard({
        ...card,
        pushNotification: {
          message: mailingData.message || '',
          scheduledDate: '',
        }
      }));
      
      toast.success('Параметры рассылки скопированы');
      
      // Переходим на страницу создания push-рассылки
      setTimeout(() => navigate(`/mailings/push`), 300);
    } catch (e) {
      console.error('❌ Ошибка при копировании рассылки:', e);
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
              fontSize: '14px'
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
              cursor: 'pointer'
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

          <span style={{ fontSize: '14px', color: '#666' }}>
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
                  <PushHistoryIcon className="danger" onClick={() => openDeleteModal(item.id)} title="Удалить">
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
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'space-between', flexDirection: 'column' }}>
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
