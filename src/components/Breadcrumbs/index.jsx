import React from 'react';
import { Link, useLocation } from 'react-router-dom';
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
  '/mailings/rfm-segment': 'Сегментация клиентов',
  '/settings': 'Настройки',
  '/settings/personal': 'Персональные',
  '/managers': 'Менеджеры',
  '/locations': 'Локации',
  '/customer': 'Клиент',
  '/scan': 'Сканирование',
  '/cards/:id/edit/type': 'Тип карты',
  '/cards/:id/edit/settings': 'Настройки',
  '/cards/:id/edit/design': 'Дизайн',
  '/cards/:id/edit/info': 'Информация',
  '/cards/:id/info': 'Информация',
  '/cards/:id/clients': 'Клиенты',
  '/cards/:id/push': 'Push-уведомления',
  '/cards/:id/stats': 'Статистика',
};

const matchPathToName = (path) => {
  if (breadcrumbNameMap[path]) return breadcrumbNameMap[path];

  for (const pattern in breadcrumbNameMap) {
    const patternParts = pattern.split('/');
    const pathParts = path.split('/');

    if (patternParts.length !== pathParts.length) continue;

    const isMatch = patternParts.every((part, i) =>
      part.startsWith(':') || part === pathParts[i]
    );

    if (isMatch) return breadcrumbNameMap[pattern];
  }

  return null;
};

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  const breadcrumbs = [{ name: 'Главная', path: '/' }];

  for (let i = 0; i < pathnames.length; i++) {
    const currentPath = `/${pathnames.slice(0, i + 1).join('/')}`;
    const name = matchPathToName(currentPath);
    if (name) {
      breadcrumbs.push({ name, path: currentPath });
    }
  }

  return (
    <nav className="breadcrumbs">
      {breadcrumbs.map((crumb, index) => {
        const isLast = index === breadcrumbs.length - 1;
        return (
          <span key={crumb.path}>
            {index !== 0 && ' > '}
            {isLast ? (
              <span>{crumb.name}</span>
            ) : (
              <Link to={crumb.path}>{crumb.name}</Link>
            )}
          </span>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;
