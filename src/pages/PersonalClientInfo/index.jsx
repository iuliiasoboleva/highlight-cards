import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { ru } from 'date-fns/locale';
import { Calendar } from 'lucide-react';

import axiosInstance from '../../axiosInstance';
import LoaderCentered from '../../components/LoaderCentered';
import CustomInput from '../../customs/CustomInput';
import { setClients } from '../../store/clientsSlice';
import DeleteClientModal from './DeleteClientModal';
import {
  Actions,
  Container,
  DateField,
  FormCard,
  Group,
  Label,
  PhoneWrapper,
  PrimaryButton,
  Row,
  SecondaryButton,
  Title,
} from './styles';

const PersonalClientInfo = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const clients = useSelector((state) => state.clients.list);
  const clientFromStore = clients.find((c) => String(c.id) === id);

  const [client, setClient] = useState(clientFromStore || null);
  const [loading, setLoading] = useState(!clientFromStore);

  const [formData, setFormData] = useState({
    name: client?.name || '',
    surname: client?.surname || '',
    email: client?.email || '',
    phone: client?.phone || '',
    birthdate: client?.birthdate ? new Date(client.birthdate.split('/').reverse().join('-')) : null,
  });

  useEffect(() => {
    if (client) return;
    (async () => {
      try {
        const res = await axiosInstance.get(`/clients/${id}`);
        setClient(res.data);
        setFormData({
          name: res.data.name || '',
          surname: res.data.surname || '',
          email: res.data.email || '',
          phone: res.data.phone || '',
          birthdate: res.data.birthdate
            ? new Date(res.data.birthdate.split('/').reverse().join('-'))
            : null,
        });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [client, id]);

  useEffect(() => {
    if (clientFromStore) setLoading(false);
  }, [clientFromStore]);

  if (loading) return <LoaderCentered />;

  if (!client)
    return (
      <Container>
        <p style={{ textAlign: 'center' }}>Клиент не найден</p>
      </Container>
    );

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    const payload = {
      ...formData,
      birthdate: formData.birthdate ? formData.birthdate.toISOString() : null,
    };

    axiosInstance
      .put(`/clients/${id}`, payload)
      .then((res) => {
        const updatedClients = clients.map((c) => (String(c.id) === id ? res.data : c));
        dispatch(setClients(updatedClients));
      })
      .catch((e) => console.error(e));
  };

  const handleDelete = () => {
    axiosInstance
      .delete(`/clients/${id}`)
      .then(() => {
        const remaining = clients.filter((c) => String(c.id) !== id);
        dispatch(setClients(remaining));
        navigate('/clients');
      })
      .catch((e) => console.error(e));
    setShowDeleteModal(false);
  };

  return (
    <>
      <Container>
        <Title>Персональная информация</Title>

        <FormCard as="form">
          <Row>
            <Group>
              <Label>Фамилия</Label>
              <CustomInput
                type="text"
                value={formData.surname}
                onChange={(e) => handleChange('surname', e.target.value)}
              />
            </Group>

            <Group>
              <Label>Дата рождения</Label>
              <DateField>
                <DatePicker
                  selected={formData.birthdate}
                  onChange={(date) => handleChange('birthdate', date)}
                  dateFormat="dd/MM/yyyy"
                  className="custom-input"
                  locale={ru}
                  maxDate={new Date()}
                  placeholderText="Выберите дату"
                  showYearDropdown
                  scrollableYearDropdown
                  yearDropdownItemNumber={100}
                />
                <Calendar className="calendar-icon" size={18} />
              </DateField>
            </Group>
          </Row>

          <Row>
            <Group>
              <Label>Имя</Label>
              <CustomInput
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
              />
            </Group>

            <Group>
              <Label>Email</Label>
              <CustomInput
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
              />
            </Group>
          </Row>

          <Row>
            <Group>
              <Label>Телефон</Label>
              <PhoneWrapper>
                <PhoneInput
                  country="ru"
                  value={formData.phone}
                  onChange={(phone) => handleChange('phone', '+' + phone)}
                  inputProps={{ required: true }}
                />
              </PhoneWrapper>
            </Group>
          </Row>

          <Actions>
            <PrimaryButton type="button" onClick={handleSave}>
              Сохранить
            </PrimaryButton>
            <SecondaryButton type="button" onClick={() => setShowDeleteModal(true)}>
              Удалить
            </SecondaryButton>
          </Actions>
        </FormCard>
      </Container>

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
