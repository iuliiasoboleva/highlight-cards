import React from 'react';

import { Sun } from 'lucide-react';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';

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
          <Sun size={18} />
          Недостаточно данных
        </div>
      )}
    </div>
  );
};

export default ClientPortraitCard;
