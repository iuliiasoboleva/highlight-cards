import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import axiosInstance from '../../axiosInstance';
import CustomTable from '../../components/CustomTable';
import LoaderCentered from '../../components/LoaderCentered';
import TitleWithHelp from '../../components/TitleWithHelp';
import TopUpModal from '../../components/TopUpModal';
import { mailingsHeaders } from '../../mocks/mockMailings';
import { fetchBalance, topUpBalance } from '../../store/balanceSlice';
import MailingDetailsModal from './MailingDetailsModal';
import { Badge, Container, Label, StatCard, StatsRow, TableWrapper, Value } from './styles';

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

  // колонки таблицы
  const columns = mailingsHeaders.map((header) => ({
    key: header.key,
    title: header.label,
    className: 'text-left',
    cellClassName: 'text-left',
  }));

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
    columns[recipientsIdx].render = (row) => (row.recipients === 'all' ? 'Всем' : row.recipients);
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

  if (loading) return <LoaderCentered />;

  const cards = [
    { value: '0', label: 'Клиентов в базе' },
    { value: 'Бесплатно!', label: 'Push и Web-push', highlight: true },
    { value: smsLoading ? '...' : smsBalance, label: 'Баланс SMS', sms: true },
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
          const isSms = !!c.sms;
          const showTopUp = isSms && hoverSms;
          return (
            <StatCard
              key={idx}
              $clickable={isSms}
              onMouseEnter={() => isSms && setHoverSms(true)}
              onMouseLeave={() => isSms && setHoverSms(false)}
              onClick={() => isSms && setTopUpOpen(true)}
            >
              <Value $highlight={c.highlight} $gray={c.gray}>
                {showTopUp ? 'Пополнить' : c.value}
              </Value>
              {!showTopUp && <Label>{c.label}</Label>}
            </StatCard>
          );
        })}
      </StatsRow>

      <TableWrapper>
        <CustomTable
          columns={columns}
          rows={rows}
          emptyText="Здесь будут ваши рассылки"
          onRowClick={(row) => setSelectedId(row.id)}
        />
      </TableWrapper>

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
    </Container>
  );
};

export default MailingsInfo;
