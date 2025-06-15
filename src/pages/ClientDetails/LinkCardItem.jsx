import React, { useState } from 'react';

import './styles.css';

const LinkCardItem = ({ url, label }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="dashboard-link-card">
      <div className="dashboard-link-url">
        <span className="dashboard-link-text" title={url}>
          {url}
        </span>
        <div className="dashboard-copy-btn-wrapper">
          <button className={`dashboard-copy-btn ${copied ? 'copied' : ''}`} onClick={handleCopy}>
            {copied ? 'Скопировано' : 'Скопировать'}
          </button>
        </div>
      </div>

      <div className="dashboard-stat-label">{label}</div>
    </div>
  );
};

export default LinkCardItem;
