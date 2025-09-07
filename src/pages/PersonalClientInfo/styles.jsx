import styled, { css } from 'styled-components';

export const Container = styled.div`
  padding: 20px;
`;

export const Title = styled.h2`
  font-size: 24px;
  font-weight: 500;
  margin-bottom: 16px;
`;

export const FormCard = styled.div`
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 0 0 1px #e0e0e0;
`;

export const Row = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  flex-wrap: wrap;

  @media (max-width: 999px) {
    flex-direction: column;
  }
`;

export const Group = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

export const Label = styled.label`
  margin-bottom: 6px;
  font-weight: 500;
`;

export const Input = styled.input`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 6px;
  width: 100%;
`;

export const DateField = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  .react-datepicker-wrapper {
    width: 100%;
  }

  .custom-input {
    width: -webkit-fill-available;
    padding: 10px 12px;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    background-color: #fff;
    transition: all 0.3s;
    font-size: 16px;
    outline: none;

    &:hover {
      border-color: #bf4756;
    }

    @media (max-width: 768px) {
      width: 100%;
      max-width: 100%;
      box-sizing: border-box;
    }
  }

  .calendar-icon {
    position: absolute;
    right: 10px;
    pointer-events: none;
    color: #888;
  }
`;

export const PhoneWrapper = styled.div`
  .react-tel-input {
    width: 100%;
  }

  .react-tel-input .form-control {
    width: 100%;
    padding: 8px 8px 8px 48px; /* под флаг/код */
    border: 1px solid #ccc;
    border-radius: 6px;
    height: 40px;
  }
`;

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(17, 24, 39, 0.5);
  display: grid;
  place-items: center;
  z-index: 1000;
`;

export const Modal = styled.div`
  width: min(560px, 92vw);
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(17, 24, 39, 0.15);
  padding: 20px;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
  }
`;

export const Close = styled.span`
  font-size: 22px;
  line-height: 1;
  cursor: pointer;
  user-select: none;
`;

export const Sub = styled.p`
  margin: 12px 0;
  font-weight: 500;
`;

export const Question = styled.p`
  margin: 16px 0 24px 0;
`;

export const Actions = styled.div`
  display: flex;
  gap: 12px;

  @media (max-width: 560px) {
    flex-direction: column;
  }
`;

export const buttonBase = css`
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
`;

export const PrimaryButton = styled.button`
  ${buttonBase};
  background-color: #000;
  color: #fff;
`;

export const SecondaryButton = styled.button`
  ${buttonBase};
  background-color: #eee;
  color: #333;
`;
