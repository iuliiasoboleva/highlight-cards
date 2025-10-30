import styled from 'styled-components';

export const DateTimePickerWrapper = styled.div`
  position: relative;
  width: 100%;
`;

export const DateTimeInput = styled.input`
  width: 100%;
  height: 42px;
  padding: 0 12px;
  font-size: 14px;
  font-weight: 400;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  background: white;
  transition: all 0.2s;
  cursor: pointer;
  color: ${(props) => (props.$hasValue ? '#000' : '#a6a5ae')};

  &:hover {
    border-color: #bf4756;
  }

  &:focus {
    outline: none;
    border-color: #bf4756;
  }

  ${(props) =>
    props.$error &&
    `
    border-color: #c14857;
  `}
`;

export const CalendarDropdown = styled.div`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  z-index: 1000;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  padding: 16px;
  display: flex;
  gap: 16px;
  animation: slideDown 0.2s ease;

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export const CalendarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  gap: 8px;
`;

export const NavButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
  color: #333;

  &:hover {
    background: #f5f5f5;
  }

  &:active {
    background: #e0e0e0;
  }
`;

export const MonthYearSelect = styled.select`
  flex: 1;
  padding: 6px 8px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  background: white;
  transition: border-color 0.2s;

  &:hover {
    border-color: #bf4756;
  }

  &:focus {
    outline: none;
    border-color: #bf4756;
  }
`;

export const WeekDaysRow = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  margin-bottom: 8px;
`;

export const WeekDay = styled.div`
  text-align: center;
  font-size: 12px;
  font-weight: 600;
  color: #666;
  padding: 4px 0;
`;

export const DaysGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  margin-bottom: 12px;
`;

export const DayCell = styled.button`
  width: 32px;
  height: 32px;
  border: none;
  background: ${(props) => {
    if (props.$selected) return '#bf4756';
    if (props.$today) return '#fff0f2';
    return 'transparent';
  }};
  color: ${(props) => {
    if (props.$selected) return 'white';
    if (props.$otherMonth) return '#ccc';
    return '#333';
  }};
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  font-weight: ${(props) => (props.$selected ? '600' : '400')};
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover:not(:disabled) {
    background: ${(props) => (props.$selected ? '#a63d4a' : '#f5f5f5')};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.3;
  }

  ${(props) =>
    props.$otherMonth &&
    `
    opacity: 0.4;
  `}
`;

export const CalendarSection = styled.div`
  flex: 0 0 auto;
`;

export const TimeSection = styled.div`
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 24px 0 24px 16px;
  border-left: 1px solid #e0e0e0;
  min-width: 140px;
`;

export const TimeLabel = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
`;

export const TimeInputs = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const TimeInputGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const TimeInput = styled.input`
  width: 50px;
  padding: 10px 8px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  text-align: center;
  transition: border-color 0.2s;

  &:hover {
    border-color: #bf4756;
  }

  &:focus {
    outline: none;
    border-color: #bf4756;
    background: #fff0f2;
  }
`;

export const TimeUnit = styled.span`
  font-size: 14px;
  color: #666;
  min-width: 50px;
`;
