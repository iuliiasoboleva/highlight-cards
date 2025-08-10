import React from 'react';

import { ArrowDown, ArrowUp, Minus } from 'lucide-react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { formatChartTick } from '../../helpers/formatChartTick';
import {
  ChangeCircle,
  ChangeIcon,
  ChangeValue,
  ChangeWrapper,
  ChartContainer,
  ChartWrapper,
  ClientStatHeader,
  ClientStatLeft,
  ClientStatRight,
  ClientStatSubtitle,
  ClientStatTitle,
  StatisticsCard,
  StatisticsContent,
  StatisticsLeft,
} from './styles';

const ClientsActivityChart = ({
  chartData,
  lineLabels,
  selectedPeriod,
  change,
  value,
  label,
  dataKey,
}) => {
  const axisStyle = {
    fontSize: '12px',
    lineHeight: 1.6666666667,
    color: '#656565',
    letterSpacing: '-0.024rem',
    fontFamily: 'Manrope, sans-serif',
  };

  const isPositive = change > 0;
  const isNegative = change < 0;
  const changeType = isPositive ? 'positive' : isNegative ? 'negative' : 'neutral';

  return (
    <StatisticsCard>
      <ClientStatHeader>
        <ClientStatLeft>
          <ClientStatTitle>{label}</ClientStatTitle>
          <ClientStatSubtitle>{value}</ClientStatSubtitle>
        </ClientStatLeft>

        <ClientStatRight>
          <ChangeValue className={changeType}>{isPositive ? `+${change}` : change}</ChangeValue>
          <ChangeWrapper className={changeType}>
            <ChangeCircle className="circle">
              {isPositive ? (
                <ChangeIcon className={changeType}>
                  <ArrowUp size={14} />
                </ChangeIcon>
              ) : isNegative ? (
                <ChangeIcon className={changeType}>
                  <ArrowDown size={14} />
                </ChangeIcon>
              ) : (
                <ChangeIcon className={changeType}>
                  <Minus size={14} />
                </ChangeIcon>
              )}
            </ChangeCircle>
          </ChangeWrapper>
        </ClientStatRight>
      </ClientStatHeader>

      <StatisticsContent>
        <StatisticsLeft>
          <ChartWrapper>
            <ChartContainer>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={chartData} margin={{ top: 0, right: 25, bottom: 0, left: 10 }}>
                  <CartesianGrid
                    vertical={true}
                    horizontal={false}
                    stroke="#f0f0f0"
                    strokeDasharray="0"
                  />
                  <XAxis
                    dataKey="date"
                    interval={0}
                    tick={axisStyle}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) => formatChartTick(value, selectedPeriod)}
                  />
                  <YAxis
                    tick={axisStyle}
                    axisLine={false}
                    tickLine={false}
                    width={28}
                    padding={{ top: 6, bottom: 4 }}
                  />

                  <Tooltip
                    cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                    content={({ active, payload, label }) => {
                      if (!active || !payload) return null;

                      const date = new Date(label).toLocaleDateString('ru-RU', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      });

                      return (
                        <div
                          style={{
                            backgroundColor: '#fff',
                            border: '1px solid #eee',
                            borderRadius: 8,
                            padding: 8,
                            fontSize: 12,
                            color: '#333',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                          }}
                        >
                          <div style={{ marginBottom: 4, fontWeight: 600 }}>{date}</div>
                          {payload.map((item) => (
                            <div key={item.name} style={{ color: item.color }}>
                              {item.name}: {item.value}
                            </div>
                          ))}
                        </div>
                      );
                    }}
                  />

                  <Line
                    type="monotone"
                    dataKey={dataKey}
                    stroke="#ffc658"
                    name={lineLabels?.[dataKey] ?? label}
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </ChartWrapper>
        </StatisticsLeft>
      </StatisticsContent>
    </StatisticsCard>
  );
};

export default ClientsActivityChart;
