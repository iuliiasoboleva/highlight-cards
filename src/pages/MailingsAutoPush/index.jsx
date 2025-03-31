import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import CardInfo from '../../components/CardInfo';
import { mockUserPushes } from '../../mocks/mockUserPushes';
import './styles.css';

const MailingsAutoPush = () => {
    const { id } = useParams();
    const [tariff, setTariff] = useState('Start');

    const hasAccess = tariff !== 'Start';

    return (
        <div className='edit-type-main-container'>
            <div className="edit-type-page">
                <div className="mailings-push-container">
                    <h2 className="mailings-push-title">
                        Автоматизация push <span className="free-badge">Бесплатно!</span>
                    </h2>
                    <p className="mailings-push-description">
                        Настройте автоматические PUSH-уведомления по собственному сценарию. Поздравляйте клиента с днём рождения, собирайте обратную связь, напоминайте зайти к вам снова
                    </p>

                    <hr />

                    {hasAccess ? (
                        <div className="automation-table">
                            <h3>Сценарии автопушей</h3>
                            <ul className="automation-list">
                                {mockUserPushes.map((item) => (
                                    <li key={item.id} className="automation-item">
                                        <div className="automation-item-title">{item.title}</div>
                                        <div className="automation-item-description">{item.description}</div>
                                        <div className="automation-item-status">{item.enabled ? 'Включено' : 'Выключено'}</div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <div className="tariff-lock-box">
                            <p>
                                Данный функционал не доступен на вашем тарифе <strong>«Start»</strong>
                            </p>
                            <button className="btn btn-dark">Выбрать тариф</button>
                        </div>
                    )}
                </div>
            </div>
            <div className='type-card-image-container'>
                <img className="card-image-add" src="/phone.svg" alt="preview" />
                <CardInfo card={{ id, title: 'Карта', name: 'Накопительная карта' }} />
            </div>
        </div>
    );
};

export default MailingsAutoPush;