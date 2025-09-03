import React from 'react';

import styled from 'styled-components';

function StaticMeter({ label }) {
  return (
    <MeterBox>
      <span className="label">{label}</span>
      <span className="meter" />
      <span className="note">Безлимит</span>
    </MeterBox>
  );
}

const MeterBox = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto 10px auto; /* label | bar | note */
  gap: 6px;
  margin: 14px 0;
  font-size: 14px;

  .label {
    color: #111827;
  }

  .meter {
    position: relative;
    height: 10px;
    border-radius: 999px;
    background:
      linear-gradient(#8a92a3 0 0) left/100% 100% no-repeat,
      #c9d0da;
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.6),
      inset 0 -1px 0 rgba(0, 0, 0, 0.06);
  }

  .meter::before {
    content: '∞';
    position: absolute;
    right: 26px;
    top: -14px;
    font-size: 12px;
    color: #6b7280;
    line-height: 1;
  }

  .meter::after {
    content: '';
    position: absolute;
    right: -9px;
    top: 50%;
    transform: translateY(-50%);
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #f3f5f8;
    border: 2px solid #c3cad4;
  }

  .note {
    justify-self: end;
    font-size: 12px;
    color: #9aa3af;
    white-space: nowrap;
    margin-top: 2px;
  }
`;

export default StaticMeter;
