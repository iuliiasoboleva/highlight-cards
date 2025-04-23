import React from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { useSelector } from 'react-redux';

import CardButtons from '../../components/CardButtons';
import CardInfo from '../../components/CardInfo';

import './styles.css';

const Cards = () => {
  const cards = useSelector((state) => state.cards.cards);

  return (
    <div className="cards">
      {cards.map((card) => (
        <div key={card.id} className="card">
          <div className="card-state">
            <span className={`status-indicator ${card.isActive ? 'active' : 'inactive'}`} />
            {card.title}
          </div>
          <div className="card-image-block">
            <img className="card-image" src={card.frameUrl} alt={card.name} />
            {card.id !== 'fixed' && <CardInfo card={card} />}
          </div>
          <h2>{card.name}</h2>
          <CardButtons isFixed={card.id === 'fixed'} cardId={card.id} />
        </div>
      ))}
    </div>
  );
};

export default Cards;
