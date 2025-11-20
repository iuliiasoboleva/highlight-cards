import React, { useState, useEffect } from 'react';
import CustomModal from '../../customs/CustomModal';
import CustomCheckbox from '../../customs/CustomCheckbox';
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
  const [isUnlimited, setIsUnlimited] = useState(false);

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
            expiration_date: '', // Reset date if needed
        }));
    }
  }, [open, defaultValues]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    const data = { ...formData };
    if (isUnlimited) {
        data.expiration_date = '00.00.0000';
    } else if (data.expiration_date) {
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

