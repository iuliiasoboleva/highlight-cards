import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Camera, PlusCircle, Search } from 'lucide-react';

import CustomTable from '../../components/CustomTable';
import LoaderCentered from '../../components/LoaderCentered';
import ManagerModal from '../../components/ManagerModal';
import NetworkModal from '../../components/NetworkModal';
import RoleSwitcher from '../../components/RoleSwitcher';
import SalesPointsModal from '../../components/SalesPointsModal';
import TitleWithHelp from '../../components/TitleWithHelp';
import CustomMainButton from '../../customs/CustomMainButton';
import { managersHeaders } from '../../mocks/managersInfo';
import { locationsHeaders } from '../../mocks/mockLocations';
import {
  createManager,
  deleteManager,
  editManager,
  fetchManagers,
} from '../../store/managersSlice';
import {
  createNetwork,
  deleteNetwork,
  editNetwork,
  fetchNetworks,
} from '../../store/networksSlice';
import {
  addLocation,
  createBranch,
  deleteBranch,
  editBranch,
  fetchBranches,
} from '../../store/salesPointsSlice';

import './styles.css';

const ManagersPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showAddModal, setShowAddModal] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [editModalData, setEditModalData] = useState(null);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showNetworkModal, setShowNetworkModal] = useState(false);
  const [editNetworkData, setEditNetworkData] = useState(null);

  const { list: managers, loading: mLoading } = useSelector((state) => state.managers);
  const { list: locations, loading: lLoading } = useSelector((state) => state.locations);
  const orgId = useSelector((state) => state.user.organization_id);

  const clients = useSelector((state) => state.clients);
  const networks = useSelector((state) => state.networks.list);

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
        <div
          className="manager-edit-button"
          style={{ cursor: 'pointer' }}
          onClick={() => setEditModalData(row)}
        >
          ✏️
        </div>
      ),
    },
  ];

  const locationColumns = locationsHeaders.map((header) => {
    if (header.key === 'network') {
      return {
        key: 'network',
        title: 'Сеть',
        className: 'text-center',
        cellClassName: 'text-center',
        render: (row) => {
          const net = networks.find((n) => n.id === row.network_id);
          return net ? net.name : '-';
        },
      };
    }
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
      <div
        className="manager-edit-button"
        style={{ cursor: 'pointer' }}
        onClick={() => {
          setInitialLocationData(row);
          setShowLocationModal(true);
        }}
      >
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
      dispatch(editManager(payload))
        .unwrap()
        .then(() => {
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
      dispatch(createManager(payload))
        .unwrap()
        .then(() => {
          dispatch(fetchManagers(orgId));
        });
    }
    setEditModalData(null);
    setShowAddModal(false);
  };

  const handleDelete = (id) => {
    dispatch(deleteManager(id))
      .unwrap()
      .then(() => {
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

  const handleSaveNetwork = (network) => {
    const { branches = [], ...netData } = network;

    const action = netData.id
      ? editNetwork(netData)
      : createNetwork({ ...netData, organization_id: orgId });

    dispatch(action)
      .unwrap()
      .then((savedNet) => {
        const currentIds = branches;
        const prevIds = locations.filter((b) => b.network_id === savedNet.id).map((b) => b.id);

        const toAdd = currentIds;
        const toRemove = prevIds.filter((id) => !currentIds.includes(id));

        const updatePromises = [];

        toAdd.forEach((brId) => {
          const br = locations.find((b) => b.id === brId);
          if (br)
            updatePromises.push(
              dispatch(
                editBranch({
                  id: br.id,
                  name: br.name,
                  organization_id: orgId,
                  network_id: savedNet.id,
                }),
              ),
            );
        });

        toRemove.forEach((brId) => {
          const br = locations.find((b) => b.id === brId);
          if (br)
            updatePromises.push(
              dispatch(
                editBranch({ id: br.id, name: br.name, organization_id: orgId, network_id: null }),
              ),
            );
        });

        const promisesAll = Promise.all(updatePromises);
        return Promise.all(updatePromises);
      })
      .then(() => {
        dispatch(fetchBranches(orgId));
        dispatch(fetchNetworks(orgId));
      });

    setShowNetworkModal(false);
    setEditNetworkData(null);
  };

  const handleDeleteNetwork = (id) => {
    dispatch(deleteNetwork(id));
    setEditNetworkData(null);
  };

  useEffect(() => {
    if (orgId) {
      dispatch(fetchManagers(orgId));
      dispatch(fetchBranches(orgId));
      dispatch(fetchNetworks(orgId));
    }
  }, [dispatch, orgId]);

  if (mLoading || lLoading) return <LoaderCentered />;

  return (
    <div className="managers-page">
      <div className="managers-header">
        <TitleWithHelp
          title={'Сотрудники и точки продаж'}
          tooltipId="sales-help"
          tooltipHtml
          tooltipContent={`Здесь вы управляете своими сотрудниками и точками продаж: добавляйте новых сотрудников,
          контролируйте выдачу карт и начисление баллов клиентам. Используйте приложение-сканер,
          чтобы упростить процесс обслуживания на местах.`}
        />
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
          <CustomMainButton onClick={() => setShowAddModal(true)}>
            Добавить сотрудника
          </CustomMainButton>
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
          <CustomMainButton onClick={() => setShowLocationModal(true)}>
            <span>+ </span>Добавить точку
          </CustomMainButton>
        </div>
        <div className="manager-card create-card" onClick={() => setShowNetworkModal(true)}>
          <h3>Добавить сеть</h3>
          <p>Объедините несколько точек в одну сеть для общего учёта клиентов.</p>
          <span className="scanner-icon">
            <PlusCircle size={18} />
          </span>
          <CustomMainButton onClick={() => setShowNetworkModal(true)}>
            Создать сеть
          </CustomMainButton>
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
          <CustomMainButton onClick={handleFindCustomer}>Найти клиента</CustomMainButton>
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
          <CustomMainButton onClick={() => navigate('/scan')}>Открыть</CustomMainButton>
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
      <div className="table-wrapper">
        <h3 className="table-name">Сети точек</h3>
        {networks.length ? (
          <CustomTable
            columns={[
              {
                key: 'name',
                title: 'Название',
                className: 'text-center',
                cellClassName: 'text-center',
              },
              {
                key: 'description',
                title: 'Описание',
                className: 'text-center',
                cellClassName: 'text-center',
              },
              {
                key: 'actions',
                title: 'Действия',
                className: 'text-center',
                cellClassName: 'text-center',
                render: (row) => (
                  <div
                    className="manager-edit-button"
                    style={{ cursor: 'pointer' }}
                    onClick={() => setEditNetworkData(row)}
                  >
                    ✏️
                  </div>
                ),
              },
            ]}
            rows={networks}
          />
        ) : (
          <p>Сетей пока нет.</p>
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
            network_id: data.network_id,
          };
          const idNum = data.id ? parseInt(data.id, 10) : undefined;
          const action = idNum ? editBranch({ id: idNum, ...payload }) : createBranch(payload);
          dispatch(action)
            .unwrap()
            .then(() => {
              dispatch(fetchBranches(orgId));
            });
          setShowLocationModal(false);
        }}
        onDelete={(id) => {
          const idNum = parseInt(id, 10);
          if (!idNum) return;
          dispatch(deleteBranch(idNum))
            .unwrap()
            .then(() => {
              dispatch(fetchBranches(orgId));
            });
          setShowLocationModal(false);
          setInitialLocationData(null);
        }}
      />
      <NetworkModal
        isOpen={showNetworkModal || !!editNetworkData}
        onClose={() => {
          setShowNetworkModal(false);
          setEditNetworkData(null);
        }}
        onSave={handleSaveNetwork}
        onDelete={handleDeleteNetwork}
        initialData={editNetworkData || {}}
        isEdit={!!editNetworkData}
      />
      <RoleSwitcher />
    </div>
  );
};

export default ManagersPage;
