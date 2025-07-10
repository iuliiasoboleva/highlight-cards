import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Navigate,
  Outlet,
  Route,
  BrowserRouter as Router,
  Routes,
  matchPath,
  useLocation,
  useParams,
} from 'react-router-dom';

import { Mail, Pencil, SettingsIcon, Users } from 'lucide-react';

import AuthForm from './components/AuthForm';
import Header from './components/Header';
import NotFound from './components/NotFound';
import ScrollToTop from './components/ScrollToTop';
import Sidebar from './components/Sidebar';
import SubMenu from './components/SubMenu';
import AuthLayout from './layouts/AuthLayout';
import AuthRedirectGuard from './pages/AuthRedirectGuard';
import CardDetails from './pages/CardDetails';
import CardStats from './pages/CardStats';
import Cards from './pages/Cards';
import ClientDetails from './pages/ClientDetails';
import Clients from './pages/Clients';
import ClientsLayout from './pages/ClientsLayout';
import CustomerPage from './pages/CustomerPage';
import DefaultCardInfo from './pages/DefaultCardInfo';
import EditDesign from './pages/EditDesign';
import EditInfo from './pages/EditInfo';
import EditSettings from './pages/EditSettings';
import EditType from './pages/EditType';
import Footer from './pages/Footer';
import Home from './pages/Home';
import Locations from './pages/Locations';
import LoginVerify from './pages/LoginVerify';
import MailingDetails from './pages/MailingDetails';
import Mailings from './pages/Mailings';
import MailingsAutoPush from './pages/MailingsAutoPush';
import MailingsInfo from './pages/MailingsInfo';
import MailingsPush from './pages/MailingsPush';
import MailingsSettings from './pages/MailingsSettings';
import MailingsUserPush from './pages/MailingsUserPush';
import Managers from './pages/Managers';
import PersonalClientInfo from './pages/PersonalClientInfo';
import ResetPin from './pages/ResetPin';
import ScanPage from './pages/ScanPage';
import SetPin from './pages/SetPin';
import Settings from './pages/Settings';
import SettingsLayout from './pages/SettingsLayout';
import SettingsPersonal from './pages/SettingsPersonal';
import SettingsRFMSegment from './pages/SettingsRFMSegment';
import SmsLogin from './pages/SmsLogin';
import Workplace from './pages/Workplace';
import { fetchCards, initializeCards, updateCurrentCardField } from './store/cardsSlice';

