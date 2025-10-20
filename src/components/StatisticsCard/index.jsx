import React, { useMemo } from 'react';

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
import ClientStatDropdownCard from '../ClientStatDropdownCard';
import StatisticInfo from '../StatisticInfo';
import {
  ChartContainer,
  ChartWrapper,
  Content,
  FiltersBlock,
  Header,
  Left,
  Right,
  TopGrid,
  Wrapper,
} from './styles';

const StatisticsCard = ({ chartData, overallStats, lineLabels, selectedPeriod, getDateRange }) => {
  const axisStyle = {
    fontSize: '12px',
    lineHeight: 1.6666666667,
    color: '#656565',
    letterSpacing: '-0.024rem',
    fontFamily: 'Manrope, sans-serif',
  };

  const colored = useMemo(() => {
    return (chartData || []).map((p) => {
      const v = Number(p.visits ?? 0);
      const n = Number(p.newClients ?? 0);
      const r = Number(p.repeatClients ?? 0);

      let winner = 'visits';
      let maxVal = v;

      if (n >= maxVal) {
        winner = 'new';
        maxVal = n;
      }
      if (r >= maxVal) {
        winner = 'repeat';
        maxVal = r;
      }

      return { ...p, winner };
    });
  }, [chartData]);

  const maxNew = useMemo(
    () => Math.max(0, ...colored.map((d) => Number(d.newClients ?? 0))),
    [colored],
  );

  const getFill = (winner) => {
    switch (winner) {
      case 'visits':
        return 'url(#gradVisits)';
      case 'new':
        return 'url(#gradNew)';
      case 'repeat':
        return 'url(#gradRepeat)';
      default:
        return 'url(#gradVisits)';
    }
  };

  return (
    <Wrapper>
      <Header>
        <FiltersBlock>
          <span>{getDateRange()}</span>
        </FiltersBlock>
      </Header>

      <Content>
        <Left>
          <TopGrid>
            <ClientStatDropdownCard
              selectable={false}
              initialKey="lastPeriod"
              statsByType={{
                referral: {
                  value: overallStats?.referrals?.value ?? 0,
                  change: overallStats?.referrals?.change ?? 0,
                },
              }}
            />

            <ClientStatDropdownCard
              selectable
              statsByType={{
                new: {
                  value: overallStats?.newClients?.value ?? 0,
                  change: overallStats?.newClients?.change ?? 0,
                },
                repeat: {
                  value: overallStats?.repeatClients?.value ?? 0,
                  change: overallStats?.repeatClients?.change ?? 0,
                },
                referral: {
                  value: overallStats?.referrals?.value ?? 0,
                  change: overallStats?.referrals?.change ?? 0,
                },
              }}
            />

            <ClientStatDropdownCard
              selectable={false}
              initialKey="visits"
              statsByType={{
                visits: {
                  value: overallStats?.totalVisits?.value ?? 0,
                  change: overallStats?.totalVisits?.change ?? 0,
                },
              }}
            />
          </TopGrid>

          <ChartWrapper>
            <ChartContainer>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart
                  data={colored}
                  margin={{ top: 0, right: 25, bottom: 0, left: 10 }}
                  barCategoryGap="0%"
                  barGap={0}
                >
                  <defs>
                    <linearGradient id="gradVisits" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#34C759" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#34C759" stopOpacity={0.2} />
                    </linearGradient>
                    <linearGradient id="gradNew" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#C7A4FF" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#C7A4FF" stopOpacity={0.2} />
                    </linearGradient>
                    <linearGradient id="gradRepeat" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6C2BD9" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#6C2BD9" stopOpacity={0.2} />
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
                    domain={[0, maxNew || 1]}
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
                            {lineLabels.visits}: {item?.visits ?? 0}
                          </div>
                          <div>
                            {lineLabels.repeatClients}: {item?.repeatClients ?? 0}
                          </div>
                          <div>
                            {lineLabels.newClients}: {item?.newClients ?? 0}
                          </div>
                        </div>
                      );
                    }}
                  />

                  <Bar dataKey="newClients" radius={[6, 6, 0, 0]}>
                    {colored.map((d, i) => (
                      <Cell key={`cell-${i}`} fill={getFill(d.winner)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </ChartWrapper>
        </Left>

        <Right>
          <StatisticInfo
            colorClass="repeat"
            label="Повторные клиенты"
            value={overallStats?.repeatClients?.value ?? 0}
            change={overallStats?.repeatClients?.change ?? 0}
          />
          <StatisticInfo
            colorClass="new"
            label="Новые клиенты"
            value={overallStats?.newClients?.value ?? 0}
            change={overallStats?.newClients?.change ?? 0}
          />
          <StatisticInfo
            colorClass="referral"
            label="Рефералы"
            value={overallStats?.referrals?.value ?? 0}
            change={overallStats?.referrals?.change ?? 0}
          />
        </Right>
      </Content>
    </Wrapper>
  );
};

export default StatisticsCard;
