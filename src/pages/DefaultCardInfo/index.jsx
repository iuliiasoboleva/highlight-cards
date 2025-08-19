import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import axiosInstance from '../../axiosInstance';
import CardInfo from '../../components/CardInfo/CardInfo';
import CustomTable from '../../components/CustomTable';
import DashboardStats from '../../components/DashboardStats';
import LoaderCentered from '../../components/LoaderCentered';
import { transactionHeaders } from '../../mocks/mockTransactions';
import { setCurrentCard } from '../../store/cardsSlice';
import { generatePDF } from '../../utils/pdfGenerator';

import './styles.css';

const DefaultCardInfo = () => {
  const { id } = useParams();
  const { cards } = useSelector((state) => state.cards);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [card, setCard] = useState(cards.find((c) => c.id === +id) || null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(!card);

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

  if (!card) return <p style={{ textAlign: 'center' }}>Карточка не найдена</p>;

  return (
    <div className="card-info-wrapper">
      <div className="card-info-title" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <h1>{card.name}</h1>
        <div className="card-state">
          <span className={`status-indicator ${card.isActive ? 'active' : 'inactive'}`} />
          {card.isActive ? 'Активна' : 'Не активна'}
        </div>
        <div className="card-state">{card.title}</div>
      </div>
      <div className="card-image-wrapper">
        <div className="card-info-block">
          <div className="card-image-container">
            <img className="card-image-add" src={card.frameUrl} alt={card.name} />
            <CardInfo card={card} />
          </div>
          <div className="card-info-container">
            <img src={card.qrImg} alt="QR code" />
            <div className="card-info-link">{card.urlCopy}</div>

            <div className="card-buttons">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(card.urlCopy);
                }}
              >
                Скопировать ссылку
              </button>
              {/* НЕ УДАЛЯТЬ, ПОЯВИТСЯ ПОЗЖЕ */}
              {/* <button onClick={() => generatePDF(card)}>Скачать PDF</button> */}
            </div>
          </div>
        </div>
        <DashboardStats />
      </div>
      <div className="table-wrapper">
        <h3 className="table-name">Последние транзакции по карте</h3>
        <CustomTable columns={transactionHeaders} rows={transactions} />
      </div>
    </div>
  );
};

export default DefaultCardInfo;
