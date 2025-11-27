import React, { useEffect, useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { useSelector } from 'react-redux';

import axiosInstance from '../../axiosInstance';
import CustomInput from '../../customs/CustomInput';
import CustomModal from '../../customs/CustomModal';
import InnSuggestInput from '../InnSuggestInput';
import { useToast } from '../Toast';

const ContactModal = ({ isOpen, onClose, pointsRequested }) => {
  const { addToast } = useToast();
  const user = useSelector((state) => state.user);
  const authUser = useSelector((state) => state.auth.user);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    inn: '',
  });
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [companyName, setCompanyName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orgDataLoaded, setOrgDataLoaded] = useState(false);

  const currentUser = user || authUser;
  
  useEffect(() => {
    const loadOrgData = async () => {
      if (!isOpen || !currentUser?.organization_id) return;
      
      setFormData({
        name: currentUser.name || '',
        phone: currentUser.phone || '',
        inn: '',
      });
      setCompanyName('');
      setSelectedCompany(null);
      setOrgDataLoaded(false);
      
      try {
        const res = await axiosInstance.get(`/organizations/${currentUser.organization_id}`);
        const org = res.data;
        
        if (org) {
          if (org.inn) {
            setFormData(prev => ({ ...prev, inn: org.inn }));
            setSelectedCompany({ data: { inn: org.inn, name: org.name } });
          }
          if (org.name) {
            setCompanyName(org.name);
          }
          setOrgDataLoaded(true);
        }
      } catch (e) {
        console.error('Ошибка загрузки данных организации:', e);
      }
    };
    
    loadOrgData();
  }, [isOpen, currentUser]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCompanySelect = (company) => {
    setSelectedCompany(company);
    setCompanyName(company.value || company.data?.name || '');
    setFormData((prev) => ({
      ...prev,
      inn: company.data.inn,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.phone) {
      addToast('Пожалуйста, заполните имя и телефон', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      await axiosInstance.post('/contact/request', {
        name: formData.name,
        phone: formData.phone,
        inn: formData.inn,
        company_name: companyName,
        organization_id: currentUser?.organization_id,
        user_id: currentUser?.id,
        points_requested: pointsRequested,
      });

      setIsSuccess(true);
      setIsSubmitting(false);

      setTimeout(() => {
        handleClose();
      }, 3000);
    } catch (error) {
      console.error('Ошибка отправки формы:', error);
      addToast('Произошла ошибка при отправке формы', 'error');
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsSuccess(false);
    setFormData({ name: '', phone: '', inn: '' });
    setSelectedCompany(null);
    setCompanyName('');
    setOrgDataLoaded(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <CustomModal
      open={isOpen}
      onClose={handleClose}
      title={isSuccess ? 'Заявка отправлена!' : 'Связаться с нами'}
      maxWidth={420}
      aria-label="Форма обратной связи"
    >
      {isSuccess ? (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: '#c31e3c',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              fontSize: '30px',
              color: 'white',
            }}
          >
            ✓
          </div>
          <p style={{ margin: '0 0 10px', fontWeight: '500' }}>Спасибо за обращение!</p>
          <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
            Мы получили вашу заявку и свяжемся с вами в ближайшее время.
          </p>
        </div>
      ) : (
        <>
          <div style={{ marginBottom: '20px' }}>
            <CustomInput
              label="Имя"
              placeholder="Ваше имя"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '6px',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
              }}
            >
              Номер телефона *
            </label>
            <PhoneInput
              country="ru"
              value={formData.phone}
              onChange={(phone) => handleInputChange('phone', '+' + phone)}
              inputProps={{ required: true }}
              containerStyle={{
                width: '100%',
              }}
              inputStyle={{
                width: '100%',
                padding: '8px 8px 8px 48px',
                border: '1px solid #d5d5dd',
                borderRadius: '6px',
                height: '40px',
                fontSize: '14px',
              }}
              buttonStyle={{
                border: '1px solid #d5d5dd',
                borderRight: '0',
                borderRadius: '6px 0 0 6px',
              }}
            />
          </div>

          {orgDataLoaded && formData.inn ? (
            <>
              <div style={{ marginBottom: '20px' }}>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '6px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                  }}
                >
                  ИНН
                </label>
                <input
                  type="text"
                  value={formData.inn}
                  readOnly
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d5d5dd',
                    borderRadius: '6px',
                    height: '40px',
                    fontSize: '14px',
                    backgroundColor: '#f9fafb',
                    color: '#6b7280',
                  }}
                />
              </div>
              
              {companyName && (
                <div style={{ marginBottom: '24px' }}>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '6px',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                    }}
                  >
                    Наименование организации
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    readOnly
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #d5d5dd',
                      borderRadius: '6px',
                      height: '40px',
                      fontSize: '14px',
                      backgroundColor: '#f9fafb',
                      color: '#6b7280',
                    }}
                  />
                </div>
              )}
            </>
          ) : (
            <>
              <div style={{ marginBottom: '24px' }}>
                <InnSuggestInput
                  label="ИНН"
                  placeholder="Введите ИНН (необязательно)"
                  value={formData.inn}
                  onChange={(value) => handleInputChange('inn', value)}
                  onSelect={handleCompanySelect}
                />
              </div>

              {companyName && (
                <div style={{ marginBottom: '24px' }}>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '6px',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                    }}
                  >
                    Наименование организации
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    readOnly
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #d5d5dd',
                      borderRadius: '6px',
                      height: '40px',
                      fontSize: '14px',
                      backgroundColor: '#f9fafb',
                      color: '#6b7280',
                    }}
                  />
                </div>
              )}
            </>
          )}

          <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
            <CustomModal.SecondaryButton
              onClick={handleClose}
              style={{ flex: 1 }}
              disabled={isSubmitting}
            >
              Отмена
            </CustomModal.SecondaryButton>

            <CustomModal.PrimaryButton
              onClick={handleSubmit}
              disabled={isSubmitting || !formData.name || !formData.phone}
              style={{ flex: 1 }}
            >
              {isSubmitting ? 'Отправка...' : 'Отправить'}
            </CustomModal.PrimaryButton>
          </div>
        </>
      )}
    </CustomModal>
  );
};

export default ContactModal;
