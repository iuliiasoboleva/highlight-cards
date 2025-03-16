import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Settings from './pages/Settings';
import NotFound from './components/NotFound';
import AuthLayout from './layouts/AuthLayout';
import Tabs from './components/Tabs';
import AuthForm from './components/AuthForm';

const AppLayout = ({ children }) => {
  const location = useLocation();

  const hideLayout = ['/login', '/register'].includes(location.pathname);

  return (
    <div className="app">
      {!hideLayout && <Header />}
      <div className="main">
        {!hideLayout && <Sidebar />}
        <div className="page-content">
          {children}
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [activeTab, setActiveTab] = useState('login');

  return (
    <Router>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Home />} />
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
            } />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AppLayout>
    </Router>
  );
};

export default App;
