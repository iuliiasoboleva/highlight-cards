// components/Breadcrumbs.js
import React from 'react';
import { Link, matchPath, useLocation } from 'react-router-dom';

import './styles.css';

const breadcrumbNameMap = {
  '/': 'Главная',
  '/cards': 'Карты',
  '/cards/create': 'Создание карты',
  '/cards/template': 'Шаблоны карт',
  '/clients': 'Клиенты',
  '/mailings': 'Рассылки',
  '/mailings/info': 'Информация',
  '/mailings/push': 'Отправить push',
  '/mailings/auto-push': 'Авто push',
  '/mailings/user-push': 'Пользовательские push',
  '/mailings/settings': 'Настройки рассылок',
  '/mailings/rfm-segment': 'RFM-сегментация',
  '/settings': 'Настройки',
  '/settings/personal': 'Персональные',
  '/managers': 'Менеджеры',
  '/locations': 'Локации',
  '/customer': 'Клиент',
  '/scan': 'Сканирование',
};

const dynamicBreadcrumbs = {
  '/cards/:id': (params) => `Карта ${params.id}`,
  '/cards/:id/edit': (params) => `Редактирование ${params.id}`,
  '/cards/:id/edit/type': (params) => 'Тип карты',
  '/cards/:id/edit/settings': (params) => 'Настройки',
  '/cards/:id/edit/design': (params) => 'Дизайн',
  '/cards/:id/edit/info': (params) => 'Информация',
  '/cards/:id/info': (params) => 'Информация',
  '/cards/:id/clients': (params) => 'Клиенты',
  '/cards/:id/push': (params) => 'Push-уведомления',
  '/cards/:id/stats': (params) => 'Статистика',
  '/customer/:id': (params) => `Клиент ${params.id}`,
};

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // Проверяем динамические маршруты
  const getDynamicBreadcrumb = (path) => {
    for (const [route, fn] of Object.entries(dynamicBreadcrumbs)) {
      const match = matchPath(route, path);
      if (match) {
        return fn(match.params);
      }
    }
    return null;
  };

  return (
    <nav className="breadcrumbs">
      <Link to="/">Главная</Link>
      {pathnames.map((_, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;

        // Проверяем динамические хлебные крошки
        const dynamicName = getDynamicBreadcrumb(to);
        const displayName =
          dynamicName || breadcrumbNameMap[to] || decodeURIComponent(pathnames[index]);

        return isLast ? (
          <span key={to}>
            {' '}
            {'>'} {displayName}
          </span>
        ) : (
          <span key={to}>
            {' '}
            {'>'} <Link to={to}>{displayName}</Link>
          </span>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;
