import styled from 'styled-components';
import CustomModal from '../../customs/CustomModal';

export const InputGroup = styled.div`
  margin-bottom: 16px;
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  font-size: 14px;
  color: #333;
`;

export const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  &:focus {
    outline: none;
    border-color: #000;
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  min-height: 80px;
  resize: vertical;
  font-family: inherit;
  &:focus {
    outline: none;
    border-color: #000;
  }
`;

export const PrimaryButton = styled(CustomModal.PrimaryButton)`
  background: #000;
  color: #fff;
  &:hover {
    background: #333;
  }
`;

export const SecondaryButton = styled(CustomModal.SecondaryButton)`
`;

export const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 24px 0 16px 0;
  padding-top: 16px;
  border-top: 1px solid #e0e0e0;

  &:first-of-type {
    margin-top: 0;
    padding-top: 0;
    border-top: none;
  }
`;

export const RadioGroup = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 8px;
`;

export const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  color: #333;

  input[type="radio"] {
    width: 18px;
    height: 18px;
    cursor: pointer;
  }
`;

export const RequiredMark = styled.span`
  color: #e74c3c;
  margin-left: 4px;
`;
