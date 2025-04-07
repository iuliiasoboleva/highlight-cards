import React, { useState } from 'react';
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

import AuthForm from './components/AuthForm';
import Header from './components/Header';
import NotFound from './components/NotFound';
import Sidebar from './components/Sidebar';
import SubMenu from './components/SubMenu';
import Tabs from './components/Tabs';
import AuthLayout from './layouts/AuthLayout';
import { mockCards } from './mocks/cardData';
import CardDetails from './pages/CardDetails';
import Cards from './pages/Cards';
import Clients from './pages/Clients';
import ClientsTab from './pages/ClientsTab';
import CustomerPage from './pages/CustomerPage';
import DefaultCardInfo from './pages/DefaultCardInfo';
import EditDesign from './pages/EditDesign';
import EditInfo from './pages/EditInfo';
import EditSettings from './pages/EditSettings';
import EditType from './pages/EditType';
import Home from './pages/Home';
import Locations from './pages/Locations';
import Mailings from './pages/Mailings';
import MailingsAutoPush from './pages/MailingsAutoPush';
import MailingsInbox from './pages/MailingsInbox';
import MailingsInfo from './pages/MailingsInfo';
import MailingsPush from './pages/MailingsPush';
import MailingsSettings from './pages/MailingsSettings';
import MailingsUserPush from './pages/MailingsUserPush';
import Managers from './pages/Managers';
import PushTab from './pages/PushTab';
import ScanPage from './pages/ScanPage';
import Settings from './pages/Settings';
import SettingsLayout from './pages/SettingsLayout';
import SettingsPersonal from './pages/SettingsPersonal';
import SettingsRFMSegment from './pages/SettingsRFMSegment';
import StatsTab from './pages/StatsTab';

const MainLayout = () => {
  const location = useLocation();
  const { id } = useParams();

  const hideLayout = ['/login', '/register', '/scan'].includes(location.pathname);
  const matchCreate = matchPath('/cards/create', location.pathname);
  const matchEdit = matchPath('/cards/:id/edit/*', location.pathname);
  const matchCardDetails = matchPath('/cards/:id/*', location.pathname);
  const matchMailings = matchPath('/mailings/*', location.pathname);
  const matchSettings = matchPath('/settings/*', location.pathname);

  const currentCard = mockCards.find((c) => c.id === parseInt(matchEdit?.params?.id));

  if (hideLayout) {
    return <Outlet />;
  }

  const getMenuItems = () => {
    if (matchCreate) {
      const base = '/cards/create';
      return [
        { to: `${base}`, label: 'Тип карты' },
        { to: `${base}/settings`, label: 'Настройки', disabled: true },
        { to: `${base}/design`, label: 'Дизайн', disabled: true },
        { to: `${base}/info`, label: 'Информация', disabled: true },
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
        { to: `/mailings/inbox`, label: 'Входящие' },
        { to: `/mailings/push`, label: 'Отправить push' },
        { to: `/mailings/auto-push`, label: 'Автоматизация push' },
        { to: `/mailings/user-push`, label: 'Пользовательские авто-push' },
        { to: `/mailings/settings`, label: 'Настройки' },
      ];
    }

    if (matchSettings) {
      return [
        { to: `/settings`, label: 'Тарифный план' },
        { to: `/settings/personal`, label: 'Персональные настройки' },
        { to: `/settings/rfm-segment`, label: 'RFM' },
      ];
    }

    return [];
  };

  return (
    <div className="app">
      <Header />
      {(matchEdit || matchCreate || matchCardDetails || matchMailings || matchSettings) && (
        <SubMenu
          menuItems={getMenuItems()}
          showNameInput={!!matchEdit || !!matchCreate}
          initialName={currentCard?.name || ''}
          onNameChange={(newName) => {
            if (currentCard) currentCard.name = newName;
          }}
        />
      )}
      <div className="main">
        <Sidebar />
        <div className="page-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [newCardType, setNewCardType] = useState(null);

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            <AuthLayout>
              <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
              <AuthForm type="login" />
            </AuthLayout>
          }
        />
        <Route
          path="/register"
          element={
            <AuthLayout>
              <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
              <AuthForm type="register" />
            </AuthLayout>
          }
        />
        <Route element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="/cards" element={<Cards />} />
          <Route path="/scan" element={<ScanPage />} />

          <Route
            path="/cards/create"
            element={<EditType setType={setNewCardType} cardType={newCardType} />}
          />
          <Route path="/cards/template" element={<Cards />} />
          <Route path="/mailings" element={<Mailings />}>
            <Route path="info" element={<MailingsInfo />} />
            <Route path="inbox" element={<MailingsInbox />} />
            <Route path="push" element={<MailingsPush />} />
            <Route path="auto-push" element={<MailingsAutoPush />} />
            <Route path="user-push" element={<MailingsUserPush />} />
            <Route path="settings" element={<MailingsSettings />} />
          </Route>
          <Route path="/cards/:id/edit" element={<CardEditGuard />}>
            <Route
              path="type"
              element={<EditType setType={setNewCardType} cardType={newCardType} />}
            />
            <Route path="settings" element={<EditSettings cardType={newCardType} />} />
            <Route path="design" element={<EditDesign />} />
            <Route path="info" element={<EditInfo />} />
          </Route>
          <Route path="/settings" element={<Settings />} />
          <Route path="/settings" element={<SettingsLayout />}>
            <Route path="personal" element={<SettingsPersonal />} />
            <Route path="rfm-segment" element={<SettingsRFMSegment />} />
          </Route>
          <Route path="/cards/:id" element={<CardDetails />}>
            <Route index element={<DefaultCardInfo />} />
            <Route path="info" element={<DefaultCardInfo />} />
            <Route path="clients" element={<ClientsTab />} />
            <Route path="push" element={<PushTab />} />
            <Route path="stats" element={<StatsTab />} />
          </Route>
          <Route path="/managers" element={<Managers />} />
          <Route path="/locations" element={<Locations />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="/customer/:id" element={<CustomerPage />} />
      </Routes>
    </Router>
  );
};

export default App;

const CardEditGuard = () => {
  const params = useParams();

  if (!params.id) {
    return <Navigate to="/cards/create" replace />;
  }

  return <Outlet />;
};
