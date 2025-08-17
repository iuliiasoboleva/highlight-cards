import styled from 'styled-components';

export const FooterWrap = styled.footer`
  background-color: #f9edee;
  color: black;
  padding: 16px 24px;
  min-height: 56px;
  font-size: 13px;
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  z-index: 9999;

  @media (max-width: 999px) {
    flex-direction: column;
    gap: 8px;
    text-align: center;
    margin-bottom: var(--bottom-nav-height);
  }
`;

export const FooterCol = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
`;

export const FooterLink = styled.a`
  color: inherit;
  text-decoration: none;
  margin: 0 4px;

  &:hover {
    text-decoration: underline;
  }
`;

export const Separator = styled.span`
  margin: 0 4px;
`;

export const Company = styled.p`
  font-weight: 500;
  margin: 0;
`;

export const Inn = styled.p`
  margin: 0;
`;

export const Phone = styled.span``;
