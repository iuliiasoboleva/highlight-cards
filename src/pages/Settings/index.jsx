import React, { useState } from 'react';
import './styles.css';
import AgreementModal from '../../components/AgreementModal';

const mockTariff = {
  name: 'Start (Пробный)',
  billing: 'С годовой оплатой',
  price: 25,
  nextPaymentDate: '10/04/2025',
  nextPaymentTime: '00:33',
  daysLeft: 10
};

const tariffPlans = [
  {
    name: 'START',
    prices: {
      year: 19,
      quarter: 22,
      month: 25
    },
    integrations: '—',
    customFields: false,
    permissions: false
  },
  {
    name: 'GROW',
    prices: {
      year: 35,
      quarter: 39,
      month: 45
    },
    integrations: '—',
    customFields: true,
    permissions: false
  },
  {
    name: 'BUSINESS',
    prices: {
      year: 69,
      quarter: 79,
      month: 85
    },
    integrations: '3 интеграции',
    customFields: true,
    permissions: true
  }
];

const Settings = () => {
  const [period, setPeriod] = useState({
    START: 'Год',
    GROW: 'Год',
    BUSINESS: 'Год'
  });
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="settings-container">
      <h2>Тарифный план</h2>

      <div className="tariff-boxes">
        <div className="tariff-box">
          <p>Ваш тариф</p>
          <div className="tariff-name">{mockTariff.name}</div>
          <div className="tariff-sub">{mockTariff.billing}</div>
        </div>
        <div className="tariff-box">
          <p>Стоимость</p>
          <div className="tariff-price">{mockTariff.price} $</div>
          <div className="tariff-sub">В месяц</div>
        </div>
      </div>

      <div className="tariff-due">
        <p className="tariff-due-title">Дата списания средств за тариф</p>
        <div className="tariff-due-grid">
          <div>
            <div className="tariff-due-date">{mockTariff.nextPaymentDate}</div>
            <p>Дата следующего списания</p>
          </div>
          <div>
            <div className="tariff-due-time">{mockTariff.nextPaymentTime}</div>
          </div>
          <div>
            <div className="tariff-due-days">{mockTariff.daysLeft}</div>
            <p>Дней осталось</p>
          </div>
        </div>
        <button className="btn-dark" onClick={() => setShowModal(true)}>Продлить</button>
        </div>

      <h3>Полный функционал</h3>

      <div className="tariff-table-wrapper">
        <table className="tariff-table">
          <thead>
            <tr>
              <th>ФУНКЦИОНАЛ</th>
              {tariffPlans.map(plan => (
                <th key={plan.name}>{plan.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <strong>Стоимость в месяц</strong><br />
                <small>при оплате за год<br />/ за квартал<br />/ за месяц</small>
              </td>
              {tariffPlans.map(plan => (
                <td key={plan.name}>
                  {plan.prices.year} $<br />/ {plan.prices.quarter} $<br />/ {plan.prices.month} $
                </td>
              ))}
            </tr>
            <tr>
              <td><strong>Интеграции</strong><br />Интеграция с ПО для автоматического начисления</td>
              {tariffPlans.map(plan => (
                <td key={plan.name}>
                  {plan.integrations === '—' ? <span className="red">−</span> : plan.integrations}
                </td>
              ))}
            </tr>
            <tr>
              <td><strong>Пользовательские поля</strong><br />Добавьте собственное наполнение без шаблона</td>
              {tariffPlans.map(plan => (
                <td key={plan.name}>
                  {plan.customFields ? <span className="green">+</span> : <span className="red">−</span>}
                </td>
              ))}
            </tr>
            <tr>
              <td><strong>Customizable manager’s permissions</strong><br />Granular control over manager access</td>
              {tariffPlans.map(plan => (
                <td key={plan.name}>
                  {plan.permissions ? <span className="green">+</span> : <span className="red">−</span>}
                </td>
              ))}
            </tr>
          </tbody>
        </table>

        <div className="tariff-selectors">
          {tariffPlans.map(plan => (
            <div key={plan.name} className="tariff-selector">
              <select
                value={period[plan.name]}
                onChange={e =>
                  setPeriod(prev => ({ ...prev, [plan.name]: e.target.value }))
                }
              >
                <option>Год</option>
                <option>Квартал</option>
                <option>Месяц</option>
              </select>
              <button className="btn-dark">Выбрать тариф</button>
            </div>
          ))}
        </div>
      </div>
      {showModal && (
  <AgreementModal
    onClose={() => setShowModal(false)}
    onConfirm={() => {
      setShowModal(false);
      alert('Переход к оплате'); // или переход на страницу оплаты
    }}
  />
)}
    </div>
  );
};

export default Settings;
