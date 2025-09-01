import React from 'react';

import { Container, HighlightCard, Left, Logo, MobileHighlightCard, Right } from './styles';

const AuthLayout = ({ children }) => {
  return (
    <Container>
      <Left>
        <HighlightCard />
      </Left>

      <Right>
        <MobileHighlightCard>
          <Logo src="/logoColored.png" alt="Logo" />
          <p>Цифровые карты лояльности для бизнеса Apple Wallet и Google Pay</p>
        </MobileHighlightCard>
        {children}
      </Right>
    </Container>
  );
};

export default AuthLayout;
