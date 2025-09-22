import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import axiosInstance from '../../axiosInstance';
import CardInfo from '../../components/CardInfo/CardInfo';
import CustomTable from '../../components/CustomTable';
import DashboardStats from '../../components/DashboardStats';
import InfoOverlay from '../../components/InfoOverlay';
import LoaderCentered from '../../components/LoaderCentered';
import { transactionHeaders } from '../../mocks/mockTransactions';
import {
  Button,
  ButtonsRow,
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

  const [card, setCard] = useState(cards.find((c) => c.id === +id) || null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(!card);
  const [showInfo, setShowInfo] = useState(false);

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
        const res = await axiosInstance.get(`/clients/transactions/${card.id}`);
        const mappedRows = res.data.map((tr) => ({
          ...tr,
          userName: tr.user_name || tr.userName,
          dateTime: tr.date_time || tr.dateTime || tr.created_at,
        }));
        setTransactions(mappedRows);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [card]);

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
              <CardInfo card={card} setShowInfo={setShowInfo} />
            )}
          </PhoneContainer>

          <QrContainer>
            <QrImage src={card.qrImg} alt="QR code" />
            <QrLink title="Ссылка регистрации карты">{card.urlCopy}</QrLink>

            <ButtonsRow>
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(card.urlCopy);
                }}
              >
                Скопировать ссылку регистрации
              </Button>
              {/* НЕ УДАЛЯТЬ, ПОЯВИТСЯ ПОЗЖЕ */}
              {/* <Button onClick={() => generatePDF(card)}>Скачать PDF</Button> */}
            </ButtonsRow>
          </QrContainer>
        </InfoBlock>

        <DashboardStats />
      </ImageWrapper>

      <TableWrapper>
        <h3 className="table-name">Последние транзакции по карте</h3>
        <CustomTable columns={transactionHeaders} rows={transactions} />
      </TableWrapper>
    </Wrapper>
  );
};

export default DefaultCardInfo;
