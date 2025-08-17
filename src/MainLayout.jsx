import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, matchPath, useLocation, useParams } from 'react-router-dom';

import { Mail, Pencil, SettingsIcon, Users } from 'lucide-react';

import Header from './components/Header';
import Sidebar from './components/Sidebar';
import SubMenu from './components/SubMenu';
import Footer from './pages/Footer';
import { fetchCards, initializeCards, updateCurrentCardField } from './store/cardsSlice';

const MainLayout = () => {
  const location = useLocation();
  const { id } = useParams();
  const dispatch = useDispatch();
  const subscription = useSelector((state) => state.subscription.info);

  const trialExpired = React.useMemo(() => {
    const s = String(subscription?.status || '').toLowerCase();
    const d = Number(subscription?.days_left ?? 0);
    return s === 'trial' && d <= 0;
  }, [subscription?.status, subscription?.days_left]);

  const isTemplatePage = location.pathname === '/cards/template';

  const hideLayout = ['/scan', '/auth'].includes(location.pathname);
  const matchCreate = matchPath('/cards/create', location.pathname);
  const matchEdit = matchPath('/cards/:id/edit/*', location.pathname);
  const matchCardDetails =
    matchPath('/cards/:id/*', location.pathname) &&
    !location.pathname.startsWith('/cards/template');
  const matchMailings = matchPath('/mailings/*', location.pathname);
  const matchSettings = matchPath('/settings/*', location.pathname);
  const matchClientsRoot = matchPath({ path: '/clients', end: true }, location.pathname);
  const matchClientsReviews = matchPath('/clients/reviews', location.pathname);
  const matchClientsRfm = matchPath('/clients/rfm-segment', location.pathname);
  const matchClientDetails = matchPath('/clients/:id/*', location.pathname);

  const currentCard = useSelector((state) => state.cards.currentCard);

  const isEditFlow = !!matchEdit;

  // 1) выбран тип карты?
  const typeDone = isEditFlow && Boolean(currentCard?.typeReady);

  // 2) настроен дизайн?
  const designDone = isEditFlow && Boolean(currentCard?.designReady);

  // 3) заполнены настройки?
  const settingsDone = isEditFlow && Boolean(currentCard?.settingsReady);

  useEffect(() => {
    if (isTemplatePage) {
      dispatch(initializeCards({ useTemplates: true }));
    } else {
      dispatch(fetchCards());
    }
  }, [dispatch, isTemplatePage]);

  useEffect(() => {
    const root = document.documentElement;
    const showSubMenu =
      matchEdit ||
      matchCreate ||
      matchCardDetails ||
      matchMailings ||
      matchSettings ||
      matchClientsRoot ||
      matchClientsReviews ||
      matchClientsRfm ||
      matchClientDetails;

    root.style.setProperty('--bar-height', showSubMenu ? '73px' : '0px');
  }, [
    location.pathname,
    matchCreate,
    matchEdit,
    matchCardDetails,
    matchMailings,
    matchSettings,
    matchClientsRoot,
    matchClientsReviews,
    matchClientsRfm,
    matchClientDetails,
  ]);

  if (hideLayout) {
    return <Outlet />;
  }

  const getMenuItems = () => {
    if (matchCreate) {
      const base = '/cards/create';

      return [
        { to: `${base}`, label: '1. Тип карты' },
        {
          to: `${base}/design`,
          label: '2. Дизайн карты',
          disabled: !typeDone,
          tooltip: 'Сначала выберите тип карты',
        },
        {
          to: `${base}/settings`,
          label: '3. Настройки карты',
          disabled: !designDone,
          tooltip: 'Сначала настройте дизайн',
        },
        {
          to: `${base}/info`,
          label: '4. Оборотная сторона карты',
          disabled: !settingsDone,
          tooltip: 'Сначала заполните настройки',
        },
      ];
    }

    if (matchEdit) {
      const base = `/cards/${id}/edit`;
      return [
        { to: `${base}`, label: '1. Тип карты' },
        { to: `${base}/design`, label: '2. Дизайн карты' },
        { to: `${base}/settings`, label: '3. Настройки карты' },
        { to: `${base}/info`, label: '4. Оборотная сторона карты' },
      ];
    }

    if (matchCardDetails) {
      const base = `/cards/${id}`;
      return [
        { to: `${base}/info`, label: 'Информация' },
        { to: `${base}/clients`, label: 'Клиенты' },
        { to: `${base}/push`, label: 'Отправить push' },
        { to: `${base}/stats`, label: 'Статистика' },
      ];
    }

    if (matchMailings) {
      return [
        { to: `/mailings/info`, label: 'Рассылки' },
        { to: `/mailings/push`, label: 'Создать push-рассылку' },
        { to: `/mailings/auto-push`, label: 'Автоматизация push' },
        { to: `/mailings/user-push`, label: 'Пользовательские авто-push' },
        // { to: `/mailings/settings`, label: 'Настройки' },
        { to: `/mailings/archive`, label: 'История рассылок' },
      ];
    }

    if (matchSettings) {
      return [
        { to: `/settings`, label: 'Подписка' },
        { to: `/settings/archive`, label: 'История платежей' },
      ];
    }

    if (matchClientsRoot || matchClientsReviews || matchClientsRfm) {
      return [
        { to: `/clients`, label: 'Клиентская база' },
        { to: `/clients/rfm-segment`, label: 'Сегментация клиентов' },
        // { to: `/clients/reviews`, label: 'Отзывы' },
      ];
    }

    if (matchClientDetails) {
      const base = `/clients/${id}`;

      return [
        { to: `${base}`, label: 'Профиль' },
        { to: `${base}/push`, label: 'Отправить push' },
        { to: `${base}/edit`, label: 'Персональная информация' },
        // { to: `${base}/reviews`, label: 'Отзывы' },
      ];
    }

    return [];
  };

  // Глобально блокируем клики по меню при истёкшем триале
  const lockNav = trialExpired;
  const lockStyle = lockNav ? { pointerEvents: 'none', opacity: 0.6 } : undefined;

  return (
    <div className="app">
      <Header />

      {(matchEdit ||
        matchCreate ||
        matchCardDetails ||
        matchMailings ||
        matchSettings ||
        matchClientsRoot ||
        matchClientDetails ||
        matchClientsRfm ||
        matchClientsReviews) && (
        <div style={lockStyle}>
          <SubMenu
            menuItems={getMenuItems()}
            showRightActions={matchEdit || matchCreate}
            showDownloadTable={matchClientsRoot}
            showNameInput={!!matchEdit || !!matchCreate}
            initialName={currentCard?.name || ''}
            onNameChange={(newName) => {
              dispatch(updateCurrentCardField({ path: 'name', value: newName }));
            }}
          />
        </div>
      )}

      <div className="main">
        <div style={lockStyle}>
          <Sidebar />
        </div>

        <div className="page-content">
          <Outlet />
          <Footer />
        </div>
      </div>
    </div>
  );
};
export default MainLayout;
