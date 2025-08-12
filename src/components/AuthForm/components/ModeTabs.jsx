import React from 'react';

import { Tab, Tabs } from '../styles';

const ModeTabs = ({ mode, onSelect }) => {
  return (
    <Tabs role="tablist" aria-label="Auth mode">
      <Tab
        role="tab"
        aria-selected={mode === 'register'}
        tabIndex={mode === 'register' ? 0 : -1}
        $active={mode === 'register'}
        onClick={() => onSelect('register')}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelect('register')}
      >
        Регистрация
      </Tab>

      <Tab
        role="tab"
        aria-selected={mode === 'login'}
        tabIndex={mode === 'login' ? 0 : -1}
        $active={mode === 'login'}
        onClick={() => onSelect('login')}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelect('login')}
      >
        Вход
      </Tab>
    </Tabs>
  );
};

export default ModeTabs;
