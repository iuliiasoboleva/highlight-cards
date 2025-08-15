import React from 'react';
import { Link } from 'react-router-dom';

import { Card, Image, LeftCol, Message, PageWrap, PrimaryLink, RightCol, Title } from './styles';

const NotFound = () => {
  return (
    <PageWrap>
      <Card>
        <LeftCol>
          <Image src="/images/404-heart.png" alt="Сердце с ключом" loading="lazy" />
        </LeftCol>

        <RightCol>
          <Title>Ошибка 404</Title>
          <Message>
            Неправильно набран адрес,
            <br />
            или такой страницы на сайте
            <br />
            больше не существует
          </Message>

          <PrimaryLink as={Link} to="/">
            Главная страница
          </PrimaryLink>
        </RightCol>
      </Card>
    </PageWrap>
  );
};

export default NotFound;
