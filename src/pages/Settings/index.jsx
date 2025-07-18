import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Loader2 } from 'lucide-react';

import AgreementModal from '../../components/AgreementModal';
import CustomSelect from '../../components/CustomSelect';
import CustomTable from '../../components/CustomTable';
import { pluralize } from '../../helpers/pluralize';
import { fetchPayments } from '../../store/paymentsSlice';
import { fetchSubscription } from '../../store/subscriptionSlice';
import { fetchTariffs } from '../../store/tariffsSlice';
import { fetchBalance, topUpBalance } from '../../store/balanceSlice';

import './styles.css';

const Settings = () => {
  const dispatch = useDispatch();
  const { plans: tariffPlans, loading } = useSelector((state) => state.tariffs);
  const { list: payments = [], loading: paymentsLoading = true } = useSelector(
    (state) => state.payments || {},
  );
  const { organization_id: orgId, id: userId } = useSelector((state) => state.user);
  const { amount: balance = 0, loading: balanceLoading } = useSelector((state) => state.balance || {});
  const { info: subscription, loading: subLoading } = useSelector((state) => state.subscription);

  useEffect(() => {
    if (!tariffPlans.length) {
      dispatch(fetchTariffs());
    }
  }, [dispatch, tariffPlans.length]);

  useEffect(() => {
    if (!payments.length) {
      const id = orgId || 1;
      dispatch(fetchPayments({ orgId: id, userId }));
    }
  }, [dispatch, payments.length, orgId, userId]);

  useEffect(() => {
    if (orgId) {
      dispatch(fetchSubscription(orgId));
      dispatch(fetchBalance(orgId));
    }
  }, [dispatch, orgId]);

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

  const handleTopUp = () => {
    const input = prompt('Введите сумму пополнения', '');
    if (!input) return;
    const amount = parseInt(input, 10);
    if (isNaN(amount) || amount <= 0) return;
    dispatch(topUpBalance({ orgId, amount }));
  };

  const isTrial = subscription?.status === 'trial';
  const remainingDays = subscription?.days_left ?? 0;

  const planFeatures = [
    {
      category: 'Безлимиты',
      items: [
        'Безлимит по количеству карт',
        'Безлимит по сотрудникам',
        'Безлимит по программам лояльности',
        'Безлимит по push-уведомлениям и триггерам',
      ],
    },
    {
      category: 'Инфраструктура',
      items: [
        'Одна торговая точка',
        'Конструктор карт',
        'Брендинг анкет для клиентов',
        'Онлайн-анкеты и брендинг для клиентов',
        'Реферальная программа',
      ],
    },
    {
      category: 'Коммуникация/ взаимодействие с клиентами',
      items: ['Подарочные сертификаты', 'Геолокационные метки', 'Отзывы на Яндекс картах'],
    },
    {
      category: 'Аналитика и безопасность',
      items: [
        'Аналитика и сегментация клиентов (RFM)',
        'Отчёты по пуш-рассылкам',
        'Антифрод',
        'Импорт клиентской базы',
      ],
    },
    {
      category: 'Поддержка и внедрение',
      items: [
        'Поддержка 24/7',
        'Онлайн-обучение',
        'Чек-листы и инструменты внедрения программы лояльности в бизнес',
      ],
    },
    { category: 'Интеграции и API', items: ['Доступ к API', 'Интеграции c keeper, yclients'] },
  ];

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
            при оплате за год
            <br />/ за месяц
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
    {
      key: 'paid_at',
      title: 'Дата',
      className: 'text-left',
      render: (row) => new Date(row.paid_at).toLocaleDateString(),
    },
    { key: 'amount', title: 'Сумма', className: 'text-left', render: (row) => `${row.amount} ₽` },
    { key: 'plan_name', title: 'Тарифный план', className: 'text-left' },
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
    { key: 'invoice_number', title: 'Инвойс', className: 'text-left' },
  ];

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 'calc(100vh - 200px)',
        }}
      >
        <Loader2 className="spinner" size={48} strokeWidth={1.4} />
      </div>
    );
  }

  if (!tariffPlans.length) return <p>Тарифы не найдены</p>;

  // текущий тариф временно берём первый
  const currentTariff = tariffPlans[0];

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
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <span><strong>Баланс:</strong> {balanceLoading ? '...' : `${balance} ₽`}</span>
          <button className="custom-main-button" onClick={handleTopUp} disabled={balanceLoading}>
            Пополнить
          </button>
        </div>
      </div>

      {activeTab === 'plan' ? (
        <>
          <div className="plan-card">
            <h3 className="plan-main-title">Единый тариф — безлимитный функционал</h3>
            {!subLoading && subscription && (
              <p className="plan-status">
                {subscription.status === 'expired'
                  ? 'Подписка истекла'
                  : subscription.status === 'trial'
                    ? `Демо, осталось ${remainingDays} ${pluralize(remainingDays, ['день', 'дня', 'дней'])}`
                    : `Подписка активна, осталось ${remainingDays} ${pluralize(remainingDays, ['день', 'дня', 'дней'])}`}
              </p>
            )}
            <div className="plan-features">
              {planFeatures.map((group, idx) => (
                <div className="plan-category" key={group.category}>
                  <div className="plan-category-left">
                    <span className="plan-category-number">{`${idx + 1}`.padStart(2, '0')}</span>
                    <span className="plan-category-title">{group.category}</span>
                  </div>
                  <ul className="plan-feature-list">
                    {group.items.map((item) => (
                      <li key={item}>
                        <span className="plan-check">✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="plan-price">
              <span className="plan-price-value">6 900 ₽ / месяц</span>
            </div>
          </div>
        </>
      ) : (
        <div className="payment-history">
          <h3>История платежей</h3>
          {paymentsLoading ? (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '200px',
              }}
            >
              <Loader2 className="spinner" size={32} strokeWidth={1.4} />
            </div>
          ) : payments.length ? (
            <CustomTable columns={paymentHistoryColumns} rows={payments} />
          ) : (
            <p>Здесь появится история ваших платежей.</p>
          )}
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
