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

const DefaultCardInfo = () => {
  const { id } = useParams();
  const { cards } = useSelector((state) => state.cards);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();

  const [card, setCard] = useState(cards.find((c) => c.id === +id) || null);
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(!card);
  const [showInfo, setShowInfo] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [issuing, setIssuing] = useState(false);

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
        const [txRes, statsRes] = await Promise.all([
          axiosInstance.get(`/clients/transactions/${card.id}`),
          axiosInstance.get(`/cards/${card.id}/stats`)
        ]);
        
        const mappedRows = txRes.data.map((tr) => ({
          ...tr,
          userName: tr.user_name || tr.userName,
          dateTime: tr.date_time || tr.dateTime || tr.created_at,
        }));
        setTransactions(mappedRows);
        setStats(statsRes.data);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [card]);

  const handleIssueGift = async (data) => {
    setIssuing(true);
    try {
      const res = await axiosInstance.post(`/cards/${card.id}/issue_gift`, data);
      toast.success(`Сертификат выпущен! Номер: ${res.data.card_number}`);
      setIsIssueModalOpen(false);
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
        <h1>{card.name}</h1>
        <StateTag>
          <StatusIndicator $active={card.isActive} />
          {card.isActive ? 'Активна' : 'Не активна'}
        </StateTag>
        <StateTag>{card.title}</StateTag>
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
              {card.status === 'certificate' && (
                <Button onClick={() => setIsIssueModalOpen(true)}>Выпустить сертификат</Button>
              )}
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
        <CustomTable columns={transactionHeaders} rows={transactions} />
      </TableWrapper>

      {isIssueModalOpen && (
        <IssueGiftCardModal
          open={isIssueModalOpen}
          onClose={() => setIsIssueModalOpen(false)}
          onIssue={handleIssueGift}
          loading={issuing}
          defaultValues={card}
        />
      )}
    </Wrapper>
  );
};

export default DefaultCardInfo;