const MainLayout = () => {
  const location = useLocation();
  const { id } = useParams();
  const dispatch = useDispatch();
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
  const matchClientDetails = matchPath('/clients/:id/*', location.pathname);

  const currentCard = useSelector((state) => state.cards.currentCard);

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
      matchClientDetails;

    root.style.setProperty('--bar-height', showSubMenu ? '73px' : '0px');
  }, [location.pathname]);

  if (hideLayout) {
    return <Outlet />;
  }

  const getSubMenuIcon = () => {
    if (matchCreate || matchEdit) return Pencil;
    if (matchMailings) return Mail;
    if (matchSettings) return SettingsIcon;
    if (matchCardDetails || matchClientsRoot || matchClientsReviews || matchClientDetails)
      return Users;
    return null;
  };

  const getMenuItems = () => {
    if (matchCreate) {
      const base = '/cards/create';
      const tooltipText = 'Выберите тип карты, чтобы продолжить';

      return [
        { to: `${base}`, label: 'Тип карты' },
        { to: `${base}/settings`, label: 'Настройки', disabled: true, tooltip: tooltipText },
        { to: `${base}/design`, label: 'Дизайн', disabled: true, tooltip: tooltipText },
        { to: `${base}/info`, label: 'Информация', disabled: true, tooltip: tooltipText },
      ];
    }

    if (matchEdit) {
      const base = `/cards/${id}/edit`;
      return [
        { to: `${base}/type`, label: 'Тип карты' },
        { to: `${base}/settings`, label: 'Настройки' },
        { to: `${base}/design`, label: 'Дизайн' },
        { to: `${base}/info`, label: 'Информация' },
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
        { to: `/mailings/push`, label: 'Отправить push' },
        { to: `/mailings/auto-push`, label: 'Автоматизация push' },
        { to: `/mailings/user-push`, label: 'Пользовательские авто-push' },
        // { to: `/mailings/settings`, label: 'Настройки' },
        { to: `/mailings/rfm-segment`, label: 'Сегментация клиентов' },
      ];
    }

    if (matchSettings) {
      return [
        { to: `/settings`, label: 'Тарифный план' },
        { to: `/settings/personal`, label: 'Персональные настройки' },
      ];
    }

    if (matchClientsRoot || matchClientsReviews) {
      return [
        { to: `/clients`, label: 'Клиенты' },
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
        matchClientsReviews) && (
        <SubMenu
          menuItems={getMenuItems()}
          icon={getSubMenuIcon()}
          showRightActions={matchEdit || matchCreate}
          showNameInput={!!matchEdit || !!matchCreate}
          initialName={currentCard?.name || ''}
          onNameChange={(newName) => {
            dispatch(updateCurrentCardField({ path: 'name', value: newName }));
          }}
        />
      )}
      <div className="main">
        <Sidebar />
        <div className="page-content">
          <Outlet />
          <Footer />
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const user = useSelector((state) => state.user);

  return (
    <Router>
      <ScrollToTop />
      <AuthRedirectGuard>
        <Routes>
          <Route
            path="/auth"
            element={
              <AuthLayout>
                <AuthForm />
              </AuthLayout>
            }
          />
          <Route path="/login" element={<LoginVerify />} />
          <Route path="/reset-pin" element={<ResetPin />} />
          <Route path="/sms-code" element={<SmsLogin />} />
          <Route path="/set-pin" element={<SetPin />} />
          <Route element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="/cards" element={<Cards />} />
            <Route path="/scan" element={<ScanPage />} />
            <Route path="/workplace" element={<Workplace />} />

            <Route path="/cards/create" element={<EditType />} />
            <Route path="/cards/template" element={<Cards />} />
            <Route path="/mailings" element={<Mailings />}>
              <Route path="info" element={<MailingsInfo />} />
              <Route path="push" element={<MailingsPush />} />
              <Route path="auto-push" element={<MailingsAutoPush />} />
              <Route path="user-push" element={<MailingsUserPush />} />
              <Route path="settings" element={<MailingsSettings />} />
              <Route path="rfm-segment" element={<SettingsRFMSegment />} />
              <Route path=":mailingId" element={<MailingDetails />} />
            </Route>
            <Route path="/cards/:id/edit" element={<CardEditGuard />}>
              <Route path="type" element={<EditType />} />
              <Route path="settings" element={<EditSettings />} />
              <Route path="design" element={<EditDesign />} />
              <Route path="info" element={<EditInfo />} />
            </Route>
            <Route path="/settings" element={<Settings />} />
            <Route path="/settings" element={<SettingsLayout />}>
              <Route path="personal" element={<SettingsPersonal />} />
            </Route>
            <Route path="/cards/:id" element={<CardDetails />}>
              <Route path="info" element={<DefaultCardInfo />} />
              <Route path="clients" element={<Clients />} />
              <Route path="push" element={<MailingsPush />} />
              <Route path="stats" element={<CardStats />} />
            </Route>
            <Route
              path="/managers"
              element={user.role === 'employee' ? <Workplace /> : <Managers />}
            />
            <Route path="/locations" element={<Locations />} />
            <Route path="/clients" element={<ClientsLayout />}>
              <Route index element={<Clients />} />
              <Route path="reviews" element={<NotFound />} />
              <Route path=":id" element={<ClientDetails />} />
              <Route path=":id/push" element={<MailingsPush />} />
              <Route path=":id/edit" element={<PersonalClientInfo />} />
              <Route path=":id/reviews" element={<NotFound />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Route>
          <Route path="/customer/card/:cardNumber" element={<CustomerPage />} />
        </Routes>
      </AuthRedirectGuard>
    </Router>
  );
};

export default App;

const CardEditGuard = () => {
  const params = useParams();
  const currentId = useSelector((state) => state.cards.currentCard?.id);

  if (!params.id) {
    return <Navigate to="/cards" replace />;
  }

  if (!currentId || String(currentId) !== params.id) {
    return <Navigate to="/cards" replace />;
  }

  return <Outlet />;
};
