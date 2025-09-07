import React, { useState } from 'react';
import 'react-phone-input-2/lib/style.css';
import { useSelector } from 'react-redux';

import PwaIcon from '../../assets/icons/pwa.svg';
import Accordion from '../../components/Accordion';
import CustomCheckbox from '../../customs/CustomCheckbox';
import CustomInput from '../../customs/CustomInput';
import {
  AccordionsWrapper,
  AuthForm,
  AuthFormWrapper,
  CardBlock,
  Container,
  Header,
  HeaderBar,
  HeaderContent,
  PwaButton,
  PwaIconImg,
  StyledPhoneInput,
  Title,
} from './styles';

const GetPassPage = () => {
  const card = useSelector((state) => state.cards.currentCard);

  const accordionItems = [
    { title: 'Информация о компании', content: card?.infoFields?.companyName || '...' },
    { title: 'Информация о карте', content: card?.infoFields?.howToGetStamp || '...' },
    {
      title: 'Политика использования персональных данных',
      content: card?.policySettings?.fullPolicyText || '...',
    },
    { title: 'Условия использования', content: card?.infoFields?.fullPolicyText || '...' },
  ];

  const [formData, setFormData] = useState({});
  const [touchedFields, setTouchedFields] = useState({});
  const [consent, setConsent] = useState({
    terms: false,
    marketing: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhoneChange = (value) => {
    setFormData((prev) => ({ ...prev, phone: value }));
  };

  const handleBlur = (name) => {
    setTouchedFields((prev) => ({ ...prev, [name]: true }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setConsent((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submit:', { ...formData, ...consent });
  };

  if (!card) return <div>Загрузка...</div>;

  return (
    <Container>
      <Header>
        <HeaderBar>
          <HeaderContent>{card?.title || ''}</HeaderContent>
        </HeaderBar>
      </Header>

      <AuthFormWrapper>
        <Title>
          {card?.infoFields?.description || 'Получайте бонусные баллы за каждую покупку.'}
        </Title>

        <CardBlock>
          <AuthForm onSubmit={handleSubmit}>
            {(card?.issueFormFields || []).map((field) => (
              <div key={field.name}>
                {field.type === 'phone' ? (
                  <StyledPhoneInput
                    country="ru"
                    value={formData.phone || ''}
                    onChange={handlePhoneChange}
                    inputProps={{
                      name: 'phone',
                      required: field.required,
                    }}
                  />
                ) : (
                  <CustomInput
                    name={field.name}
                    placeholder={field.name}
                    value={formData[field.name] || ''}
                    onChange={handleChange}
                    onBlur={() => handleBlur(field.name)}
                    required={field.required}
                    type={
                      field.type === 'email'
                        ? 'email'
                        : field.type === 'number'
                          ? 'number'
                          : field.type === 'date'
                            ? 'date'
                            : 'text'
                    }
                    pattern={
                      field.type === 'text'
                        ? "^[A-Za-zА-Яа-яЁё\\s'-]{2,}$"
                        : field.type === 'number'
                          ? '^\\d+$'
                          : undefined
                    }
                  />
                )}
              </div>
            ))}

            {card?.policySettings?.policyEnabled && (
              <CustomCheckbox
                name="terms"
                checked={consent.terms}
                onChange={handleCheckboxChange}
                required
                label="Я прочитал и принимаю"
                linkLabel="условия использования"
                linkHref="https://loyalclub.ru/oferta"
              />
            )}

            <CustomCheckbox
              name="marketing"
              label="Я согласен с тем, что мои личные данные могут использоваться и предоставляться для целей прямого маркетинга."
              checked={consent.marketing}
              onChange={handleCheckboxChange}
              required
            />

            <PwaButton type="submit">
              <PwaIconImg src={PwaIcon} alt="PWA" />
              <span>Установить на домашний экран</span>
            </PwaButton>
          </AuthForm>

          <AccordionsWrapper>
            {accordionItems.map((item) => (
              <Accordion key={item.title} title={item.title} content={item.content} />
            ))}
          </AccordionsWrapper>
        </CardBlock>
      </AuthFormWrapper>
    </Container>
  );
};

export default GetPassPage;
