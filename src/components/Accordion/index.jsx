import React, { useState } from 'react';

import './styles.css';

const Accordion = ({ title, content }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className={`getpass-accordion-wrapper ${open ? 'open' : ''}`}>
      <button className="getpass-accordion" onClick={() => setOpen((prev) => !prev)} type="button">
        <span>{title}</span>
        <span className="getpass-accordion-icon" />
      </button>
      {open && <div className="getpass-accordion-content">{content}</div>}
    </div>
  );
};

export default Accordion;
