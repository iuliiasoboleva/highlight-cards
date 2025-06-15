import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';

import { Camera, HelpCircle, PlusCircle, Search, Loader2 } from 'lucide-react';

import CustomTable from '../../components/CustomTable';
import ManagerModal from '../../components/ManagerModal';
import RoleSwitcher from '../../components/RoleSwitcher';
import SalesPointsModal from '../../components/SalesPointsModal';
import { managersHeaders } from '../../mocks/managersInfo';
import { locationsHeaders } from '../../mocks/mockLocations';
import { createManager, deleteManager, editManager, fetchManagers } from '../../store/managersSlice';
import { addLocation, fetchBranches, createBranch, deleteBranch, editBranch } from '../../store/salesPointsSlice';

import './styles.css';

const ManagersPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showAddModal, setShowAddModal] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [editModalData, setEditModalData] = useState(null);
  const [showLocationModal, setShowLocationModal] = useState(false);

  const { list: managers, loading: mLoading } = useSelector((state) => state.managers);
  const { list: locations, loading: lLoading } = useSelector((state) => state.locations);
  const orgId = useSelector((state)=> state.user.organization_id);

  const clients = useSelector((state) => state.clients);

  const managersColumns = [
    ...managersHeaders.map((header) => {
      if (header.key === 'shift') {
        return {
          key: header.key,
          title: header.label,
          className: 'text-center',
          cellClassName: 'text-center',
          render: (row) => {
            if (row.shift) return `${row.shift.startShift || ''} - ${row.shift.endShift || ''}`;
            return `${row.start_shift || ''} - ${row.end_shift || ''}`;
          },
        };
      }
      return {
        key: header.key,
        title: header.label,
        className: 'text-center',
        cellClassName: 'text-center',
      };
    }),
    {
      key: 'actions',
      title: 'Действия',
      className: 'text-center',
      cellClassName: 'text-center',
      render: (row) => (
        <div className="manager-edit-button" style={{cursor:'pointer'}} onClick={() => setEditModalData(row)}>
          ✏️
        </div>
      ),
    },
  ];

  const locationColumns = locationsHeaders.map((header) => {
    if (['clientsCount', 'cardsIssued', 'pointsAccumulated'].includes(header.key)) {
      return {
        key: header.key,
        title: header.label,
        className: 'text-center',
        cellClassName: 'text-center',
        render: (row) => row[header.key] ?? 0,
      };
    }
    return {
      key: header.key,
      title: header.label,
      className: 'text-center',
      cellClassName: 'text-center',
    };
  });

  locationColumns.push({
    key: 'actions',
    title: 'Действия',
    className: 'text-center',
    cellClassName: 'text-center',
    render: (row) => (
      <div className="manager-edit-button" style={{cursor:'pointer'}} onClick={() => {setInitialLocationData(row);setShowLocationModal(true);}}>
        ✏️
      </div>
    ),
  });

  const [initialLocationData, setInitialLocationData] = useState(null);

  const handleSave = (manager) => {
    if (manager.id) {
      const payload = {
        id: manager.id,
        name: manager.name,
        surname: manager.surname,
        email: manager.email,
        phone: manager.phone,
        branch_id: null,
        role: 'manager',
        locations: manager.location ? [manager.location] : manager.locations,
        status: manager.status,
        start_shift: manager.shift?.startShift || manager.start_shift,
        end_shift: manager.shift?.endShift || manager.end_shift,
      };
      dispatch(editManager(payload)).unwrap().then(()=>{
        dispatch(fetchManagers(orgId));
      });
    } else {
      const payload = {
        name: manager.name,
        surname: manager.surname,
        email: manager.email,
        phone: manager.phone,
        organization_id: orgId,
        branch_id: null,
        role: 'manager',
        locations: manager.location ? [manager.location] : [],
        status: manager.status,
        start_shift: manager.shift?.startShift,
        end_shift: manager.shift?.endShift,
      };
      dispatch(createManager(payload)).unwrap().then(()=>{
        dispatch(fetchManagers(orgId));
      });
    }
    setEditModalData(null);
    setShowAddModal(false);
  };

  const handleDelete = (id) => {
    dispatch(deleteManager(id)).unwrap().then(() => {
      dispatch(fetchManagers(orgId));
    });
    setEditModalData(null);
  };

  const handleFindCustomer = () => {
    const trimmedCard = cardNumber.trim();
    if (!trimmedCard) return;

    const foundClient = clients.find((client) =>
      client.cards.some((card) => card.cardNumber === trimmedCard),
    );

    if (foundClient) {
      navigate(`/customer/card/${trimmedCard}`);
    } else {
      alert('Клиент с такой картой не найден');
    }
  };

  useEffect(()=>{
    if(orgId){
      dispatch(fetchManagers(orgId));
      dispatch(fetchBranches(orgId));
    }
  },[dispatch, orgId]);

  if(mLoading || lLoading) return (
    <div style={{display:'flex',justifyContent:'center',alignItems:'center',height:'calc(100vh - 200px)'}}>
      <Loader2 className="spinner" size={48} strokeWidth={1.4} />
    </div>
  );

  return (
    <div className="managers-page">
      <div className="managers-header">
        <h2>
          Сотрудники и точки продаж
          <HelpCircle
            size={16}
            style={{ marginLeft: 6, cursor: 'pointer' }}
            data-tooltip-id="managers-help"
            data-tooltip-content="Здесь вы управляете своими сотрудниками и точками продаж: добавляйте новых сотрудников,
          контролируйте выдачу карт и начисление баллов клиентам. Используйте приложение-сканер,
          чтобы упростить процесс обслуживания на местах."
          />
        </h2>
        <Tooltip id="managers-help" className="custom-tooltip" />
      </div>

      <div className="managers-grid">
        <div className="manager-card create-card" onClick={() => setShowAddModal(true)}>
          <h3>Добавить сотрудника</h3>
          <p>
            Добавьте сотрудника, чтобы настроить выдачу карт, начисление баллов и работу по сменам в
            вашей точке продаж.
          </p>
          <span className="scanner-icon">
            <PlusCircle size={18} />
          </span>
          <button className="custom-main-button" onClick={() => setShowAddModal(true)}>
            Добавить сотрудника
          </button>
        </div>
        <div className="manager-card create-card" onClick={() => setShowLocationModal(true)}>
          <h3>Добавить точку продаж</h3>
          <p>
            Создавайте торговые точки для управления клиентами, картами лояльности и сотрудниками в
            каждой локации. Вы сможете привязывать сотрудников и настраивать отдельные акции для
            каждой точки.{' '}
          </p>
          <span className="scanner-icon">
            <PlusCircle size={18} />
          </span>
          <button className="custom-main-button" onClick={() => setShowLocationModal(true)}>
            <span>+ </span>Добавить точку
          </button>
        </div>
        <div className="manager-card search-card">
          <h3>Поиск по карте</h3>
          <p>
            Введите номер карты лояльности клиента, чтобы перейти к его профилю. Удобно, если нет
            приложения-сканера.
          </p>
          <span className="scanner-icon">
            <Search size={18} />
          </span>
          <input
            type="text"
            placeholder="Номер карты"
            value={cardNumber}
            className="location-modal-input"
            onChange={(e) => setCardNumber(e.target.value)}
          />
          <button className="custom-main-button" onClick={handleFindCustomer}>
            Найти клиента
          </button>
        </div>
        <div className="manager-card scanner-card">
          <h3>Приложение-сканер</h3>
          <p>
            Установите приложение-сканер карт своим менеджерам в точках продаж. С помощью приложения
            они смогут пробивать штампы клиентам и выдавать награды.
          </p>
          <span className="scanner-icon">
            <Camera size={18} />
          </span>
          <button className="custom-main-button" onClick={() => navigate('/scan')}>
            Открыть
          </button>
        </div>
      </div>
      <div className="table-wrapper">
        <h3 className="table-name">Информация о сотрудниках</h3>
        {managers.length ? (
          <CustomTable columns={managersColumns} rows={managers} />
        ) : (
          <p>Здесь будет информация о сотрудниках.</p>
        )}
      </div>
      <div className="table-wrapper">
        <h3 className="table-name">Информация о точках продаж</h3>
        {locations.length ? (
          <CustomTable columns={locationColumns} rows={locations} />
        ) : (
          <p>Здесь будет информация о точках продаж.</p>
        )}
      </div>
      <ManagerModal
        isOpen={showAddModal || !!editModalData}
        onClose={() => {
          setShowAddModal(false);
          setEditModalData(null);
        }}
        onSave={handleSave}
        onDelete={handleDelete}
        initialData={editModalData}
        isEdit={!!editModalData}
      />
      <SalesPointsModal
        isOpen={showLocationModal}
        onClose={() => {
          setShowLocationModal(false);
          setInitialLocationData(null);
        }}
        initialData={initialLocationData || {}}
        isEdit={!!initialLocationData}
        onSave={(data) => {
          const payload = {
            name: data.name,
            address: data.address,
            coords_lat: data.coords.lat,
            coords_lon: data.coords.lon,
            organization_id: orgId,
            employees: (data.employees || []).map((id) => {
              const m = managers.find((man) => man.id === id);
              return m ? `${m.surname} ${m.name}`.trim() : id.toString();
            }),
          };
          const action = data.id ? editBranch({ id: data.id, ...payload }) : createBranch(payload);
          dispatch(action).unwrap().then(()=>{
            dispatch(fetchBranches(orgId));
          });
          setShowLocationModal(false);
        }}
      />
      <RoleSwitcher />
    </div>
  );
};

export default ManagersPage;
