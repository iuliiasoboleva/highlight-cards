import React from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';

const Tabs = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'login') {
      navigate('/login');
    } else {
      navigate('/register');
    }
  };

  return (
    <div className="tabs">
      <span
        className={activeTab === 'login' ? 'active' : ''}
        onClick={() => handleTabChange('login')}
      >
        Вход
      </span>
      <span
        className={activeTab === 'register' ? 'active' : ''}
        onClick={() => handleTabChange('register')}
      >
        Регистрация
      </span>
    </div>
  );
};

export default Tabs;
