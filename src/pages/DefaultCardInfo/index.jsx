import React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import CardInfo from '../../components/CardInfo';
import CustomTable from '../../components/CustomTable';
import DashboardStats from '../../components/DashboardStats';
import { mockTransactions, transactionHeaders } from '../../mocks/mockTransactions';
import { generatePDF } from '../../utils/pdfGenerator';

import './styles.css';

const DefaultCardInfo = () => {
  const { id } = useParams();
  const { cards } = useSelector((state) => state.cards);

  const card = cards.find((card) => card.id === +id);

  if (!card) {
    return <div>Карточка не найдена</div>;
  }

  return (
    <div className="card-info-wrapper">
      <div className="card-info-title">
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
              <button>Скопировать ссылку</button>
              <button onClick={() => generatePDF(card)}>Скачать PDF</button>
            </div>
          </div>
        </div>
        <DashboardStats />
      </div>
      <div className="table-wrapper">
        <h3 className="table-name">Последние транзакции по карте</h3>
        <CustomTable columns={transactionHeaders} rows={mockTransactions} />
      </div>
    </div>
  );
};

export default DefaultCardInfo;
