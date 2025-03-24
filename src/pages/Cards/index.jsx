import React, { useEffect, useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import CardInfo from '../../components/CardInfo';
import CardButtons from '../../components/CardButtons';
import { mockCards } from '../../mocks/cardData';
import './styles.css';

const fixedCard = { id: 'fixed', title: 'Активна', status: 'fixed', isActive: true, isFixed: true, frameUrl: '/frame-empty.svg', name: 'Создать карту' };

const Cards = () => {
    const [cards, setCards] = useState([fixedCard]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const response = await new Promise((resolve) => {
                    setTimeout(() => {
                        resolve(mockCards);
                    }, 1000);
                });
                setCards([fixedCard, ...response]);
            } catch (err) {
                setError(err.message);
                setCards([fixedCard]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    if (isLoading) return <div>Загрузка...</div>;
    if (error) return <div style={{ color: 'red' }}>Ошибка: {error}</div>;

    return (
        <div className='cards'>
            {cards.map((card) => (
                <div key={card.id} className='card'>
                    <div className='card-state'>
                        <span className={`status-indicator ${card.isActive ? 'active' : 'inactive'}`} />
                        {card.title}
                    </div>
                    <div className='card-image-block'>
                        <img className='card-image' src={card.frameUrl} alt={card.name} />
                        {card.id !== 'fixed' && <CardInfo card={card} />}
                    </div>
                    <h2>{card.name}</h2>
                    <CardButtons isFixed={card.id === 'fixed'} />
                </div>
            ))}
        </div>
    );
};

export default Cards;
