import PhoneInput from 'react-phone-input-2';

import styled from 'styled-components';

export const Container = styled.div`
  padding-bottom: 40px;
`;

export const Header = styled.div``;

export const HeaderBar = styled.div`
  width: 100%;
  border-bottom: 1px solid #e2e2e2;
  padding: 12px 0;
  text-align: center;
  margin-bottom: 20px;
`;

export const HeaderContent = styled.div`
  max-width: 400px;
  margin: 0 auto;
  font-size: 12px;
  color: #4a4a4a;
`;

export const AuthFormWrapper = styled.div`
  max-width: 920px;
  margin: 0 auto;
  padding: 0 16px;
`;

export const Title = styled.h1`
  text-align: center;
  font-size: 20px;
  margin-bottom: 24px;
  font-weight: 600;
`;

export const CardBlock = styled.div`
  background-color: #fff;
  border-radius: 8px;
  border: 1px solid #d5d5dd;
  padding: 20px;

  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;

  @media (min-width: 920px) {
    align-items: flex-start;
  }
`;

export const AuthForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const StyledPhoneInput = styled(PhoneInput)`
  width: 100%;

  .form-control {
    width: 100% !important;
    padding-left: 48px !important;
    height: 40px;
    border-radius: 6px;
    border: 1px solid #d5d5dd;
    font-size: 14px;
  }

  .flag-dropdown {
    border: 1px solid #d5d5dd;
    border-right: 0;
    border-radius: 6px 0 0 6px;
  }
`;

export const PwaButton = styled.button`
  background: #000;
  color: #fff;
  padding: 10px;
  font-size: 14px;
  border-radius: 6px;
  margin-top: 8px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;

  &:hover {
    opacity: 0.95;
  }

  &:active {
    transform: translateY(1px);
  }
`;

export const PwaIconImg = styled.img`
  width: 20px;
  height: 20px;
`;

export const AccordionsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;
