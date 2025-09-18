import styled from 'styled-components';

export const Container = styled.div`
  --bg: #111;
  --paper: #ffffff;
  --ink: #1b1b1b;
  --accent: #c93542;
  --muted: #8a94a6;

  color: var(--ink);
  background: white;
`;

export const HowTo = styled.section`
  background: #fff;
  padding: 40px 16px 8px;

  h2 {
    text-align: center;
    font-size: 28px;
    font-weight: 600;
    margin: 0 0 20px;
  }
  h2 span {
    color: var(--accent);
    font-weight: 700;
  }
`;

export const HowGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(160px, 1fr));
  gap: 22px;
  max-width: 1080px;
  margin: 0 auto;

  @media (max-width: 960px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`;

export const HowItem = styled.div`
  display: grid;
  justify-items: center;
  text-align: center;
  background: #fafafa;
  border: 1px solid #eee;
  border-radius: 12px;
  padding: 18px;

  img {
    width: 42px;
    height: 42px;
    margin-bottom: 10px;
  }

  .title {
    font-weight: 600;
    margin-bottom: 6px;
  }
  .text {
    color: var(--muted);
    font-size: 14px;
  }
`;

export const MapBlock = styled.section`
  background: #fff;
  padding: 28px 16px 16px;

  h3 {
    max-width: 1080px;
    margin: 0 auto 16px;
    font-size: 22px;
    font-weight: 600;
    text-align: left;
  }
`;

export const Addresses = styled.div`
  max-width: 1080px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, minmax(220px, 1fr));
  gap: 24px;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }
`;

export const CityCol = styled.div``;

export const CityTitle = styled.div`
  font-weight: 700;
  margin-bottom: 10px;
`;

export const AddressItem = styled.div`
  border-top: 1px dashed #eee;
  padding: 10px 0;

  .line1 {
    font-size: 14px;
  }
  .line2 {
    color: var(--muted);
    font-size: 13px;
    margin-top: 2px;
  }
`;

export const ContactRow = styled.div`
  max-width: 1080px;
  margin: 16px auto 0;
  padding-top: 8px;
  border-top: 1px solid #f0f0f0;

  display: flex;
  gap: 24px;
  flex-wrap: wrap;

  a {
    color: #1a73e8;
    text-decoration: none;
  }
`;

export const Badge = styled.span`
  display: inline-block;
  font-size: 11px;
  font-weight: 700;
  color: #777;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-right: 8px;
`;

export const Footer = styled.footer`
  background: #fff;
  padding: 28px 16px 40px;
  border-top: 1px solid #eee;
  color: #666;

  margin: 0 auto;

  display: flex;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;

  a {
    color: inherit;
    text-decoration: none;
  }
`;
