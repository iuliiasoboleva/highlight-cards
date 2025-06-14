import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Loader2 } from 'lucide-react';

import AgreementModal from '../../components/AgreementModal';
import CustomSelect from '../../components/CustomSelect';
import CustomTable from '../../components/CustomTable';
import { mockPaymentHistory } from '../../mocks/mockTariff';
import { fetchTariffs } from '../../store/tariffsSlice';

import './styles.css';

const Settings = () => {
  const dispatch = useDispatch();
  const { plans: tariffPlans, loading } = useSelector((state) => state.tariffs);

  useEffect(() => {
    if (!tariffPlans.length) {
      dispatch(fetchTariffs());
    }
  }, [dispatch, tariffPlans.length]);

  const [period, setPeriod] = useState({});

  useEffect(() => {
    if (tariffPlans.length) {
      const init = tariffPlans.reduce((acc, plan) => {
        acc[plan.name] = 'Месяц';
        return acc;
      }, {});
      setPeriod(init);
    }
  }, [tariffPlans]);

  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState('plan');

  if (loading) {
    return (
      <div style={{display:'flex',justifyContent:'center',alignItems:'center',height:'calc(100vh - 200px)'}}>
        <Loader2 className="spinner" size={48} strokeWidth={1.4} />
      </div>
    );
  }

  if (!tariffPlans.length) return <p>Тарифы не найдены</p>;

  // текущий тариф временно берём первый
  const currentTariff = tariffPlans[0];

  // Подготовка данных для таблицы тарифов
  const tariffColumns = [
    {
      key: 'feature',
      title: 'ФУНКЦИОНАЛ',
      className: 'text-left feature-header',
      cellClassName: 'text-left feature-cell',
    },
    ...tariffPlans.map((plan) => ({
      key: plan.name,
      title: plan.name,
      className: 'text-center',
      cellClassName: 'text-center',
    })),
  ];

  const tariffRows = [
    {
      feature: (
        <>
          <p>Стоимость в месяц</p>
          <small>
            при оплате за год<br />/ за месяц
          </small>
        </>
      ),
      ...Object.fromEntries(
        tariffPlans.map((plan) => [
          plan.name,
          `${Math.round(plan.prices.year / 12)} ₽ / ${plan.prices.month} ₽`,
        ]),
      ),
    },
    {
      feature: (
        <>
          <p>Интеграции</p>
          Интеграция с ПО для автоматического начисления
        </>
      ),
      ...Object.fromEntries(
        tariffPlans.map((plan) => [
          plan.name,
          plan.integrations === '—' ? <span className="tariff-red">−</span> : plan.integrations,
        ]),
      ),
    },
    {
      feature: (
        <>
          <p>Пользовательские поля</p>
          Добавьте собственное наполнение без шаблона
        </>
      ),
      ...Object.fromEntries(
        tariffPlans.map((plan) => [
          plan.name,
          plan.customFields ? (
            <span className="tariff-green">+</span>
          ) : (
            <span className="tariff-red">−</span>
          ),
        ]),
      ),
    },
    {
      feature: (
        <>
          <p>Настройка прав менеджеров</p>
          Детальный контроль доступа
        </>
      ),
      ...Object.fromEntries(
        tariffPlans.map((plan) => [
          plan.name,
          plan.permissions ? (
            <span className="tariff-green">+</span>
          ) : (
            <span className="tariff-red">−</span>
          ),
        ]),
      ),
    },
    {
      feature: <p>Период оплаты</p>,
      ...Object.fromEntries(
        tariffPlans.map((plan) => [
          plan.name,
          <div className="tariff-selector">
            <CustomSelect
              value={period[plan.name] || 'Месяц'}
              onChange={(value) => setPeriod((prev) => ({ ...prev, [plan.name]: value }))}
              options={[
                { value: 'Год', label: 'Год' },
                { value: 'Месяц', label: 'Месяц' },
              ]}
              className="tariff-period-select"
            />
            <button className="custom-main-button">Выбрать тариф</button>
          </div>,
        ]),
      ),
    },
  ];

  const paymentHistoryColumns = [
    { key: 'date', title: 'Дата', className: 'text-left' },
    { key: 'amount', title: 'Сумма', className: 'text-left' },
    { key: 'plan', title: 'Тарифный план', className: 'text-left' },
    {
      key: 'status',
      title: 'Статус',
      className: 'text-left',
      render: (row) => (
        <span className={`status-badge ${row.status === 'Успешно' ? 'success' : ''}`}>
          {row.status}
        </span>
      ),
    },
    { key: 'invoice', title: 'Инвойс', className: 'text-left' },
  ];

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h2>Тарифный план</h2>
        <div className="settings-tabs">
          <button
            className={`settings-tab-button ${activeTab === 'plan' ? 'active' : ''}`}
            onClick={() => setActiveTab('plan')}
          >
            План
          </button>
          <button
            className={`settings-tab-button ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            История платежей
          </button>
        </div>
      </div>

      {activeTab === 'plan' ? (
        <>
          <div className="tariff-boxes">
            <div className="tariff-box">
              <div className="tariff-box-column">
                <p>Ваш тариф</p>
                <hr />
                <div className="tariff-box-content">
                  <div className="tariff-name">{currentTariff.name}</div>
                  <div className="tariff-sub">Годовая оплата</div>
                </div>
              </div>
              <div className="tariff-box-column">
                <p>Стоимость</p>
                <hr />
                <div className="tariff-box-content">
                  <div className="tariff-price">{currentTariff.prices.month} ₽</div>
                  <div className="tariff-sub">В месяц</div>
                </div>
              </div>
            </div>

            <div className="tariff-due">
              <p className="tariff-due-title">Дата списания средств за тариф</p>
              <hr />
              <div className="tariff-due-grid">
                <div className="tariff-box-content">
                  <div className="tariff-due-date">10.04.2025</div>
                  <p className="tariff-sub">Дата следующего списания</p>
                </div>
                <div className="tariff-box-content">
                  <div className="tariff-due-time">00:33</div>
                </div>
                <div className="tariff-box-content">
                  <div className="tariff-due-days">10</div>
                  <p className="tariff-sub">Дней осталось</p>
                </div>
              </div>
              <button className="custom-main-button" onClick={() => setShowModal(true)}>
                Продлить
              </button>
            </div>
          </div>

          <h3 className="settings-title">Полный функционал</h3>
          <CustomTable columns={tariffColumns} rows={tariffRows} />
        </>
      ) : (
        <div className="payment-history">
          <h3>История платежей</h3>
          <CustomTable columns={paymentHistoryColumns} rows={mockPaymentHistory} />
        </div>
      )}

      {showModal && (
        <AgreementModal
          onClose={() => setShowModal(false)}
          onConfirm={() => {
            setShowModal(false);
            alert('Переход к оплате');
          }}
        />
      )}
    </div>
  );
};

export default Settings;
