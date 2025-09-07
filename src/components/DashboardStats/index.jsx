import React from 'react';

import {
  Card,
  Grid,
  Row,
  Stars,
  StatBlock,
  StatFooter,
  StatIcon,
  StatLabel,
  StatValue,
  TooltipIcon,
} from './styles';

const defaultStats = [
  { label: 'Установленных карт', key: 'installed', value: 0 },
  { label: 'Клиентов в базе', key: 'clients', value: 0 },
  { label: 'Штампов начислено', key: 'stamps', value: 0 },
  { label: 'Транзакций', key: 'transactions', value: 0 },
  { label: 'Наград заработано', key: 'rewards', value: 0 },
  { label: 'Отзывов', key: 'reviews', value: 0 },
  { label: 'Наград получено', key: 'rewardsReceived', value: 0 },
];

const DashboardStats = ({ data = null }) => {
  const stats = defaultStats.map((item) => ({
    ...item,
    value: data && data[item.key] !== undefined ? data[item.key] : item.value,
  }));

  return (
    <Grid>
      {stats.map((stat, index) => (
        <Card key={index}>
          <Row>
            <StatValue>{stat.value}</StatValue>
            <StatIcon>−</StatIcon>
          </Row>

          <Row>
            <StatLabel>{stat.label}</StatLabel>
            <StatFooter>{stat.value}</StatFooter>
          </Row>
        </Card>
      ))}

      <Card>
        <Stars>
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i}>☆</span>
          ))}
        </Stars>

        <StatBlock>
          <StatLabel>Уровень лояльности</StatLabel>
          <TooltipIcon data-tooltip="Показатель активности и вовлеченности клиентов.">
            ?
          </TooltipIcon>
        </StatBlock>
      </Card>
    </Grid>
  );
};

export default DashboardStats;
