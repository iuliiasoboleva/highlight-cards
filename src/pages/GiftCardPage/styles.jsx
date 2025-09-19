import styled from 'styled-components';

export const Container = styled.div`
  --bg: #111;
  --paper: #ffffff;
  --ink: #1b1b1b;
  --accent: #b81935;
  --muted: #adadad;

  color: var(--ink);
  background: white;
`;

export const HowTo = styled.section`
  background: #fff;
  padding: 60px 16px 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  h2 {
    font-family: 'Playfair Display', 'Times New Roman', Georgia, serif;
    font-style: italic;
    font-weight: 500;
    font-size: 45px;
    color: var(--accent);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  h2 span {
    font-style: normal;
    font-size: 38px;
    color: black;
  }
  @media (max-width: 520px) {
    h2 {
      align-items: flex-start;
      font-size: 38px;
    }
    h2 span {
      font-size: 26px;
    }
  }
`;

export const HowGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 60px;
  max-width: 1080px;
  margin: 60px auto;
  width: 100%;
  justify-items: center;

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
    gap: 30px;
  }
`;

export const HowItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  gap: 22px;

  .icon {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: #f7f7f7;
    border: 1px solid #e8e8e8;
    display: grid;
    place-items: center;
    flex-shrink: 0;
  }

  .icon img {
    width: 32px;
    height: 32px;
    display: block;
  }

  .text {
    font-size: 18px;
    line-height: 1.35;
    color: #444;
    max-width: 300px;
  }
`;

export const MapBlock = styled.section`
  background: #fff;

  h3 {
    max-width: 1080px;
    margin: 0 auto 16px;
    font-size: 22px;
    font-weight: 600;
    text-align: left;
  }
`;

export const BottomBlock = styled.section`
  background: #fff;
  padding: 60px 16px 40px;

  .addr-title {
    max-width: 1080px;
    margin: 0 auto 28px;
    font-size: 38px;
    line-height: 1.15;
    font-weight: 500;
    color: #111;
  }
  .addr-title em {
    font-family: 'Playfair Display', 'Times New Roman', Georgia, serif;
    font-style: italic;
    font-size: 45px;
    margin-right: 4px;
  }

  @media (max-width: 700px) {
    .addr-title {
      font-size: 26px;
    }
    .addr-title em {
      font-size: 38px;
    }
  }
`;

export const Addresses = styled.div`
  max-width: 1080px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(2, minmax(320px, 1fr));
  column-gap: 56px;
  row-gap: 28px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const CityCol = styled.div``;

export const CityTitle = styled.div`
  color: var(--accent);
  font-weight: 500;
  font-size: 17px;
  margin: 6px 0 12px;
`;

export const AddressItem = styled.div`
  padding: 8px 0;

  .line1 {
    font-size: 17px;
    color: black;
  }
`;

export const ContactRow = styled.div`
  max-width: 1080px;
  margin: 16px auto 40px;
  padding-top: 28px;

  display: grid;
  grid-template-columns: repeat(2, minmax(260px, 1fr));
  column-gap: 56px;
  row-gap: 18px;

  .contact {
    display: grid;
    gap: 6px;
  }

  .label {
    font-size: 17px;
    color: var(--muted);
  }

  .value {
    text-decoration: none;
    color: #000000;
    font-size: 25px;
    font-weight: 400;
  }

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    .value {
      font-size: 20px;
    }
  }
`;
