import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import axiosInstance from '../../axiosInstance';
import CardInfo from '../../components/CardInfo/CardInfo';
import CustomTable from '../../components/CustomTable';
import DashboardStats from '../../components/DashboardStats';
import InfoOverlay from '../../components/InfoOverlay';
import IssueGiftCardModal from '../../components/IssueGiftCardModal';
import LoaderCentered from '../../components/LoaderCentered';
import { useToast } from '../../components/Toast';
import { transactionHeaders } from '../../mocks/mockTransactions';
import { generatePDF } from '../../utils/pdfGenerator';
import {
  Button,
  ButtonsRow,
  CardWrapper,
  FrameImg,
  HeaderButton,
  ImageWrapper,
  InfoBlock,
  OverlayWrapper,
  PhoneContainer,
  QrContainer,
  QrImage,
  QrLink,
  StateTag,
  StatusIndicator,
  TableWrapper,
  TitleRow,
  Wrapper,
} from './styles';

const PAGE_SIZE_OPTIONS = [3, 5, 10, 20, 50];
const EVENT_LABELS = {
  stamp_add: 'Начисление штампов',
  reward_given: 'Добавление награды',
  reward_received: 'Получение награды',
  cashback_accrued: 'Начисление кешбэка',
  cashback_spent: 'Списание кешбэка',
  certificate_spend: 'Списание сертификата',
  certificate_adjustment: 'Корректировка',
};

