import React, { useState, useEffect } from 'react';
import CustomModal from '../../customs/CustomModal';
import { Input, InputGroup, Label, PrimaryButton, SecondaryButton, TextArea } from './styles';

const IssueGiftCardModal = ({ open, onClose, onIssue, loading, defaultValues }) => {
  const [formData, setFormData] = useState({
    recipient_name: '',
    amount: '',
    expiration_date: '',
    greeting_message: '',
    button_text: '',
    button_link: '',
    terms_text: '',
  });

  useEffect(() => {
    if (open && defaultValues) {
        // Calculate default expiry (e.g. +1 year) if not present? 
        // Or just leave empty. 
        // Assuming defaultValues contain card settings
        const settings = defaultValues.settings || {};
        setFormData(prev => ({
            ...prev,
            button_text: settings.giftButtonText || 'Записаться онлайн',
            button_link: settings.giftButtonLink || '',
            terms_text: settings.giftTermsText || 'Акции и скидки не применяются к подарочному сертификату',
            amount: defaultValues.balanceMoney || '',
        }));
    }
  }, [open, defaultValues]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    const data = { ...formData };
    if (data.expiration_date) {
       const [y, m, d] = data.expiration_date.split('-');
       data.expiration_date = `${d}.${m}.${y}`;
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
      <InputGroup>
        <Label>Имя получателя</Label>
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
        />
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

