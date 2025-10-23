import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import axiosInstance from '../../axiosInstance';
import CustomTable from '../../components/CustomTable';
import LoaderCentered from '../../components/LoaderCentered';
import Pagination from '../../components/Pagination';
import TitleWithHelp from '../../components/TitleWithHelp';
// import TopUpModal from '../../components/TopUpModal';
import { mailingsHeaders } from '../../mocks/mockMailings';
import { fetchBalance } from '../../store/balanceSlice';
import MailingDetailsModal from './MailingDetailsModal';
import { Badge, Container, Label, StatCard, StatsRow, TableWrapper, Value } from './styles';

const MailingsInfo = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState('');
  const [recipientFilter, setRecipientFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');

  const orgId = useSelector((state) => state.user.organization_id);
  const dispatch = useDispatch();
  const allCards = useSelector((state) => state.cards?.cards || []);
  const { amount: smsBalance = 0, loading: smsLoading } = useSelector(
    (state) => state.balance || {},
  );

  // const [topUpOpen, setTopUpOpen] = useState(false);
  // const [hoverSms, setHoverSms] = useState(false);

  useEffect(() => {
    if (!orgId) return;

    dispatch(fetchBalance(orgId));

    (async () => {
      try {
        const params = {
          organization_id: orgId,
          page,
          page_size: pageSize,
          sort_by: 'date_time',
          sort_order: sortOrder
        };
        if (search) params.search = search;
        if (recipientFilter) params.recipient_filter = recipientFilter;
        
        const res = await axiosInstance.get('/mailings', { params });
        setRows(res.data?.items || []);
        setTotal(res.data?.total || 0);
        setTotalPages(res.data?.total_pages || 0);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [orgId, dispatch, page, pageSize, search, recipientFilter, sortOrder]);

  // const handleTopUpConfirm = (amount) => {
  //   setTopUpOpen(false);
  //   dispatch(topUpBalance({ orgId, amount }));
  // };

  // колонки таблицы
  const columns = mailingsHeaders.map((header) => ({
    key: header.key,
    title: header.label,
    className: 'text-left',
    cellClassName: 'text-left',
  }));

  const nameIdx = columns.findIndex((col) => col.key === 'name');
  if (nameIdx !== -1) {
    columns[nameIdx].render = (row) => {
      const segment = /^Сегмент:\s*(.+)$/i.exec(row?.name || '');
      const card = allCards.find((c) => String(c.id) === String(row?.cardId));
      const cardName = card?.name || card?.title;
      if (row?.mailingType?.toLowerCase() === 'push' && (cardName || segment)) {
        return `Push по карте ${cardName || ''}`.trim();
      }
      return row.name;
    };
  }

  // отрисовка статуса как бэйджа
  const statusIdx = columns.findIndex((col) => col.key === 'status');
  if (statusIdx !== -1) {
    columns[statusIdx].render = (row) => {
      const map = {
        Запланирована: 'planned',
        Отправлена: 'sent',
        Черновик: 'draft',
        Ошибка: 'error',
      };
      const variant = map[row.status] || 'draft';
      return <Badge $variant={variant}>{row.status}</Badge>;
    };
    columns[statusIdx].className = 'text-center';
    columns[statusIdx].cellClassName = 'text-center';
  }

  // человекочитаемые получатели
  const recipientsIdx = columns.findIndex((col) => col.key === 'recipients');
  if (recipientsIdx !== -1) {
    columns[recipientsIdx].render = (row) => {
      const segment = /^Сегмент:\s*(.+)$/i.exec(row?.name || '');
      if (segment && segment[1]) return `Сегмент: ${segment[1].trim()}`;
      if (row.recipients === 'all') return 'Всем';
      const rec = (row.recipients || '').trim();
      return rec ? `Сегмент: ${rec}` : '—';
    };
  }

  // усечённый текст пуша в списке
  const msgIdx = columns.findIndex((col) => col.key === 'message');
  if (msgIdx !== -1) {
    columns[msgIdx].render = (row) => {
      const t = (row.message || '').trim();
      if (!t) return '—';
      const max = 40;
      return t.length > max ? `${t.slice(0, max)}…` : t;
    };
  }

  // формат даты по местному часовому поясу пользователя в формате ДЕНЬ-МЕСЯЦ-ГОД ЧАС:МИНУТА
  const rawTz = useSelector((state) => state.user?.timezone || 'Europe/Moscow');
  const normalizeTz = (tz) => {
    if (!tz) return 'Europe/Moscow';
    const s = String(tz);
    if (s === 'Europe/Moscow') return s;
    try {
      // проверка валидности зоны
      // eslint-disable-next-line no-new
      new Intl.DateTimeFormat('ru-RU', { timeZone: s });
      return s;
    } catch (e) {
      const lower = s.toLowerCase();
      if (lower.includes('moscow') || lower.includes('моск')) return 'Europe/Moscow';
      return 'Europe/Moscow';
    }
  };
  const tz = normalizeTz(rawTz);
  const dateIdx = columns.findIndex((col) => col.key === 'dateTime');
  if (dateIdx !== -1) {
    columns[dateIdx].render = (row) => {
      try {
        const iso = row.dateTime || '';
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
        return `${parts.day}-${parts.month}-${parts.year} ${parts.hour}:${parts.minute}`;
      } catch (e) {
        return row.dateTime;
      }
    };
    columns[dateIdx].className = 'text-center';
    columns[dateIdx].cellClassName = 'text-center';
  }

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

  if (loading) return <LoaderCentered />;

  const cards = [
    { value: '0', label: 'Клиентов в базе' },
    { value: 'Бесплатно!', label: 'Push и Web-push', highlight: true },
    { value: smsBalance, label: 'Баланс SMS', sms: true },
  ];

  return (
    <Container>
      <TitleWithHelp
        title="Рассылки"
        tooltipId="mailings-help"
        tooltipHtml
        tooltipContent={`Здесь вы управляете своими рассылками: создавайте, планируйте, отправляйте Push клиентам для
        повышения лояльности.`}
      />

      <StatsRow>
        {cards.map((c, idx) => {
          // const isSms = !!c.sms;
          // const showTopUp = isSms && hoverSms;
          return (
            <StatCard
              key={idx}
              // $clickable={isSms}
              // onMouseEnter={() => isSms && setHoverSms(true)}
              // onMouseLeave={() => isSms && setHoverSms(false)}
              // onClick={() => isSms && setTopUpOpen(true)}
            >
              <Value $highlight={c.highlight} $gray={c.gray}>
                {c.value}
              </Value>
              <Label>{c.label}</Label>
            </StatCard>
          );
        })}
      </StatsRow>

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

          <span style={{ fontSize: '14px', color: '#666' }}>
            Всего: {total}
          </span>

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
        </div>
      </div>

      <TableWrapper>
        <CustomTable
          columns={columns}
          rows={rows}
          emptyText="Здесь будут ваши рассылки"
          onRowClick={(row) => setSelectedId(row.id)}
        />
      </TableWrapper>

      <Pagination 
        page={page} 
        totalPages={totalPages} 
        onPageChange={handlePageChange}
      />

      <MailingDetailsModal
        isOpen={!!selectedId}
        mailingId={selectedId}
        onClose={() => setSelectedId(null)}
      />

      {/* <TopUpModal
        isOpen={topUpOpen}
        onClose={() => setTopUpOpen(false)}
        onConfirm={handleTopUpConfirm}
      /> */}
    </Container>
  );
};

export default MailingsInfo;
