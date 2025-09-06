import React from 'react';

import styled from 'styled-components';

function StaticMeter({ label }) {
  return (
    <Box>
      <Header>
        <span>{label}</span>
        <sup>∞</sup>
      </Header>
      <Bar>
        <Knob />
      </Bar>
      <Note>Безлимит</Note>
    </Box>
  );
}

export default StaticMeter;

const Box = styled.div`
  display: grid;
  grid-template-rows: auto auto auto; /* header | bar | note */
  gap: 6px;
  margin: 14px 0;
  font-size: 14px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  color: #000;
  font-size: 12px;

  sup {
    line-height: 1;
    font-weight: 600;
    font-size: 14px;
  }
`;

const Bar = styled.div`
  position: relative;
  height: 14px;
  border-radius: 999px;
  background:
    linear-gradient(#99a1af 0 0) left/100% 100% no-repeat,
    #99a1af;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.6),
    inset 0 -1px 0 rgba(0, 0, 0, 0.06);
`;

const Knob = styled.div`
  position: absolute;
  right: -9px;
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #fff;
  border: 2px solid #99a1af;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
`;

const Note = styled.div`
  justify-self: end;
  font-size: 10px;
  color: gray;
  white-space: nowrap;
`;
