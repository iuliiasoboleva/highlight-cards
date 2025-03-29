import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation, Outlet, matchPath } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Settings from './pages/Settings';
import Cards from './pages/Cards';
import CardDetails from './pages/CardDetails';
import DefaultCardInfo from './pages/DefaultCardInfo';
import ClientsTab from './pages/ClientsTab';
import PushTab from './pages/PushTab';
import StatsTab from './pages/StatsTab';
import NotFound from './components/NotFound';
import AuthLayout from './layouts/AuthLayout';
import Tabs from './components/Tabs';
import AuthForm from './components/AuthForm';
import SubMenu from './components/SubMenu';

const MainLayout = () => {
  const location = useLocation();

  const hideLayout = ['/login', '/register'].includes(location.pathname);
  const isCardDetails = matchPath('/cards/:id/*', location.pathname);

  if (hideLayout) {
    return <Outlet />;
  }

  return (
    <div className="app">
      <Header />
      {isCardDetails && <SubMenu />}
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