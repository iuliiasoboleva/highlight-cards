import React from 'react';

import { Header, HeaderTitle, Logo, Message, Push, Time, Title, Wrapper } from './styles';

const PushPreview = ({ card = {}, message, scheduledDate }) => {
  const iconSrc = card?.design?.icon || '/push-logotype.svg';
  const companyName = (card?.infoFields?.companyName || 'Название компании').toUpperCase();

  return (
    <Wrapper>
      <Push>
        <Header>
          <HeaderTitle>
            <Logo src={iconSrc} alt="logo" />
            <Title title={companyName}>{companyName}</Title>
          </HeaderTitle>
          <Time>{scheduledDate || 'сейчас'}</Time>
        </Header>

        <Message>
          {message ||
            'Текст push-сообщения в боковом превью сервиса с возможностью использования emojis 👀 🧾 💬 😍'}
        </Message>
      </Push>
    </Wrapper>
  );
};

export default PushPreview;
