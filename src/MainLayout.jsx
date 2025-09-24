import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, matchPath, useLocation, useNavigate, useParams } from 'react-router-dom';

import Header from './components/Header';
import Sidebar from './components/Sidebar';
import SubMenu from './components/SubMenu';
import CustomModal from './customs/CustomModal';
import Footer from './pages/Footer';
import { fetchCards, initializeCards, updateCurrentCardField } from './store/cardsSlice';

const MainLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();

  const subscription = useSelector((state) => state.subscription.info);
  const currentCard = useSelector((state) => state.cards.currentCard);

  const trialExpired = useMemo(() => {
    const s = String(subscription?.status || '').toLowerCase();
    const d = Number(subscription?.days_left ?? 0);
    return s === 'trial' && d <= 0;
  }, [subscription?.status, subscription?.days_left]);

  const isTemplatePage = location.pathname === '/cards/template';

  const hideLayout = ['/auth'].includes(location.pathname);
  const matchCreate = matchPath('/cards/create', location.pathname);
  const matchEdit = matchPath('/cards/:id/edit/*', location.pathname);
  const matchCardDetails =
    matchPath('/cards/:id/*', location.pathname) &&
    !location.pathname.startsWith('/cards/template');
  const matchMailings = matchPath('/mailings/*', location.pathname);
  const matchSettings = matchPath('/settings/*', location.pathname);
  const matchClientsRoot = matchPath({ path: '/clients', end: true }, location.pathname);
  const matchClientsReviews = matchPath('/clients/reviews', location.pathname);
  const matchScan = matchPath('/scan', location.pathname);
  const matchClientsRfm = matchPath('/clients/rfm-segment', location.pathname);
  const matchClientDetails = matchPath('/clients/:id/*', location.pathname);
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

  const prevPathRef = useRef(location.pathname);
  const skipNextGuardRef = useRef(false);
  const [leaveModalOpen, setLeaveModalOpen] = useState(false);
  const pendingNextRef = useRef(null);

  const isEditorPath = (p) => p.startsWith('/cards/create') || /^\/cards\/[^/]+\/edit\//.test(p);

  const isCreatePath = (p) => p.startsWith('/cards/create');

  const isCreateIncomplete = !(
    currentCard?.typeReady &&
    currentCard?.designReady &&
    currentCard?.settingsReady &&
    currentCard?.infoReady
  );

  useLayoutEffect(() => {
    const prev = prevPathRef.current;
    const next = location.pathname;

    // пропускаем одно срабатывание (после возврата)
    if (skipNextGuardRef.current) {
      skipNextGuardRef.current = false;
      prevPathRef.current = next;
      return;
    }

    // Проверяем переход между страницами одной карты (info -> edit)
    const prevCardMatch = prev.match(/^\/cards\/([^/]+)\/info$/);
    const nextCardMatch = next.match(/^\/cards\/([^/]+)\/edit\//);
    const isSameCardTransition = prevCardMatch && nextCardMatch && prevCardMatch[1] === nextCardMatch[1];

    // Не показывать leave guard при переходе из edit/integration (завершающий шаг редактирования)
    const isCompletingEdit = prev.match(/^\/cards\/[^/]+\/edit\/integration$/);

    if (isEditorPath(prev) && !isEditorPath(next) && !isSameCardTransition && !isCompletingEdit) {
      const leavingCreate = isCreatePath(prev);
      const shouldAsk = (leavingCreate && isCreateIncomplete) || !leavingCreate; // из edit — всегда

      if (shouldAsk) {
        pendingNextRef.current = next;
        skipNextGuardRef.current = true;

        navigate(prev, { replace: true });

        setLeaveModalOpen(true);

        return;
      }
    }

    prevPathRef.current = next;
  }, [location.pathname, isCreateIncomplete, navigate]);

  const confirmLeave = () => {
    const target = pendingNextRef.current || '/cards';
    pendingNextRef.current = null;
    setLeaveModalOpen(false);
    skipNextGuardRef.current = true;
    navigate(target);
  };

  const cancelLeave = () => {
    pendingNextRef.current = null;
    setLeaveModalOpen(false);
  };

  if (hideLayout) {
    return <Outlet />;
  }

  const getMenuItems = () => {
    if (matchCreate || matchEdit) {
      const base = matchCreate ? '/cards/create' : `/cards/${id}/edit`;
      const firstStepTo = matchCreate ? `${base}` : `${base}/type`;

      // вычисляем текущий шаг
      const stepOrder = ['type', 'design', 'settings', 'info', 'integration'];
      const getCurrentStepIdx = () => {
        if (matchCreate) {
          if (location.pathname === base) return 0;
          const found = stepOrder.findIndex((s) => location.pathname.startsWith(`${base}/${s}`));
          return found >= 0 ? found : 0;
        }
        const found = stepOrder.findIndex((s) => location.pathname.startsWith(`${base}/${s}`));
        return found >= 0 ? found : 0;
      };
      const curIdx = getCurrentStepIdx();

      const readyByStep = {
        type: true,
        design: !!currentCard?.typeReady,
        settings: !!currentCard?.designReady,
        info: !!currentCard?.settingsReady,
        integration: !!currentCard?.infoReady,
      };

      const items = [
        { to: firstStepTo, label: '1. Тип карты', key: 'type' },
        {
          to: `${base}/design`,
          label: '2. Дизайн карты',
          key: 'design',
          tooltip: 'Сначала выберите тип карты',
        },
        {
          to: `${base}/settings`,
          label: '3. Настройки карты',
          key: 'settings',
          tooltip: 'Сначала настройте дизайн',
        },
        {
          to: `${base}/info`,
          label: '4. Оборотная сторона карты',
          key: 'info',
          tooltip: 'Сначала заполните настройки',
        },
        {
          to: `${base}/integration`,
          label: '5. Интеграции',
          key: 'integration',
          tooltip: 'Сначала заполните оборотную сторону',
        },
      ];

      // блокируем только шаги ВПЕРЁД, если текущий шаг ещё не готов
      return items.map((it, idx) => ({
        to: it.to,
        label: it.label,
        tooltip: it.tooltip,
        disabled: idx > curIdx && !readyByStep[it.key],
      }));
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
      ];
    }

    if (matchClientDetails) {
      const base = `/clients/${id}`;
      return [
        { to: `${base}`, label: 'Профиль' },
        { to: `${base}/push`, label: 'Отправить push' },
        { to: `${base}/edit`, label: 'Персональная информация' },
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
        matchClientsReviews ||
        matchScan) && (
        <div style={lockStyle}>
          <SubMenu
            menuItems={getMenuItems()}
            showRightActions={!!matchEdit || !!matchCreate}
            showDownloadTable={!!matchClientsRoot}
            showNameInput={!!matchEdit || !!matchCreate}
            initialName={currentCard?.name || ''}
            onNameChange={(newName) => {
              dispatch(updateCurrentCardField({ path: 'name', value: newName }));
            }}
            allowEditButton={!!matchCardDetails}
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

      <CustomModal
        open={leaveModalOpen}
        onClose={cancelLeave}
        title="Вы ещё не завершили редактирование"
        maxWidth={480}
        closeOnOverlayClick={false}
        actions={
          <>
            <CustomModal.SecondaryButton onClick={cancelLeave}>
              Вернуться к карте
            </CustomModal.SecondaryButton>
            <CustomModal.PrimaryButton onClick={confirmLeave}>Выйти</CustomModal.PrimaryButton>
          </>
        }
      >
        Хотите продолжить или выйти без сохранения?
      </CustomModal>
    </div>
  );
};

export default MainLayout;
