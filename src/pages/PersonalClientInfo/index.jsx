import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { ru } from 'date-fns/locale';
import { Calendar } from 'lucide-react';

import { setClients } from '../../store/clientsSlice';
import DeleteClientModal from './DeleteClientModal';

import './styles.css';

const PersonalClientInfo = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const clients = useSelector((state) => state.clients);
  const client = clients.find((c) => String(c.id) === id);

  const [formData, setFormData] = useState({
    name: client?.name || '',
    surname: client?.surname || '',
    email: client?.email || '',
    phone: client?.phone || '',
    birthdate: client?.birthdate ? new Date(client.birthdate.split('/').reverse().join('-')) : null,
  });

  if (!client) return <p>Клиент не найден</p>;

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    const updatedClients = clients.map((c) =>
      String(c.id) === id ? { ...c, ...formData, birthdate: formatDate(formData.birthdate) } : c,
    );
    dispatch(setClients(updatedClients));
  };

  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleDelete = () => {
    // dispatch(deleteClient(id));
    setShowDeleteModal(false);
    navigate('/clients');
  };

  return (
    <>
      <div className="client-personal-container">
        <h2 className="client-personal-title">Персональная информация</h2>
        <form className="client-personal-form">
          <div className="client-personal-row">
            <div className="client-personal-group">
              <label>Фамилия</label>
              <input
                type="text"
                value={formData.surname}
                onChange={(e) => handleChange('surname', e.target.value)}
                className="custom-input"
              />
            </div>
            <div className="client-personal-group date-picker-wrapper">
              <label>Дата рождения</label>
              <div className="client-date-input-wrapper">
                <DatePicker
                  selected={formData.birthdate}
                  onChange={(date) => handleChange('birthdate', date)}
                  dateFormat="dd/MM/yyyy"
                  locale={ru}
                  maxDate={new Date()}
                  placeholderText="Выберите дату"
                  className="custom-input"
                  showYearDropdown
                  scrollableYearDropdown
                  yearDropdownItemNumber={100}
                />
                <Calendar className="calendar-icon-overlay" size={18} />
              </div>
            </div>
          </div>
          <div className="client-personal-row">
            <div className="client-personal-group">
              <label>Имя</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="custom-input"
              />
            </div>
            <div className="client-personal-group">
              <label>Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="custom-input"
              />
            </div>
          </div>
          <div className="client-personal-row">
            <div className="client-personal-group">
              <label>Телефон</label>
              <PhoneInput
                country="ru"
                value={formData.phone}
                onChange={(phone) => handleChange('phone', '+' + phone)}
                inputStyle={{ width: '100%' }}
                inputProps={{ required: true }}
              />
            </div>
          </div>
          <div className="client-personal-actions">
            <button type="button" className="client-personal-btn save" onClick={handleSave}>
              Сохранить
            </button>
            <button
              type="button"
              className="client-personal-btn delete"
              onClick={() => setShowDeleteModal(true)}
            >
              Удалить
            </button>
          </div>
        </form>
      </div>
      {showDeleteModal && (
        <DeleteClientModal
          fullName={`${formData.name} ${formData.surname}`}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </>
  );
};

export default PersonalClientInfo;