const DefaultCardInfo = () => {
  const { id } = useParams();
  const { cards } = useSelector((state) => state.cards);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();

  const [card, setCard] = useState(cards.find((c) => c.id === +id) || null);
  const [transactions, setTransactions] = useState([]);
  const [transactionsLoading, setTransactionsLoading] = useState(false);
  const [transactionsTotal, setTransactionsTotal] = useState(0);
  const [transactionsPage, setTransactionsPage] = useState(1);
  const [transactionsPageSize, setTransactionsPageSize] = useState(5);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(!card);
  const [showInfo, setShowInfo] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [issuing, setIssuing] = useState(false);
  const [issueSuccess, setIssueSuccess] = useState(0);

  useEffect(() => {
    if (card) return;
    (async () => {
      try {
        const res = await axiosInstance.get(`/cards/${id}`);
        const data = res.data;
        const mapped = {
          ...data,
          frameUrl: data.frame_url || data.frameUrl,
          qrImg: data.qr_img || data.qrImg,
          urlCopy: data.url_copy || data.urlCopy,
          isActive: data.is_active ?? data.isActive,
        };
        setCard(mapped);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [card, id]);

  useEffect(() => {
    if (!card) return;
    (async () => {
      try {
        await fetchTransactions(card.id, 1, transactionsPageSize);
        setTransactionsPage(1);
        const statsRes = await axiosInstance.get(`/cards/${card.id}/stats`);
        setStats(statsRes.data);
      } catch (e) {
        console.error(e);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [card]);

  const fetchTransactions = async (cardId, page = transactionsPage, limit = transactionsPageSize) => {
    if (!cardId) {
      setTransactions([]);
      setTransactionsTotal(0);
      return;
    }
    setTransactionsLoading(true);
    try {
      const txRes = await axiosInstance.get(`/clients/transactions/${cardId}`, { params: { page, limit } });
      const txList = txRes.data?.items || txRes.data || [];
      const mappedRows = txList.map((tr) => ({
        ...tr,
        userName: tr.user_name || tr.userName,
        dateTime: tr.date_time || tr.dateTime || tr.created_at,
        event: EVENT_LABELS[tr.event] || tr.event,
      }));
      setTransactions(mappedRows);
      setTransactionsTotal(txRes.data?.total ?? txList.length);
    } catch (e) {
      console.error(e);
      setTransactions([]);
      setTransactionsTotal(0);
    } finally {
      setTransactionsLoading(false);
    }
  };

  const handlePageSizeChange = async (value) => {
    const numeric = Number(value) || transactionsPageSize;
    setTransactionsPageSize(numeric);
    setTransactionsPage(1);
    if (card?.id) {
      await fetchTransactions(card.id, 1, numeric);
    }
  };

  const handlePageChange = async (nextPage) => {
    const totalPages = Math.max(1, Math.ceil(transactionsTotal / transactionsPageSize) || 1);
    if (nextPage < 1 || nextPage > totalPages || nextPage === transactionsPage) return;
    setTransactionsPage(nextPage);
    if (card?.id) {
      await fetchTransactions(card.id, nextPage, transactionsPageSize);
    }
  };

  const handleIssueGift = async (data) => {
    setIssuing(true);
    try {
      const res = await axiosInstance.post(`/cards/${card.id}/issue_gift`, data);
      toast.success(`Сертификат выпущен! Номер: ${res.data.card_number}`);
      setIsIssueModalOpen(false);
      setIssueSuccess(prev => prev + 1);
    } catch (e) {
      console.error(e);
      toast.error('Ошибка при выпуске сертификата');
    } finally {
      setIssuing(false);
    }
  };

  if (loading) {
    return <LoaderCentered />;
  }

  if (!card) return;
  <Wrapper>
    <p style={{ textAlign: 'center' }}>Карточка не найдена</p>
  </Wrapper>;

  return (
    <Wrapper>
      <TitleRow>
        <div>
          <h1>{card.name}</h1>
          <div className="tags">
            <StateTag>
              <StatusIndicator $active={card.isActive} />
              {card.isActive ? 'Активна' : 'Не активна'}
            </StateTag>
            <StateTag>{card.title}</StateTag>
          </div>
        </div>
        {card.status === 'certificate' && (
          <HeaderButton onClick={() => setIsIssueModalOpen(true)}>
            Выпустить сертификат
          </HeaderButton>
        )}
      </TitleRow>

      <ImageWrapper>
        <InfoBlock>
          <PhoneContainer>
            <FrameImg src={card.frameUrl} alt={card.name} />
            {showInfo ? (
              <OverlayWrapper>
                <InfoOverlay
                  infoFields={card.infoFields || {}}
                  onClose={() => setShowInfo(false)}
                />
              </OverlayWrapper>
            ) : (
              <CardWrapper>
                <CardInfo card={card} setShowInfo={setShowInfo} previewType="list" />
              </CardWrapper>
            )}
          </PhoneContainer>

          <QrContainer>
            <QrImage src={card.qrImg} alt="QR code" />
            <QrLink title="Ссылка регистрации карты">{card.urlCopy}</QrLink>

            <ButtonsRow>
              <Button onClick={() => generatePDF(card)}>Печать QR-кода</Button>
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(card.urlCopy);
                  setIsCopied(true);
                  setTimeout(() => setIsCopied(false), 2000);
                }}
              >
                {isCopied ? 'Скопировано!' : 'Скопировать ссылку регистрации'}
              </Button>
            </ButtonsRow>
          </QrContainer>
        </InfoBlock>

        <DashboardStats data={stats} />
      </ImageWrapper>

      <TableWrapper>
        <h3 className="table-name">Последние транзакции по карте</h3>
        <CustomTable columns={transactionHeaders} rows={transactions} loading={transactionsLoading} />
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            marginTop: '12px',
          }}
        >
          <label style={{ fontSize: 14, color: '#7f8c8d', display: 'flex', alignItems: 'center', gap: 6 }}>
            Показать:
            <select
              value={transactionsPageSize}
              onChange={(e) => handlePageSizeChange(e.target.value)}
              style={{ padding: '6px 8px', borderRadius: 6, border: '1px solid #dcdcdc' }}
            >
              {PAGE_SIZE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              type="button"
              onClick={() => handlePageChange(transactionsPage - 1)}
              disabled={transactionsPage <= 1 || transactionsLoading}
              style={{
                padding: '6px 10px',
                borderRadius: 6,
                border: '1px solid #dcdcdc',
                background: transactionsPage <= 1 || transactionsLoading ? '#f1f1f1' : '#fff',
                cursor: transactionsPage <= 1 || transactionsLoading ? 'not-allowed' : 'pointer',
              }}
            >
              Назад
            </button>
            <span style={{ fontSize: 13, color: '#7f8c8d' }}>
              Стр. {Math.min(transactionsPage, Math.max(1, Math.ceil(transactionsTotal / transactionsPageSize) || 1))} из{' '}
              {Math.max(1, Math.ceil(transactionsTotal / transactionsPageSize) || 1)}
            </span>
            <button
              type="button"
              onClick={() => handlePageChange(transactionsPage + 1)}
              disabled={
                transactionsPage >= Math.max(1, Math.ceil(transactionsTotal / transactionsPageSize) || 1) || transactionsLoading
              }
              style={{
                padding: '6px 10px',
                borderRadius: 6,
                border: '1px solid #dcdcdc',
                background:
                  transactionsPage >= Math.max(1, Math.ceil(transactionsTotal / transactionsPageSize) || 1) || transactionsLoading
                    ? '#f1f1f1'
                    : '#fff',
                cursor:
                  transactionsPage >= Math.max(1, Math.ceil(transactionsTotal / transactionsPageSize) || 1) || transactionsLoading
                    ? 'not-allowed'
                    : 'pointer',
              }}
            >
              Вперёд
            </button>
          </div>
        </div>
      </TableWrapper>

      {isIssueModalOpen && (
        <IssueGiftCardModal
          open={isIssueModalOpen}
          onClose={() => setIsIssueModalOpen(false)}
          onIssue={handleIssueGift}
          loading={issuing}
          defaultValues={card}
          onSuccess={issueSuccess}
        />
      )}
    </Wrapper>
  );
};

export default DefaultCardInfo;
