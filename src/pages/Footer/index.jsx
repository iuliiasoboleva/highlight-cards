import React from 'react';

import { Company, FooterCol, FooterLink, FooterWrap, Inn, Phone, Separator } from './styles';

const Footer = () => (
  <FooterWrap>
    <FooterCol>
      <Company>ООО "ЛОЯЛ КЛАБ"</Company>
      <Inn>ИНН 9715518580</Inn>
    </FooterCol>

    <FooterCol>
      <FooterLink href="mailto:support@loyalclub.ru">support@loyalclub.ru</FooterLink>
      <Separator>|</Separator>
      <Phone>8 (800) 770-71-21</Phone>
    </FooterCol>

    <FooterCol>
      <FooterLink href="https://loyalclub.ru/oferta" target="_blank" rel="noopener noreferrer">
        Публичная оферта
      </FooterLink>
      <Separator>|</Separator>
      <FooterLink href="https://loyalclub.ru/policy" target="_blank" rel="noopener noreferrer">
        Политика конфиденциальности
      </FooterLink>
    </FooterCol>
  </FooterWrap>
);

export default Footer;
