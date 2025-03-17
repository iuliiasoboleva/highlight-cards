import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import './styles.css';

const data = [
  { date: 'Feb 17', visits: 10, repeatClients: 2, newClients: 3 },
  { date: 'Feb 18', visits: 20, repeatClients: 5, newClients: 7 },
  { date: 'Feb 19', visits: 30, repeatClients: 10, newClients: 12 },
  { date: 'Feb 20', visits: 25, repeatClients: 8, newClients: 10 },
  { date: 'Feb 21', visits: 35, repeatClients: 12, newClients: 15 },
  { date: 'Feb 22', visits: 40, repeatClients: 15, newClients: 20 },
  { date: 'Feb 23', visits: 50, repeatClients: 20, newClients: 22 },
];

const Home = () => {
  return (
    <div className="statistics-container">
      <h2 className="title">Статистика аккаунта</h2>
      <div className="filters">
        <button>День</button>
        <button>Неделя</button>
        <button className="active">Месяц</button>
        <button>Год</button>
        <button>Все время</button>
        <button>Период</button>
      </div>
      <div className="statistics-card">
        <div className="statistics-header">
          <span>За месяц, 17 февраля - 16 марта 2025</span>
        </div>
        <div className="statistics-grid">
          <div className="stat-item">
            <div className="stat-label">Всего визитов</div>
            <div className="stat-value">50</div>
            <div className="stat-change neutral">+10%</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">Повторные клиенты</div>
            <div className="stat-value">20</div>
            <div className="stat-change neutral">+5%</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">Прошлый период</div>
            <div className="stat-value">40</div>
          </div>
        </div>

        <div className="chart-container">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data}>
              <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="visits" stroke="#8884d8" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="repeatClients" stroke="#82ca9d" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="newClients" stroke="#ffc658" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="client-stats">
          <div className="client-stat">
            <div className="client-dot purple"></div>
            <span className="client-label">Повторные клиенты</span>
            <div className="client-value">20</div>
            <div className="client-change neutral">+5%</div>
          </div>
          <div className="client-stat">
            <div className="client-dot light-purple"></div>
            <span className="client-label">Новые клиенты</span>
            <div className="client-value">22</div>
            <div className="client-change neutral">+8%</div>
          </div>
          <div className="client-stat">
            <div className="client-dot green"></div>
            <span className="client-label">Рефералы</span>
            <div className="client-value">5</div>
            <div className="client-change neutral">+2%</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
