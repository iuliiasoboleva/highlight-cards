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

export const DangerButton = styled(CustomModal.SecondaryButton)`
  background: #f5f5f5;
  color: #2c3e50;
  &:hover {
    background: #e5e5e5;
  }
  &:active {
    background: #d5d5d5;
  }
`;

export const CancelButton = styled(CustomModal.PrimaryButton)`
  background: #bf4756;
  &:hover {
    background: #a63d49;
    color: #fff;
  }
  &:active {
    background: #8d333d;
    color: #fff;
  }
`;
