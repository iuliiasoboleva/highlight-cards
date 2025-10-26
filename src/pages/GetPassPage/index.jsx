import React, { useState, useEffect } from 'react';
import 'react-phone-input-2/lib/style.css';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../axiosInstance';
import BASE_URL from '../../config';

import Accordion from '../../components/Accordion';
import CustomCheckbox from '../../customs/CustomCheckbox';
import CustomInput from '../../customs/CustomInput';
import CustomDatePicker from '../../customs/CustomDatePicker';
import CustomModal from '../../customs/CustomModal';
import { useToast } from '../../components/Toast';
import {
  AccordionsWrapper,
  AuthForm,
  AuthFormWrapper,
  CardBlock,
  Container,
  Header,
  HeaderBar,
  HeaderContent,
  StyledPhoneInput,
  Title,
  WalletButtonsWrapper,
  WalletButton,
} from './styles';
import NotFound from '../../components/NotFound';

const GetPassPage = () => {
  const { uuid } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [card, setCard] = useState(null);

  useEffect(() => {
    const fetchCard = async () => {
      try {
        const response = await axios.get(`/cards/${uuid}`);
        setCard(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Ошибка при получении карты:', error);
        setNotFound(true);
        setIsLoading(false);
      }
    };

    if (uuid) {
      fetchCard();
    }
  }, [uuid]);

  const getCompanyInfo = () => {
    if (!card) return 'Информация о компании не указана';
    
    const issuerName = card?.infoFields?.issuerName || card?.infoFields?.companyName;
    const issuerEmail = card?.infoFields?.issuerEmail;
    const issuerPhone = card?.infoFields?.issuerPhone;
    
    if (!issuerName && !issuerEmail && !issuerPhone) {
      return 'Информация о компании не указана';
    }
    
    const parts = [];
    if (issuerName) parts.push(issuerName);
    if (issuerEmail) parts.push(`Email: ${issuerEmail}`);
    if (issuerPhone) parts.push(`Телефон: ${issuerPhone}`);
    
    return parts.join('\n');
  };

  const getAccordionItems = () => {
    if (!card) return [];
    
    return [
      { title: 'Информация о компании', content: getCompanyInfo() },
      { title: 'Информация о карте', content: card?.infoFields?.howToGetStamp || 'Информация о карте не указана' },
      {
        title: 'Политика использования персональных данных',
        content: card?.policySettings?.fullPolicyText || 'Политика не указана',
      },
      { title: 'Условия использования', content: card?.infoFields?.fullPolicyText || 'Условия не указаны' },
    ];
  };

  const [formData, setFormData] = useState({});
  const [consent, setConsent] = useState({
    terms: false,
    marketing: false,
  });
  const [showCardExistsModal, setShowCardExistsModal] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhoneChange = (value) => {
    // Находим поле телефона в issueFormFields
    const phoneField = card?.issueFormFields?.find(field => field.type === 'phone');
    const key = phoneField ? phoneField.name : 'phone';
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setConsent((prev) => ({ ...prev, [name]: checked }));
  };

  const handleWalletInstall = async (walletType) => {
    if (!consent.terms) {
      toast.error('Необходимо согласиться с условиями использования');
      return;
    }

    if (!consent.marketing) {
      toast.error('Необходимо согласиться с обработкой персональных данных');
      return;
    }

    const missingFields = [];
    (card?.issueFormFields || []).forEach((field) => {
      if (field.required && (!formData[field.name] || formData[field.name].trim() === '')) {
        missingFields.push(field.name);
      }
    });

    if (missingFields.length > 0) {
      toast.error(`Заполните поля: ${missingFields.join(', ')}`);
      return;
    }

    const birthdayField = (card?.issueFormFields || []).find(
      (field) => field.type === 'birthday' || field.type === 'date'
    );
    
    if (birthdayField && formData[birthdayField.name]) {
      const birthdayValue = formData[birthdayField.name];
      const birthdayDate = new Date(birthdayValue);
      const today = new Date();
      
      if (birthdayDate > today) {
        toast.error('Дата рождения не может быть в будущем. Укажите корректную дату');
        return;
      }
      
      const age = Math.floor((today - birthdayDate) / (365.25 * 24 * 60 * 60 * 1000));
      
      if (age < 8) {
        toast.error('Возраст должен быть не менее 8 лет. Пожалуйста, укажите реальную дату рождения');
        return;
      }
    }

    try {
      const clientData = {};
      (card?.issueFormFields || []).forEach((field) => {
        if (formData[field.name] && formData[field.name].trim() !== '') {
          clientData[field.type] = formData[field.name];
        }
      });

      // Создаем ClientCard
      const response = await axios.post(`/cards/${uuid}/getpass`, {
        ...clientData,
        consent: consent,
      });

      const identifier = response.data?.identifier;
      
      if (!identifier) {
        toast.error('Не получен идентификатор карты');
        return;
      }
      
      if (walletType === 'apple') {
        toast.success('Переход в Apple Wallet...');
        
        const pkpassUrl = BASE_URL === '/' 
          ? `/pkpass/${identifier}`
          : `${BASE_URL.replace(/\/$/, '')}/pkpass/${identifier}`;
        
        setTimeout(() => {
          window.location.href = pkpassUrl;
        }, 500);
      } else if (walletType === 'google') {
        toast.success('Переход в Google Wallet...');
        
        const googleWalletUrl = BASE_URL === '/' 
          ? `/google-wallet/save/${identifier}?${new URLSearchParams(clientData).toString()}`
          : `${BASE_URL.replace(/\/$/, '')}/google-wallet/save/${identifier}?${new URLSearchParams(clientData).toString()}`;
        
        setTimeout(() => {
          window.location.href = googleWalletUrl;
        }, 500);
      }
    } catch (error) {
      console.error('Ошибка при создании карты:', error);
      console.error('Статус ошибки:', error.response?.status);
      console.error('Данные ошибки:', error.response?.data);
      
      if (error.response?.status === 409) {
        toast.error('Карта уже зарегистрирована');
      } else {
        toast.error('Не удалось создать карту. Попробуйте позже');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!consent.terms) {
      toast.error('Необходимо согласиться с условиями использования');
      return;
    }

    if (!consent.marketing) {
      toast.error('Необходимо согласиться с обработкой персональных данных');
      return;
    }

    try {
      // Фильтруем только валидные поля формы
      const clientData = {};
      if (card?.issueFormFields) {
        card.issueFormFields.forEach(field => {
          if (formData[field.name]) {
            // Используем field.type как ключ для backend API
            clientData[field.type] = formData[field.name];
          }
        });
      }

      // Создаем клиента и получаем .pkpass файл
      const response = await axios.get(`/passes/${uuid}`, {
        params: clientData,
        responseType: 'blob'
      });

      // Скачиваем .pkpass файл
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${uuid}.pkpass`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success('Карта успешно создана!');
      setTimeout(() => navigate('/'), 1500);
    } catch (error) {
      console.error('Ошибка при создании карты:', error);

      // Проверяем, является ли ошибка конфликтом (карта уже зарегистрирована)
      if (error.response?.status === 409) {
        setShowCardExistsModal(true);
      } else {
        toast.error('Произошла ошибка при создании карты. Попробуйте еще раз');
      }
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
                    value={formData[field.name] || ''}
                    onChange={handlePhoneChange}
                    inputProps={{
                      name: 'phone',
                      required: field.required,
                    }}
                  />
                ) : field.type === 'gender' ? (
                  <select
                    name={field.name}
                    value={formData[field.name] || ''}
                    onChange={handleChange}
                    required={field.required}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #d9d9d9',
                      borderRadius: '4px',
                      backgroundColor: '#fff',
                      fontSize: '16px',
                      outline: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    <option value="">Выберите пол</option>
                    <option value="male">Мужской</option>
                    <option value="female">Женский</option>
                  </select>
                ) : (field.type === 'date' || field.type === 'birthday') ? (
                  <CustomDatePicker
                    value={formData[field.name] || ''}
                    onChange={(value) => setFormData((prev) => ({ ...prev, [field.name]: value }))}
                    placeholder={field.name}
                  />
                ) : (
                  <CustomInput
                    name={field.name}
                    placeholder={field.name}
                    value={formData[field.name] || ''}
                    onChange={handleChange}
                    required={field.required}
                    type={
                      field.type === 'email'
                        ? 'email'
                        : field.type === 'number'
                          ? 'number'
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

            <WalletButtonsWrapper>
              <WalletButton type="button" onClick={() => handleWalletInstall('apple')}>
                <span>Apple Wallet</span>
              </WalletButton>
              
              <WalletButton type="button" onClick={() => handleWalletInstall('google')}>
                <span>Google Wallet</span>
              </WalletButton>
            </WalletButtonsWrapper>
          </AuthForm>

          <AccordionsWrapper>
            {getAccordionItems().map((item) => (
              <Accordion key={item.title} title={item.title} content={item.content} />
            ))}
          </AccordionsWrapper>
        </CardBlock>
      </AuthFormWrapper>

      <CustomModal
        open={showCardExistsModal}
        onClose={() => setShowCardExistsModal(false)}
        title="Карта уже зарегистрирована"
        maxWidth={420}
        aria-label="Уведомление о существующей карте"
      >
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: '#f59e0b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            fontSize: '30px',
            color: 'white'
          }}>
            ⚠️
          </div>
          <p style={{ margin: '0 0 16px', fontWeight: '500', fontSize: '16px' }}>
            Данная карта уже зарегистрирована
          </p>
          <p style={{ margin: 0, color: '#666', fontSize: '14px', lineHeight: '1.5' }}>
            Для восстановления доступа к карте обратитесь к менеджеру точки продаж.
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '24px' }}>
          <CustomModal.PrimaryButton
            onClick={() => setShowCardExistsModal(false)}
            style={{ minWidth: '120px' }}
          >
            Понятно
          </CustomModal.PrimaryButton>
        </div>
      </CustomModal>
    </Container>
  );
};

export default GetPassPage;
