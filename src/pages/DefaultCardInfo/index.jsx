import React from 'react';
import { useParams } from 'react-router-dom';

import CardInfo from '../../components/CardInfo';
import DashboardStats from '../../components/DashboardStats';
import TransactionsTable from '../../components/TransactionsTable';
import { mockCards } from '../../mocks/cardData';
import { mockTransactions, transactionHeaders } from '../../mocks/mockTransactions';

import './styles.css';

const DefaultCardInfo = () => {
  const { id } = useParams();

  const card = mockCards.find((card) => card.id === +id);

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
              <button>Скачать PDF</button>
            </div>
          </div>
        </div>
        <DashboardStats />
      </div>
      <div className="table-wrapper">
        <TransactionsTable
          title="Последние транзакции по карте"
          headers={transactionHeaders}
          data={mockTransactions}
        />
      </div>
    </div>
  );
};

export default DefaultCardInfo;
