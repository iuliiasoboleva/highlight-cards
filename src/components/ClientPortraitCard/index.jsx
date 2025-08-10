import React, { useMemo } from 'react';

import { Sun } from 'lucide-react';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';

import {
  EmptyState,
  Legend,
  LegendDot,
  LegendItem,
  LegendText,
  PortraitCard,
  PortraitTitle,
} from './styles';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#8dd1e1'];

const useIsMobile = () => {
  return typeof window !== 'undefined' && window.innerWidth <= 768;
};

const ClientPortraitCard = ({ title, data }) => {
  const isMobile = useIsMobile();
  const hasData = Array.isArray(data) && data.some((d) => Number(d?.value) > 0);

  const legend = useMemo(
    () =>
      (data || []).map((item, i) => ({
        color: COLORS[i % COLORS.length],
        label: item.label,
        value: item.value,
      })),
    [data],
  );

  return (
    <PortraitCard>
      <PortraitTitle>{title}</PortraitTitle>

      {!hasData ? (
        <EmptyState>
          <Sun size={18} />
          Недостаточно данных
        </EmptyState>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart margin={{ top: 8, right: 16, bottom: 8, left: 8 }}>
              <Pie
                data={data}
                dataKey="value"
                nameKey="label"
                cx="50%"
                cy="50%"
                outerRadius={isMobile ? 58 : 64}
                labelLine={!isMobile}
                // На мобильном отключаем подписи на секторах (чтобы не резались)
                label={
                  isMobile
                    ? false
                    : ({ percent, label }) => `${label}: ${(percent * 100).toFixed(0)}%`
                }
              >
                {data.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Компактная легенда для мобильного */}
          {isMobile && (
            <Legend>
              {legend.map((item) => (
                <LegendItem key={item.label}>
                  <LegendDot style={{ background: item.color }} />
                  <LegendText title={item.label}>
                    {item.label}: {item.value}%
                  </LegendText>
                </LegendItem>
              ))}
            </Legend>
          )}
        </>
      )}
    </PortraitCard>
  );
};

export default ClientPortraitCard;
