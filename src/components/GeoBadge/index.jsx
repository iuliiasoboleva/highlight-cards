import React from 'react';

import { Badge, Title } from './styles';

const GeoBadge = ({ title, badgeText }) => {
  return (
    <Title>
      {title}
      {badgeText && <Badge>{badgeText}</Badge>}
    </Title>
  );
};

export default GeoBadge;
