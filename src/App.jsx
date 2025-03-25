import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation, Outlet, matchPath } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Settings from './pages/Settings';
import Cards from './pages/Cards';
import CardDetails from './pages/CardDetails';
import NotFound from './components/NotFound';
import AuthLayout from './layouts/AuthLayout';
import Tabs from './components/Tabs';
import AuthForm from './components/AuthForm';
import SubMenu from './components/SubMenu';

const MainLayout = () => {
  const location = useLocation();

  const hideLayout = ['/login', '/register'].includes(location.pathname);
  const isCardDetails = matchPath('/cards/:id', location.pathname);

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
          <Route path="/" element={<Home />} />
          <Route path="/cards" element={<Cards />} />
          <Route path="/cards/:id" element={<CardDetails />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
