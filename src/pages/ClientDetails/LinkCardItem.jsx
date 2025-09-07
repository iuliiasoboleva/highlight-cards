import React, { useState } from 'react';

import {
  DashboardCopyBtn,
  DashboardCopyBtnWrapper,
  DashboardLinkCard,
  DashboardLinkText,
  DashboardLinkUrl,
  DashboardStatLabel,
} from './styles';

const LinkCardItem = ({ url, label }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <DashboardLinkCard>
      <DashboardLinkUrl>
        <DashboardLinkText title={url}>{url}</DashboardLinkText>
        <DashboardCopyBtnWrapper>
          <DashboardCopyBtn onClick={handleCopy} data-copied={copied}>
            {copied ? 'Скопировано' : 'Скопировать'}
          </DashboardCopyBtn>
        </DashboardCopyBtnWrapper>
      </DashboardLinkUrl>

      <DashboardStatLabel>{label}</DashboardStatLabel>
    </DashboardLinkCard>
  );
};

export default LinkCardItem;
