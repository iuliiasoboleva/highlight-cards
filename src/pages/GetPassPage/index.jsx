import React, { useState, useEffect } from 'react';
import 'react-phone-input-2/lib/style.css';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../axiosInstance';

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
import NotFound from '../../components/NotFound';

const GetPassPage = () => {
  const { cardId } = useParams();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [card, setCard] = useState(null);

  useEffect(() => {
    const fetchCard = async () => {
      try {
        const response = await axios.get(`/cards/${cardId}`);
        setCard(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Ошибка при получении карты:', error);
        setNotFound(true);
        setIsLoading(false);
      }
    };

    if (cardId) {
      fetchCard();
    }
  }, [cardId]);

  const accordionItems = [
    { title: 'Информация о компании', content: card?.infoFields?.companyName || 'Информация о компании не указана' },
    { title: 'Информация о карте', content: card?.infoFields?.howToGetStamp || 'Информация о карте не указана' },
    {
      title: 'Политика использования персональных данных',
      content: card?.policySettings?.fullPolicyText || 'Политика не указана',
    },
    { title: 'Условия использования', content: card?.infoFields?.fullPolicyText || 'Условия не указаны' },
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!consent.terms) {
      alert('Необходимо согласиться с условиями использования');
      return;
    }

    if (!consent.marketing) {
      alert('Необходимо согласиться с обработкой персональных данных');
      return;
    }

    try {
      // Фильтруем только валидные поля формы
      const clientData = {};
      if (card?.issueFormFields) {
        card.issueFormFields.forEach(field => {
          if (formData[field.name]) {
            clientData[field.name] = formData[field.name];
          }
        });
      }

      // Создаем клиента и получаем .pkpass файл
      const response = await axios.get(`/passes/${cardId}`, {
        params: clientData,
        responseType: 'blob'
      });

      // Скачиваем .pkpass файл
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${cardId}.pkpass`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      alert('Карта успешно создана! Файл .pkpass скачан.');
      navigate('/'); // Перенаправляем на главную страницу
    } catch (error) {
      console.error('Ошибка при создании карты:', error);
      alert('Произошла ошибка при создании карты. Попробуйте еще раз.');
    }
  };

  if (isLoading) return <div>Загрузка...</div>;
  if (notFound) return <NotFound />;

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
