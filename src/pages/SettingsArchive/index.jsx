import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Loader2 } from 'lucide-react';

import CustomTable from '../../components/CustomTable';
import GeoBadge from '../../components/GeoBadge';
import LoaderCentered from '../../components/LoaderCentered';
import { fetchPayments } from '../../store/paymentsSlice';
import { PaymentHistory, SettingsContainer, SpinnerBox } from './styles';

const SettingsArchive = () => {
  const dispatch = useDispatch();

  const { plans: tariffPlans, loading } = useSelector((state) => state.tariffs);
  const { list: payments = [], loading: paymentsLoading = true } = useSelector(
    (state) => state.payments || {},
  );
  const { organization_id: orgId, id: userId } = useSelector((state) => state.user);

  useEffect(() => {
    if (!payments.length) {
      const id = orgId || 1;
      dispatch(fetchPayments({ orgId: id, userId }));
    }
  }, [dispatch, payments.length, orgId, userId]);

  const paymentHistoryColumns = [
    {
      key: 'paid_at',
      title: 'Дата',
      className: 'text-center',
      render: (row) => new Date(row.paid_at).toLocaleDateString(),
    },
    { key: 'amount', title: 'Сумма', className: 'text-center', render: (row) => `${row.amount} ₽` },
    { key: 'plan_name', title: 'Тарифный план', className: 'text-center' },
    {
      key: 'status',
      title: 'Статус',
      className: 'text-center',
      render: (row) => (
        <span className={`status-badge ${row.status === 'Успешно' ? 'success' : ''}`}>
          {row.status}
        </span>
      ),
    },
  ];

  if (loading) return <LoaderCentered />;

  if (!tariffPlans.length)
    return (
      <SettingsContainer>
        <p>Тарифы не найдены</p>
      </SettingsContainer>
    );

  return (
    <SettingsContainer>
      <PaymentHistory>
        <GeoBadge title="История платежей" />
        {paymentsLoading ? (
          <SpinnerBox>
            <Loader2 className="spinner" size={32} strokeWidth={1.4} />
          </SpinnerBox>
        ) : payments.length ? (
          <CustomTable columns={paymentHistoryColumns} rows={payments} />
        ) : (
          <p>Здесь появится история ваших платежей.</p>
        )}
      </PaymentHistory>
    </SettingsContainer>
  );
};

export default SettingsArchive;
