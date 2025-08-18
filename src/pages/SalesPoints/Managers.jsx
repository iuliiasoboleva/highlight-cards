import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Camera, PlusCircle, Search } from 'lucide-react';

import CustomTable from '../../components/CustomTable';
import LoaderCentered from '../../components/LoaderCentered';
import TitleWithHelp from '../../components/TitleWithHelp';
import { useToast } from '../../components/Toast';
import CustomInput from '../../customs/CustomInput';
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
import { normalizeErr } from '../../utils/normalizeErr';
import ManagerModal from './modals/ManagerModal';
import NetworkModal from './modals/NetworkModal';
import SalesPointsModal from './modals/SalesPointsModal';
import {
  Card,
  Grid,
  Header,
  IconWithTooltip,
  ManagerEditButton,
  Page,
  ScannerIcon,
  TableName,
  TablesGroup,
  Tooltip,
} from './styles';

const CARD_LENGTH = 16;

const ManagersPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toast = useToast();

  const [showAddModal, setShowAddModal] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [editModalData, setEditModalData] = useState(null);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showNetworkModal, setShowNetworkModal] = useState(false);
  const [editNetworkData, setEditNetworkData] = useState(null);

  const { list: managers, loading: mLoading } = useSelector((state) => state.managers);
  const { list: locations, loading: lLoading } = useSelector((state) => state.locations);
  const orgId = useSelector((state) => state.user.organization_id);

  const clientsRaw = useSelector((state) => state.clients);
  const clients = Array.isArray(clientsRaw)
    ? clientsRaw
    : Array.isArray(clientsRaw?.list)
      ? clientsRaw.list
      : [];

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
        <ManagerEditButton onClick={() => setEditModalData(row)} title="Редактировать">
          ✏️
        </ManagerEditButton>
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
      <ManagerEditButton
        onClick={() => {
          setInitialLocationData(row);
          setShowLocationModal(true);
        }}
        title="Редактировать"
      >
        ✏️
      </ManagerEditButton>
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

  const normalizeDigits = (val) => val.replace(/\D+/g, '');

  const validateCard = (digits) => {
    if (!digits) return '';
    if (digits.length < CARD_LENGTH) return `Введите ${CARD_LENGTH} цифр`;
    if (digits.length > CARD_LENGTH) return `Номер карты должен содержать ${CARD_LENGTH} цифр`;
    return '';
  };

  const onCardChange = (e) => {
    const digits = normalizeDigits(e.target.value).slice(0, CARD_LENGTH);
    setCardNumber(digits);
  };

  const handleFindCustomer = () => {
    const trimmedCard = (cardNumber || '').trim();
    const err = validateCard(trimmedCard);
    if (err) return;

    const foundClient = clients.find(
      (client) =>
        Array.isArray(client?.cards) &&
        client.cards.some((card) => String(card?.cardNumber ?? '').trim() === trimmedCard),
    );

    if (foundClient) {
      navigate(`/customer/card/${trimmedCard}`);
    } else {
      toast.error('Клиент с таким номером карты не найден');
    }
  };

  const handleSaveNetwork = async (network) => {
    const { branches = [], ...netData } = network;

    const action = netData.id
      ? editNetwork({ ...netData, organization_id: orgId })
      : createNetwork({ ...netData, organization_id: orgId });

    try {
      const savedNet = await dispatch(action).unwrap();
      const netId = savedNet.id;

      const currentIds = branches;
      const prevIds = (locations || []).filter((b) => b.network_id === netId).map((b) => b.id);

      const toAdd = currentIds;
      const toRemove = prevIds.filter((id) => !currentIds.includes(id));

      console.debug('[Network save] netId:', netId, 'add:', toAdd, 'remove:', toRemove);

      const updates = [];

      toAdd.forEach((brId) => {
        const br = locations.find((b) => b.id === brId);
        if (br) {
          updates.push(
            dispatch(
              editBranch({
                id: br.id,
                name: br.name,
                organization_id: orgId,
                network_id: netId,
              }),
            ).unwrap(),
          );
        }
      });

      toRemove.forEach((brId) => {
        const br = locations.find((b) => b.id === brId);
        if (br) {
          updates.push(
            dispatch(
              editBranch({
                id: br.id,
                name: br.name,
                organization_id: orgId,
                network_id: null,
              }),
            ).unwrap(),
          );
        }
      });

      await Promise.all(updates);

      await Promise.all([
        dispatch(fetchBranches(orgId)).unwrap(),
        dispatch(fetchNetworks(orgId)).unwrap(),
      ]);

      toast.success('Сеть сохранена');
      setShowNetworkModal(false);
      setEditNetworkData(null);
    } catch (e) {
      console.error('handleSaveNetwork error:', e);
      toast.error(normalizeErr(e));
    }
  };

  const handleDeleteNetwork = async (id) => {
    try {
      await dispatch(deleteNetwork(id)).unwrap();
      await dispatch(fetchNetworks(orgId)).unwrap();
      toast.success('Сеть удалена');
      setEditNetworkData(null);
    } catch (e) {
      console.error('deleteNetwork error:', e);
      toast.error(normalizeErr(e));
    }
  };

  useEffect(() => {
    if (orgId) {
      dispatch(fetchManagers(orgId));
      dispatch(fetchBranches(orgId));
      dispatch(fetchNetworks(orgId));
    }
  }, [dispatch, orgId]);

  if (mLoading || lLoading) return <LoaderCentered />;

  const networkColumns = [
    {
      key: 'name',
      title: 'Название',
      className: 'text-left',
      cellClassName: 'text-left',
    },
    {
      key: 'description',
      title: 'Описание',
      className: 'text-left',
      cellClassName: 'text-left',
    },
    {
      key: 'actions',
      title: 'Действия',
      className: 'text-center',
      cellClassName: 'text-center',
      render: (row) => (
        <ManagerEditButton onClick={() => setEditNetworkData(row)} title="Редактировать">
          ✏️
        </ManagerEditButton>
      ),
    },
  ];

  return (
    <Page>
      <Header>
        <TitleWithHelp
          title={'Сотрудники и точки продаж'}
          tooltipId="sales-help"
          tooltipHtml
          tooltipContent={`Здесь вы управляете своими сотрудниками и точками продаж: добавляйте новых сотрудников,
          контролируйте выдачу карт и начисление баллов клиентам. Используйте приложение-сканер,
          чтобы упростить процесс обслуживания на местах.`}
        />
      </Header>

      <Grid>
        <Card onClick={() => setShowAddModal(true)}>
          <h3>Добавить сотрудника</h3>
          <p>
            Добавьте сотрудника, чтобы настроить выдачу карт, начисление баллов и работу по сменам в
            вашей точке продаж.
          </p>
          <ScannerIcon>
            <IconWithTooltip>
              <PlusCircle size={18} />
              <Tooltip>Создайте нового сотрудника</Tooltip>
            </IconWithTooltip>
          </ScannerIcon>
          <CustomMainButton onClick={() => setShowAddModal(true)}>
            Добавить сотрудника
          </CustomMainButton>
        </Card>

        <Card onClick={() => setShowLocationModal(true)}>
          <h3>Добавить точку продаж</h3>
          <p>
            Создавайте торговые точки для управления клиентами, картами лояльности и сотрудниками в
            каждой локации. Вы сможете привязывать сотрудников и настраивать отдельные акции для
            каждой точки.
          </p>
          <ScannerIcon>
            <IconWithTooltip>
              <PlusCircle size={18} />
              <Tooltip>Создайте новую точку продаж</Tooltip>
            </IconWithTooltip>
          </ScannerIcon>
          <CustomMainButton onClick={() => setShowLocationModal(true)}>
            Добавить точку
          </CustomMainButton>
        </Card>

        <Card onClick={() => setShowNetworkModal(true)}>
          <h3>Добавить сеть</h3>
          <p>Объедините несколько точек в одну сеть для общего учёта клиентов.</p>
          <ScannerIcon>
            <IconWithTooltip>
              <PlusCircle size={18} />
              <Tooltip>Создайте новую сеть</Tooltip>
            </IconWithTooltip>
          </ScannerIcon>
          <CustomMainButton onClick={() => setShowNetworkModal(true)}>
            Создать сеть
          </CustomMainButton>
        </Card>

        <Card>
          <h3>Поиск по карте</h3>
          <p>
            Введите номер карты лояльности клиента, чтобы перейти к его профилю. Удобно, если нет
            приложения-сканера.
          </p>
          <ScannerIcon>
            <IconWithTooltip>
              <Search size={18} />
              <Tooltip>Введите номер карты клиента и найдите его профиль</Tooltip>
            </IconWithTooltip>
          </ScannerIcon>

          <CustomInput
            type="tel"
            inputMode="numeric"
            placeholder={`Номер карты (${CARD_LENGTH} цифр)`}
            value={cardNumber}
            onChange={onCardChange}
            maxLength={CARD_LENGTH}
          />

          <CustomMainButton
            onClick={handleFindCustomer}
            disabled={cardNumber.length !== CARD_LENGTH}
            $mt={10}
            $maxWidth={268}
          >
            Найти клиента
          </CustomMainButton>
        </Card>

        <Card onClick={() => navigate('/scan')}>
          <h3>Сканер QR-кодов</h3>
          <p>
            Сканер QR-кодов - инструмент для ваших менеджеров. Сканируйте карты лояльности клиентов
            прямо в браузере - быстро и удобно.
          </p>
          <ScannerIcon>
            <IconWithTooltip>
              <Camera size={18} />
              <Tooltip>Сканируйте карты лояльности клиентов</Tooltip>
            </IconWithTooltip>
          </ScannerIcon>
          <CustomMainButton onClick={() => navigate('/scan')}>Открыть</CustomMainButton>
        </Card>
      </Grid>

      <TablesGroup>
        <TableName>Информация о сотрудниках</TableName>
        {managers.length ? (
          <CustomTable columns={managersColumns} rows={managers} />
        ) : (
          <CustomTable
            columns={managersColumns.filter((c) => c.key !== 'actions')}
            rows={[]}
            emptyText={'Здесь будет информация о сотрудниках'}
          />
        )}

        <TableName>Информация о точках продаж</TableName>
        {locations.length ? (
          <CustomTable columns={locationColumns} rows={locations} />
        ) : (
          <CustomTable
            columns={locationColumns.filter((c) => c.key !== 'actions')}
            rows={[]}
            emptyText={'Здесь будет информация о точках продаж'}
          />
        )}

        <TableName>Сети точек</TableName>
        {networks.length ? (
          <CustomTable columns={networkColumns} rows={networks} />
        ) : (
          <CustomTable
            columns={networkColumns.filter((c) => c.key !== 'actions')}
            rows={[]}
            emptyText={'Здесь будет информация о сетях'}
          />
        )}
      </TablesGroup>

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
        onSave={async (data) => {
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

          console.debug('[SalesPointsModal] payload:', payload);

          const idNum = data.id ? parseInt(data.id, 10) : undefined;
          const action = idNum ? editBranch({ id: idNum, ...payload }) : createBranch(payload);

          try {
            await dispatch(action).unwrap();
            await dispatch(fetchBranches(orgId)).unwrap();
            toast.success('Точка продаж сохранена');
            setShowLocationModal(false);
            setInitialLocationData(null);
          } catch (e) {
            console.error('save branch error:', e);
            toast.error(normalizeErr(e));
          }
        }}
        onDelete={async (id) => {
          const idNum = parseInt(id, 10);
          if (!idNum) return;

          try {
            await dispatch(deleteBranch(idNum)).unwrap();
            await dispatch(fetchBranches(orgId)).unwrap();
            toast.success('Точка продаж удалена');
            setShowLocationModal(false);
            setInitialLocationData(null);
          } catch (e) {
            console.error('delete branch error:', e);
            toast.error(normalizeErr(e));
          }
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
    </Page>
  );
};

export default ManagersPage;
