import React, { useMemo } from 'react';

import { ArrowDown, ArrowUp, Minus } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
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

const GRADIENT_MAP = {
  visits: 'url(#gradGreen)',
  newClients: 'url(#gradPurpleLight)',
  repeatClients: 'url(#gradPurpleDark)',
  cardsIssued: 'url(#gradYellow)',
  retention: 'url(#gradGreen)',
};

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

  const domainMax = useMemo(() => {
    const values = (chartData || []).map((d) => Number(d?.[dataKey] ?? 0));
    return Math.max(1, ...values);
  }, [chartData, dataKey]);

  const fillForBar = GRADIENT_MAP[dataKey] || 'url(#gradPurpleLight)';

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
                <BarChart
                  data={chartData}
                  margin={{ top: 0, right: 25, bottom: 0, left: 10 }}
                  barCategoryGap="0%"
                  barGap={0}
                >
                  <defs>
                    <linearGradient id="gradGreen" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#34C759" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#34C759" stopOpacity={0.2} />
                    </linearGradient>
                    <linearGradient id="gradPurpleLight" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#C7A4FF" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#C7A4FF" stopOpacity={0.2} />
                    </linearGradient>
                    <linearGradient id="gradPurpleDark" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6C2BD9" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#6C2BD9" stopOpacity={0.2} />
                    </linearGradient>
                    <linearGradient id="gradYellow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f0bf7c" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#f0bf7c" stopOpacity={0.2} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid vertical horizontal={false} stroke="#f0f0f0" strokeDasharray="0" />

                  <XAxis
                    dataKey="date"
                    interval="preserveStartEnd"
                    minTickGap={30}
                    tick={axisStyle}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) => formatChartTick(value, selectedPeriod)}
                  />
                  <YAxis
                    domain={[0, domainMax]}
                    tick={axisStyle}
                    axisLine={false}
                    tickLine={false}
                    width={28}
                    padding={{ top: 0, bottom: 0 }}
                    allowDecimals={false}
                  />

                  <Tooltip
                    cursor={false}
                    content={({ active, payload, label }) => {
                      if (!active || !payload) return null;
                      const date = new Date(label).toLocaleDateString('ru-RU', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      });
                      const item = payload[0]?.payload;
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
                          <div>
                            {lineLabels?.[dataKey] ?? label}: {item?.[dataKey] ?? 0}
                          </div>
                        </div>
                      );
                    }}
                  />

                  <Bar dataKey={dataKey} radius={[6, 6, 0, 0]}>
                    {chartData.map((_, i) => (
                      <Cell key={`cell-${i}`} fill={fillForBar} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </ChartWrapper>
        </StatisticsLeft>
      </StatisticsContent>
    </StatisticsCard>
  );
};

export default ClientsActivityChart;
