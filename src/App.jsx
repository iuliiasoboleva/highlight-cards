import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation, Outlet, matchPath, useParams, Navigate } from 'react-router-dom';
import AuthLayout from './layouts/AuthLayout';
import Home from './pages/Home';
import Settings from './pages/Settings';
import Cards from './pages/Cards';
import CardDetails from './pages/CardDetails';
import DefaultCardInfo from './pages/DefaultCardInfo';
import ClientsTab from './pages/ClientsTab';
import PushTab from './pages/PushTab';
import StatsTab from './pages/StatsTab';
import EditType from './pages/EditType';
import NotFound from './components/NotFound';
import Tabs from './components/Tabs';
import AuthForm from './components/AuthForm';
import SubMenu from './components/SubMenu';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import { mockCards } from './mocks/cardData';
import EditSettings from './pages/EditSettings';
import EditDesign from './pages/EditDesign';
import EditInfo from './pages/EditInfo';
import ScanPage from './pages/ScanPage';

const MainLayout = () => {
  const location = useLocation();
  const { id } = useParams();

  const hideLayout = ['/login', '/register'].includes(location.pathname);
  const matchCreate = matchPath('/cards/create', location.pathname);
  const matchEdit = matchPath('/cards/:id/edit/*', location.pathname);
  const matchCardDetails = matchPath('/cards/:id/*', location.pathname);

  const currentCard = mockCards.find(c => c.id === parseInt(matchEdit?.params?.id));

  if (hideLayout) {
    return <Outlet />;
  }

  const getMenuItems = () => {
    if (matchEdit || matchCreate) return [
      { path: 'type', label: 'Тип карты' },
      { path: 'settings', label: 'Настройки' },
      { path: 'design', label: 'Дизайн' },
      { path: 'info', label: 'Информация' }
    ];

    if (matchCardDetails) return [
      { path: 'info', label: 'Информация' },
      { path: 'clients', label: 'Клиенты' },
      { path: 'push', label: 'Отправить push' },
      { path: 'stats', label: 'Статистика' }
    ];

    return [];
  };

  return (
    <div className="app">
      <Header />
      {(matchEdit || matchCreate || matchCardDetails) && (
        <SubMenu
          menuItems={getMenuItems()}
          showNameInput={!!matchEdit || !!matchCreate}
          initialName={currentCard?.name || ''}
          basePath={matchCreate ? '/cards/create' : `/cards/${id}/edit`}
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

          <Route path="/cards/create" element={<EditType setType={setNewCardType} newCardType={newCardType} />} />
          <Route path="/cards/:id/edit" element={<CardEditGuard />}>
            <Route path="type" element={<EditType setType={setNewCardType} newCardType={newCardType} />} />
            <Route path="settings" element={<EditSettings cardType={newCardType}/>} />
            <Route path="design" element={<EditDesign />} />
            <Route path="info" element={<EditInfo />} />
          </Route>
          <Route path="/cards/:id" element={<CardDetails />}>
            <Route index element={<DefaultCardInfo />} />
            <Route path="info" element={<DefaultCardInfo />} />
            <Route path="clients" element={<ClientsTab />} />
            <Route path="push" element={<PushTab />} />
            <Route path="stats" element={<StatsTab />} />
          </Route>

          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Route>
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
