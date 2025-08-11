import React, { useState } from 'react';

import { Content, HeaderBtn, Icon, Wrapper } from './styles';

const Accordion = ({ title, content }) => {
  const [open, setOpen] = useState(false);

  return (
    <Wrapper $open={open}>
      <HeaderBtn
        type="button"
        onClick={() => setOpen((p) => !p)}
        aria-expanded={open}
        aria-controls="accordion-panel"
      >
        <span>{title}</span>
        <Icon $open={open} />
      </HeaderBtn>

      {open && <Content id="accordion-panel">{content}</Content>}
    </Wrapper>
  );
};

export default Accordion;
