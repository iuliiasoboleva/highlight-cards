import React from 'react';

import { Header, HeaderTitle, Logo, Message, Push, Time, Title, Wrapper } from './styles';

const PushPreview = ({ card = {}, message, scheduledDate, isPreview }) => {
  const iconSrc = card?.design?.icon || '/push-logotype.svg';
  
  const getCompanyName = () => {
    const infoName = card?.infoFields?.companyName;
    if (infoName && infoName !== 'Название компании') {
      return infoName;
    }
    return card?.name || card?.title || 'Название карты';
  };
  
  const companyName = getCompanyName().toUpperCase();

  return (
    <Wrapper>
      <Push className={isPreview ? 'preview-scaled' : ''}>
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
