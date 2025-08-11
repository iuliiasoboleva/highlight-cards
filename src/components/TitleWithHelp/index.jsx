import React from 'react';

import CustomTooltip from '../../customs/CustomTooltip';
import { TitleRow, TitleText } from './styles';

const TitleWithHelp = ({
  title = '',
  tooltipId,
  tooltipContent,
  tooltipHtml = false,
  tooltipPlace = 'top',
  iconSize = 16,
  as = 'h2',
  className,
}) => {
  return (
    <TitleRow className={className}>
      <TitleText as={as}>{title}</TitleText>
      <CustomTooltip
        id={tooltipId}
        html={tooltipHtml}
        content={tooltipContent}
        place={tooltipPlace}
        size={iconSize}
      />
    </TitleRow>
  );
};

export default TitleWithHelp;
