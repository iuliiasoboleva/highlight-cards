import { Tooltip } from 'react-tooltip';

import { HelpCircle } from 'lucide-react';
import styled from 'styled-components';

export const StyledTooltip = styled(Tooltip)`
  max-width: 160px;
  font-size: 12px;
  line-height: 1;
  padding: 4px 8px;
  background: #000;
  color: #fff;
  border-radius: 4px;
  z-index: 9999;
  max-width: 280px;
  white-space: normal;
  text-align: left;
`;

export const HelpIcon = styled(HelpCircle)`
  margin-left: 6px;
  cursor: pointer;
  outline: none;
`;
