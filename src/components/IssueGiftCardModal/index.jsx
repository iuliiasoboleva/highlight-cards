import React, { useState, useEffect, useRef } from 'react';
import CustomModal from '../../customs/CustomModal';
import CustomCheckbox from '../../customs/CustomCheckbox';
import { 
  Input, 
  InputGroup, 
  Label, 
  PrimaryButton, 
  SecondaryButton, 
  TextArea,
  SectionTitle,
  RadioGroup,
  RadioLabel,
  RequiredMark
} from './styles';

const IssueGiftCardModal = ({ open, onClose, onIssue, loading, defaultValues }) => {
  const [formData, setFormData] = useState({
    recipient_name: '',
    surname: '',
    name: '',
    phone: '',
    email: '',
    gender: '',
    birthday: '',
    amount: '',
    expiration_date: '',
    greeting_message: '',
    button_text: '',
    button_link: '',
    terms_text: '',
  });
  const [isUnlimited, setIsUnlimited] = useState(false);
  const phoneInputRef = useRef(null);

  const formatPhoneInput = (value) => {
    const digits = value.replace(/\D/g, '');
    
    if (!digits) return '';
    
    let workDigits = digits;
    if (workDigits[0] !== '7') {
      workDigits = '7' + workDigits;
    }
    
    workDigits = workDigits.slice(0, 11);
    
    let formatted = '+7';
    const rest = workDigits.slice(1);
    
    if (rest.length === 0) return '+7';
    
    if (rest.length > 0) formatted += `(${rest.slice(0, 3)}`;
    if (rest.length >= 3) formatted += `)`;
    if (rest.length > 3) formatted += rest.slice(3, 6);
    if (rest.length >= 6) formatted += `-${rest.slice(6, 8)}`;
    if (rest.length >= 8) formatted += `-${rest.slice(8, 10)}`;
    
    return formatted;
  };

  const getCaretPosByDigits = (value, digitsCount) => {
    if (!value) return 0;
    if (!digitsCount) return 0;

    let count = 0;
    for (let i = 0; i < value.length; i += 1) {
      if (/\d/.test(value[i])) {
        count += 1;
        if (count === digitsCount) {
          return i + 1;
        }
      }
    }

    return value.length;
  };

  const handlePhoneKeyDown = (e) => {
    if (e.key !== 'Backspace') return;

    const { selectionStart, selectionEnd, value } = e.target;
    if (selectionStart !== selectionEnd) return;

    const leftIndex = selectionStart - 1;
    if (leftIndex < 0) return;

    if (/\d/.test(value[leftIndex])) return;

    e.preventDefault();

    const digits = value.replace(/\D/g, '').split('');
    if (!digits.length) {
      setFormData((prev) => ({ ...prev, phone: '' }));
      return;
    }

    const digitsBeforeCaret = value.slice(0, selectionStart).replace(/\D/g, '').length;
    if (!digitsBeforeCaret) return;

    digits.splice(digitsBeforeCaret - 1, 1);
    const newDigits = digits.join('');
    const formatted = formatPhoneInput(newDigits);

    setFormData((prev) => ({ ...prev, phone: formatted }));

    requestAnimationFrame(() => {
      if (phoneInputRef.current) {
        const caretDigits = Math.max(digitsBeforeCaret - 1, 0);
        const nextPos = getCaretPosByDigits(formatted, caretDigits);
        phoneInputRef.current.setSelectionRange(nextPos, nextPos);
      }
    });
  };

  useEffect(() => {
    if (open && defaultValues) {
        const settings = defaultValues.settings || {};
        const infoFields = defaultValues.infoFields || {};
        const isExpUnlimited = defaultValues.expirationDate === '00.00.0000';
        
        setIsUnlimited(isExpUnlimited);
        setFormData(prev => ({
            ...prev,
            button_text: settings.giftButtonText || 'Записаться онлайн',
            button_link: settings.giftButtonLink || '',
            terms_text: settings.giftTermsText || 'Акции и скидки не применяются к подарочному сертификату',
            greeting_message: infoFields.message || '',
            amount: defaultValues.balanceMoney || '',
            expiration_date: '',
            surname: '',
            name: '',
            phone: '',
            email: '',
            gender: '',
            birthday: '',
            recipient_name: '',
        }));
    }
  }, [open, defaultValues]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      setFormData((prev) => ({ ...prev, [name]: formatPhoneInput(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = () => {
    const data = { ...formData };
    if (isUnlimited) {
        data.expiration_date = '00.00.0000';
    } else if (data.expiration_date) {
       const [y, m, d] = data.expiration_date.split('-');
       data.expiration_date = `${d}.${m}.${y}`;
    }

    if (data.birthday) {
       const [y, m, d] = data.birthday.split('-');
       data.birthday = `${d}.${m}.${y}`;
    }
    
    onIssue(data);
  };

  return (
    <CustomModal
      open={open}
      onClose={onClose}
      title="Выпуск подарочного сертификата"
      actions={
        <>
          <PrimaryButton onClick={handleSubmit} disabled={loading}>
            {loading ? 'Выпуск...' : 'Выпустить'}
          </PrimaryButton>
          <SecondaryButton onClick={onClose} disabled={loading}>
            Отмена
          </SecondaryButton>
        </>
      }
    >
      <SectionTitle>Данные клиента</SectionTitle>

      <InputGroup>
        <Label>
          Фамилия<RequiredMark>*</RequiredMark>
        </Label>
        <Input
          name="surname"
          value={formData.surname}
          onChange={handleChange}
          placeholder="Иванов"
          required
        />
      </InputGroup>

      <InputGroup>
        <Label>
          Имя<RequiredMark>*</RequiredMark>
        </Label>
        <Input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Дмитрий"
          required
        />
      </InputGroup>

      <InputGroup>
        <Label>
          Телефон<RequiredMark>*</RequiredMark>
        </Label>
        <Input
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          onKeyDown={handlePhoneKeyDown}
          ref={phoneInputRef}
          placeholder="+7 (900) 123-45-67"
          required
        />
      </InputGroup>

      <InputGroup>
        <Label>Email</Label>
        <Input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="example@mail.ru"
        />
      </InputGroup>

      <InputGroup>
        <Label>Пол</Label>
        <RadioGroup>
          <RadioLabel>
            <input
              type="radio"
              name="gender"
              value="male"
              checked={formData.gender === 'male'}
              onChange={handleChange}
            />
            М
          </RadioLabel>
          <RadioLabel>
            <input
              type="radio"
              name="gender"
              value="female"
              checked={formData.gender === 'female'}
              onChange={handleChange}
            />
            Ж
          </RadioLabel>
        </RadioGroup>
      </InputGroup>

      <InputGroup>
        <Label>Дата рождения</Label>
        <Input
          name="birthday"
          type="date"
          value={formData.birthday}
          onChange={handleChange}
        />
      </InputGroup>

      <SectionTitle>Данные сертификата</SectionTitle>

      <InputGroup>
        <Label>Имя получателя (для отображения на сертификате)</Label>
        <Input
          name="recipient_name"
          value={formData.recipient_name}
          onChange={handleChange}
          placeholder="Дмитрию"
        />
      </InputGroup>

      <InputGroup>
        <Label>Сумма (₽)</Label>
        <Input
          name="amount"
          type="number"
          value={formData.amount}
          onChange={handleChange}
          placeholder="5000"
        />
      </InputGroup>

      <InputGroup>
        <Label>Срок действия (до)</Label>
        <Input
          name="expiration_date"
          type="date"
          value={formData.expiration_date}
          onChange={handleChange}
          disabled={isUnlimited}
        />
        <div style={{ marginTop: 8 }}>
            <CustomCheckbox
                label="Бессрочно"
                checked={isUnlimited}
                onChange={(e) => setIsUnlimited(e.target.checked)}
            />
        </div>
      </InputGroup>

      <InputGroup>
        <Label>Поздравительный текст (до 180 символов)</Label>
        <TextArea
          name="greeting_message"
          maxLength={180}
          value={formData.greeting_message}
          onChange={handleChange}
          placeholder="С днем рождения!"
        />
      </InputGroup>

      <InputGroup>
        <Label>Текст на кнопке</Label>
        <Input
          name="button_text"
          value={formData.button_text}
          onChange={handleChange}
          placeholder="Записаться онлайн"
        />
      </InputGroup>

      <InputGroup>
        <Label>Ссылка в кнопке</Label>
        <Input
          name="button_link"
          value={formData.button_link}
          onChange={handleChange}
          placeholder="https://..."
        />
      </InputGroup>

      <InputGroup>
        <Label>Сообщение под датой (до 64 символов)</Label>
        <Input
          name="terms_text"
          maxLength={64}
          value={formData.terms_text}
          onChange={handleChange}
          placeholder="Акции и скидки не применяются..."
        />
      </InputGroup>
    </CustomModal>
  );
};

export default IssueGiftCardModal;

