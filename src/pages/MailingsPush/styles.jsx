import styled, { css } from 'styled-components';

export const MailingsPushTitle = styled.h2`
  font-size: 22px;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const MailingsPushDescription = styled.p`
  color: #666;
  font-size: 14px;
  margin-bottom: 24px;
`;

export const MailingsPushBox = styled.div`
  background: #fff;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 24px;
`;

export const BoxTitle = styled.h3`
  font-size: 18px;
  margin-bottom: 16px;
`;

export const PushSelect = styled.select`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  margin-bottom: 12px;

  ${({ $narrow }) =>
    $narrow &&
    css`
      width: 80px;
    `}
`;

export const SubmitButton = styled.button`
  background: #000;
  color: #fff;
  font-size: 14px;
  padding: 14px 16px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  margin-top: auto;
  font-weight: 500;

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

export const PushToggleButtons = styled.div`
  display: flex;
  gap: 12px;
  margin: 16px 0;
`;

export const ToggleButton = styled.button`
  flex: 1;
  padding: 14px 16px;
  border-radius: 6px;
  font-weight: 500;
  font-size: 14px;
  border: none;
  cursor: pointer;
  margin-top: auto;
  background: ${({ $active }) => ($active ? '#000' : '#eee')};
  color: ${({ $active }) => ($active ? '#fff' : '#333')};
  transition:
    background 0.2s,
    color 0.2s;

  &:hover {
    background: ${({ $active }) => ($active ? '#111' : '#e9e9ec')};
    color: ${({ $active }) => ($active ? '#fff' : '#1f1e1f')};
  }
`;

export const Btn = styled.button`
  padding: 10px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  border: none;
  width: 100%;
`;

export const BtnDark = styled(Btn)`
  background: #000;
  color: #fff;
  font-size: 14px;
  padding: 14px 16px;
  border-radius: 6px;
  margin-top: auto;
`;

export const PushSegmentFilter = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
`;

export const PushRecipientCount = styled.p`
  font-size: 14px;
  color: #666;
  margin-bottom: 16px;
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
`;

export const PushSchedule = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  gap: 8px;

  @media (max-width: 768px) {
    flex-direction: column;
    justify-content: center;
  }
`;

export const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const PushDate = styled.input.attrs({ type: 'datetime-local' })`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 6px;
  cursor: pointer;
  width: 100%;
`;

export const PushTextarea = styled.textarea`
  font-family: 'Manrope', system-ui;
  width: 100%;
  min-height: 80px;
  padding: 10px;
  margin-bottom: 16px;
  border-radius: 6px;
  border: 1px solid #ccc;
  resize: vertical;
  font-size: 16px;
`;

export const PushTabs = styled.div`
  margin-bottom: 16px;
`;

export const PushSegmentControls = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 12px;
`;

export const NoActiveCardsText = styled.p`
  padding: 16px;
  background-color: #f9f9f9;
  border: 1px dashed #ccc;
  border-radius: 8px;
  color: #555;
  margin-top: 12px;
`;

/* История рассылок */
export const EmptyStub = styled.div`
  display: grid;
  justify-items: center;
  gap: 6px;
  padding: 14px;
  color: #666;
  background: #fafafa;
  border: 1px dashed #ddd;
  border-radius: 12px;
  font-size: 14px;

  svg {
    opacity: 0.9;
  }

  p {
    margin: 0;
    font-size: 13px;
    color: #777;
    text-align: center;
  }
`;

export const PushHistoryContainer = styled.div`
  margin-top: 32px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
`;

export const PushHistoryWrapper = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const PushHistoryTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const InfoIcon = styled.span`
  margin-left: 8px;
  font-size: 14px;
  color: #999;
`;

export const PushHistoryHelpIcon = styled.span`
  font-size: 14px;
  color: #999;
  cursor: default;
`;

export const PushHistoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const PushHistoryItem = styled.div`
  background-color: #f9f9f9;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  padding: 12px 16px;
`;

export const PushHistoryTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 8px;
  gap: 8px;
`;

export const PushHistoryDates = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #333;
`;

export const PushHistoryControls = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #555;
`;

export const PushHistoryIcon = styled.span`
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: #000;
  }

  ${({ $danger }) =>
    $danger &&
    css`
      &:hover {
        color: #e74c3c;
      }
    `}
`;

export const PushHistoryMessage = styled.div`
  font-size: 14px;
  white-space: pre-line;
  color: #222;
`;

export const EmptyMessage = styled.div`
  color: #bbb;
  font-style: italic;
`;

export const IconButton = styled.button`
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background 0.2s;
  border: none;
  background: transparent;

  &:hover {
    background: rgba(0, 0, 0, 0.05);
  }

  ${({ $danger }) =>
    $danger &&
    css`
      &:hover {
        background: rgba(255, 0, 0, 0.1);
        color: red;
      }
    `}
`;
