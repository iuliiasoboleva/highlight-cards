import React from 'react';

import { Badge, Title } from './styles';

const GeoBadge = ({ title, badgeText = 'Geo-push в радиусе 100 метров' }) => {
  return (
    <Title>
      {title} <Badge>{badgeText}</Badge>
    </Title>
  );
};

export default GeoBadge;
