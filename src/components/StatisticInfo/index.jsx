import React from 'react';

import { ArrowDown, ArrowUp, Minus } from 'lucide-react';

import { Card, ChangeCircle, ChangeValue, ChangeWrapper, Dot, LabelRow, TopRow } from './styles';

const StatisticInfo = ({ colorClass = 'repeat', label, value = 0, change = 0 }) => {
  const isPositive = change > 0;
  const isNegative = change < 0;
  const changeType = isPositive ? 'positive' : isNegative ? 'negative' : 'neutral';

  return (
    <Card>
      <TopRow>
        <ChangeValue $type={changeType}>{isPositive ? `+${change}` : change}</ChangeValue>
        <ChangeWrapper>
          <ChangeCircle>
            {isPositive ? (
              <ArrowUp size={14} color="#1cc568" />
            ) : isNegative ? (
              <ArrowDown size={14} color="#f44336" />
            ) : (
              <Minus size={14} color="#f0a000" />
            )}
          </ChangeCircle>
        </ChangeWrapper>
      </TopRow>

      <TopRow>
        <LabelRow>
          <Dot $variant={colorClass} />
          <span>{label}</span>
        </LabelRow>
      </TopRow>
    </Card>
  );
};

export default StatisticInfo;
