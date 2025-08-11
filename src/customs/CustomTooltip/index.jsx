import React from 'react';
import 'react-tooltip/dist/react-tooltip.css';

import { HelpIcon, StyledTooltip } from './styles';

const CustomTooltip = ({ id, content, html = false, place = 'top', size = 16 }) => {
  const dataProps = html ? { 'data-tooltip-html': content } : { 'data-tooltip-content': content };

  return (
    <>
      <HelpIcon size={size} data-tooltip-id={id} {...dataProps} />
      <StyledTooltip id={id} place={place} />
    </>
  );
};

export default CustomTooltip;
