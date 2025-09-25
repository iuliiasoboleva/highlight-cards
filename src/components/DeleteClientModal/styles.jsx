import styled from 'styled-components';

import CustomModal from '../../customs/CustomModal';

export const Subtitle = styled.p`
  font-size: 16px;
  line-height: 1.4;
  color: #222;
  margin: 0 0 8px 0;
`;

export const Question = styled.p`
  font-size: 18px;
  line-height: 1.45;
  color: #000;
  margin: 0;
  font-weight: 500;
`;

export const DangerButton = styled(CustomModal.PrimaryButton)`
  background: #e03131;
  &:hover {
    background: #c92a2a;
  }
  &:active {
    background: #b02525;
  }
`;
