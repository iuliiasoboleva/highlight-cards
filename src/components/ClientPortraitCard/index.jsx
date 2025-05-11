import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { faSun } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './styles.css';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#8dd1e1'];

const ClientPortraitCard = ({ title, data }) => {
  const hasData = data && data.length > 0;

  return (
    <div className="portrait-card">
      <div className="portrait-title">{title}</div>

      {hasData ? (
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="label"
              cx="50%"
              cy="50%"
              outerRadius={60}
              fill="#8884d8"
              label={({ percent, label }) => `${label}: ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="empty-state">
                  <FontAwesomeIcon icon={faSun} className="empty-icon" />

          Недостаточно данных
          </div>
      )}
    </div>
  );
};

export default ClientPortraitCard;
