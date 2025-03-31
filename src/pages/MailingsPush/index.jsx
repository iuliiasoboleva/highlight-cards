import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import CardInfo from '../../components/CardInfo';
import './styles.css';

const MailingsPush = () => {
    const { id } = useParams();

    return (
        <div className='edit-type-main-container'>
            <div className="edit-type-page">
                <div className="mailings-push-container">
                    <h2 className="mailings-push-title">
                        Отправить push <span className="free-badge">Бесплатно!</span>
                    </h2>
                    <p className="mailings-push-description">
                        Эти сообщения появятся на экране блокировки и в разделе «Последние обновления» на электронной карточке ваших клиентов.
                    </p>

                    <div className="mailings-push-box">
                        <h3 className="box-title">Отправить push</h3>

                        <select className="push-select full">
                            <option>Карта</option>
                        </select>

                        <div className="push-toggle-buttons">
                            <button className="btn btn-light">Всем клиентам</button>
                            <button className="btn btn-dark">Выбранному сегменту</button>
                        </div>

                        <div className="push-segment-filter">
                            <select className="push-select">
                                <option>RFM - Новички</option>
                            </select>
                            <select className="push-select narrow">
                                <option>=</option>
                            </select>
                            <input className="push-input narrow" type="number" placeholder="0" />
                        </div>

                        <p className="push-recipient-count">👤 0 клиента получат ваше сообщение</p>

                        <div className="push-schedule">
                            <label className="checkbox-label">
                                <input type="checkbox" defaultChecked />
                                <span>Запланировать</span>
                            </label>
                            <input className="push-date" type="datetime-local" defaultValue="2025-03-30T16:19" />
                        </div>

                        <textarea
                            className="push-textarea"
                            placeholder="Введите текст push-уведомления"
                        />

                        <button className="btn btn-dark">Отправить</button>
                    </div>
                </div>

            </div>
            <div className='type-card-image-container'>
                <img className="card-image-add" src="/phone.svg" alt="preview" />
                <CardInfo card={{ id, title: 'Карта', name: 'Накопительная карта' }} />
            </div>
        </div>
    );
};

export default MailingsPush;