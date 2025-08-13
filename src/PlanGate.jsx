import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

/** Защита маршрутов: если триал истёк — пускаем только на /settings (root) и auth-потоки */
const PlanGate = () => {
  const subscription = useSelector((s) => s.subscription.info);
  const location = useLocation();

  const status = String(subscription?.status || '').toLowerCase();
  const daysLeft = Number(subscription?.days_left ?? 0);
  const expired =
    (status === 'trial' && daysLeft <= 0) || status === 'expired' || status === 'unpaid';

  const p = location.pathname;
  const isAuthFlow =
    p.startsWith('/auth') ||
    p.startsWith('/login') ||
    p.startsWith('/sms-code') ||
    p.startsWith('/set-pin') ||
    p.startsWith('/reset-pin');

  // !!! Разрешаем ТОЛЬКО РОВНО /settings (или /settings/)
  const isSettingsRoot = p === '/settings' || p === '/settings/';

  if (expired && !isAuthFlow && !isSettingsRoot) {
    return <Navigate to="/settings" replace />;
  }
  return <Outlet />;
};

export default PlanGate;
