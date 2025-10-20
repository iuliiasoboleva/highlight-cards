import React, { useId, useMemo } from 'react';

import { Sun } from 'lucide-react';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';

import { useMediaQuery } from '../../hooks/useMediaQuery';
import {
  EmptyState,
  Legend,
  LegendDot,
  LegendItem,
  LegendText,
  PortraitCard,
  PortraitTitle,
} from './styles';

const BASE_COLORS = ['#6C2BD9', '#34C759', '#f0bf7c', '#ff8042', '#8dd1e1'];

const ClientPortraitCard = ({ title, data }) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const hasData = Array.isArray(data) && data.some((d) => Number(d?.value) > 0);

  const uid = useId();

  const legend = useMemo(
    () =>
      (data || []).map((item, i) => ({
        color: BASE_COLORS[i % BASE_COLORS.length],
        gradientCss: `linear-gradient(180deg, ${BASE_COLORS[i % BASE_COLORS.length]}e6 0%, ${BASE_COLORS[i % BASE_COLORS.length]}33 100%)`,
        label: String(item?.label ?? ''),
        value: Number(item?.value ?? 0),
      })),
    [data],
  );

  const gradId = (i) => `pieGrad-${uid}-${i}`;

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
              <defs>
                {legend.map((item, i) => (
                  <linearGradient key={i} id={gradId(i)} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={item.color} stopOpacity={0.9} />
                    <stop offset="100%" stopColor={item.color} stopOpacity={0.2} />
                  </linearGradient>
                ))}
              </defs>

              <Pie
                data={legend}
                dataKey="value"
                nameKey="label"
                cx="50%"
                cy="50%"
                outerRadius={isMobile ? 58 : 64}
                labelLine={!isMobile}
                label={
                  isMobile
                    ? false
                    : ({ percent, label }) => `${label}: ${Math.round((percent || 0) * 100)}%`
                }
              >
                {legend.map((_, index) => (
                  <Cell key={index} fill={`url(#${gradId(index)})`} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Компактная легенда для мобильного */}
          {isMobile && (
            <Legend>
              {legend.map((item, index) => (
                <LegendItem key={`legend-${index}-${item.label}`}>
                  <LegendDot style={{ background: item.gradientCss }} />
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
