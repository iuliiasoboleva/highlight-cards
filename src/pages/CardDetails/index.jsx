import React from 'react';
import { useParams } from 'react-router-dom';
import CardInfo from '../../components/CardInfo';
import { mockCards } from '../../mocks/cardData';
import './styles.css';

const CardDetails = () => {
    const { id } = useParams();

    const card = mockCards.find((card) => card.id === +id);

    if (!card) {
        return <div>Карточка не найдена</div>;
    }

    return (
        <div className='card-image-block'>
            <img className='card-image' src={card.frameUrl} alt={card.name} />
            <CardInfo card={card} />
        </div>
    );
};

export default CardDetails;
