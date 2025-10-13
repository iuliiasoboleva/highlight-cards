import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import LoaderCentered from '../../components/LoaderCentered';
import TitleWithHelp from '../../components/TitleWithHelp';
import { useToast } from '../../components/Toast';
import CustomModal from '../../customs/CustomModal';
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
  createBranch,
  deleteBranch,
  editBranch,
  fetchBranches,
} from '../../store/salesPointsSlice';
import { CARD_LENGTH, normalizeDigits, validateCard } from '../../utils/cardUtils';
import { MAX_LOCATIONS } from '../../utils/locations.jsx';
import { normalizeErr } from '../../utils/normalizeErr';
import CardsBlock from './components/CardsBlock';
import TablesBlock from './components/TablesBlock';
import ManagerModal from './modals/ManagerModal';
import NetworkModal from './modals/NetworkModal';
import SalesPointsModal from './modals/SalesPointsModal';
import { Grid, Header, Page } from './styles';

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
  const [initialLocationData, setInitialLocationData] = useState(null);
  const [showNoLocationsWarning, setShowNoLocationsWarning] = useState(false);
  const [showNoNetworkWarning, setShowNoNetworkWarning] = useState(false);

  const { list: managers, loading: mLoading } = useSelector((s) => s.managers);
  const { list: locations, loading: lLoading } = useSelector((s) => s.locations);
  const networks = useSelector((s) => s.networks.list);
  const orgId = useSelector((s) => s.user.organization_id);
  const subscription = useSelector((s) => s.subscription?.info) || null;

  const clientsRaw = useSelector((s) => s.clients);
  const clients = Array.isArray(clientsRaw)
    ? clientsRaw
    : Array.isArray(clientsRaw?.list)
      ? clientsRaw.list
      : [];

  useEffect(() => {
    if (orgId) {
      dispatch(fetchManagers(orgId));
      dispatch(fetchBranches(orgId));
      dispatch(fetchNetworks(orgId));
    }
  }, [dispatch, orgId]);

  if (mLoading || lLoading) return <LoaderCentered />;

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
      const foundCard = foundClient.cards.find((card) => String(card?.cardNumber ?? '').trim() === trimmedCard);
    if (foundCard?.uuid) {
      navigate(`/getpass/${foundCard.uuid}`);
      } else {
        toast.error('UUID карты не найден');
      }
    } else {
      toast.error('Клиент с таким номером карты не найден');
    }
  };

  const handleSaveManager = (manager) => {
    const payloadBase = {
      name: manager.name,
      surname: manager.surname,
      email: manager.email,
      phone: manager.phone,
      branch_id: null,
      role: 'manager',
      status: manager.status,
      start_shift: manager.shift?.startShift || manager.start_shift,
      end_shift: manager.shift?.endShift || manager.end_shift,
    };

    const action = manager.id
      ? editManager({
          id: manager.id,
          ...payloadBase,
          locations: manager.location ? [manager.location] : manager.locations,
        })
      : createManager({
          ...payloadBase,
          organization_id: orgId,
          locations: manager.location ? [manager.location] : [],
        });

    dispatch(action)
      .unwrap()
      .then(() => dispatch(fetchManagers(orgId)))
      .finally(() => {
        setEditModalData(null);
        setShowAddModal(false);
      });
  };

  const handleDeleteManager = (id) => {
    dispatch(deleteManager(id))
      .unwrap()
      .then(() => dispatch(fetchManagers(orgId)))
      .finally(() => setEditModalData(null));
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

  const handleSaveLocation = async (data) => {
    const payload = {
      name: data.name,
      address: data.address,
      coords_lat: data.coords?.lat,
      coords_lon: data.coords?.lon,
      organization_id: orgId,
      employees: (data.employees || []).map((id) => {
        const m = managers.find((man) => man.id === id);
        return m ? `${m.surname} ${m.name}`.trim() : id.toString();
      }),
      network_id: data.network_id,
    };

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
  };

  const handleDeleteLocation = async (id) => {
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
  };

  const maxLocations = (() => {
    const direct = Number(subscription?.limits?.locations);
    if (!Number.isNaN(direct) && direct > 0) return direct;
    if (String(subscription?.status || '').toLowerCase() === 'trial') return 1;
    return MAX_LOCATIONS;
  })();

  const canCreateLocation = locations.length < maxLocations;

  const handleOpenLocation = () => {
    if (!canCreateLocation) {
      toast.error('Достигнут лимит точек по вашему тарифу');
      return;
    }
    setShowLocationModal(true);
  };

  const handleOpenAddEmployee = () => {
    if (!locations || locations.length === 0) {
      setShowNoLocationsWarning(true);
      return;
    }
    setShowAddModal(true);
  };

  const handleCreateLocationFromWarning = () => {
    setShowNoLocationsWarning(false);
    handleOpenLocation();
  };

  const handleOpenAddNetwork = () => {
    if (!locations || locations.length < 2) {
      setShowNoNetworkWarning(true);
      return;
    }
    setShowNetworkModal(true);
  };

  const handleCreateLocationFromNetworkWarning = () => {
    setShowNoNetworkWarning(false);
    handleOpenLocation();
  };

  return (
    <Page>
      <Header>
        <TitleWithHelp
          title="Сотрудники и точки продаж"
          tooltipId="sales-help"
          tooltipHtml
          tooltipContent={`Здесь вы управляете своими сотрудниками и точками продаж: добавляйте новых сотрудников,
контролируйте выдачу карт и начисление баллов клиентам. Используйте приложение-сканер,
чтобы упростить процесс обслуживания на местах.`}
        />
      </Header>

      {/* Карточки */}
      <Grid>
        <CardsBlock
          cardNumber={cardNumber}
          onCardChange={onCardChange}
          handleFindCustomer={handleFindCustomer}
          onOpenAdd={handleOpenAddEmployee}
          onOpenLocation={handleOpenLocation}
          onOpenNetwork={handleOpenAddNetwork}
          onOpenScan={() => navigate('/scan')}
        />
      </Grid>

      {/* Таблицы */}
      <TablesBlock
        managers={managers}
        locations={locations}
        networks={networks}
        managersHeaders={managersHeaders}
        locationsHeaders={locationsHeaders}
        onEditManager={(row) => setEditModalData(row)}
        onEditLocation={(row) => {
          setInitialLocationData(row);
          setShowLocationModal(true);
        }}
        onEditNetwork={(row) => setEditNetworkData(row)}
      />

      {/* Модалки */}
      <ManagerModal
        isOpen={showAddModal || !!editModalData}
        onClose={() => {
          setShowAddModal(false);
          setEditModalData(null);
        }}
        onSave={handleSaveManager}
        onDelete={handleDeleteManager}
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
        onSave={handleSaveLocation}
        onDelete={handleDeleteLocation}
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

      <CustomModal
        open={showNoLocationsWarning}
        onClose={() => setShowNoLocationsWarning(false)}
        title="Создайте торговую точку"
        actions={
          <>
            <CustomModal.SecondaryButton onClick={() => setShowNoLocationsWarning(false)}>
              Отмена
            </CustomModal.SecondaryButton>
            <CustomModal.PrimaryButton onClick={handleCreateLocationFromWarning}>
              Создать торговую точку
            </CustomModal.PrimaryButton>
          </>
        }
      >
        <div style={{ padding: '16px 0', fontSize: '15px', lineHeight: '1.5' }}>
          Для добавления сотрудника необходимо сначала создать хотя бы одну торговую точку. 
          Сотрудники привязываются к торговым точкам для учета продаж и начисления баллов.
        </div>
      </CustomModal>

      <CustomModal
        open={showNoNetworkWarning}
        onClose={() => setShowNoNetworkWarning(false)}
        title="Создайте торговые точки"
        actions={
          <>
            <CustomModal.SecondaryButton onClick={() => setShowNoNetworkWarning(false)}>
              Отмена
            </CustomModal.SecondaryButton>
            <CustomModal.PrimaryButton onClick={handleCreateLocationFromNetworkWarning}>
              Создать торговую точку
            </CustomModal.PrimaryButton>
          </>
        }
      >
        <div style={{ padding: '16px 0', fontSize: '15px', lineHeight: '1.5' }}>
          Для создания сети необходимо иметь минимум 2 торговые точки. 
          Сеть объединяет несколько торговых точек для общего учета клиентов.
          {locations && locations.length === 1 && (
            <div style={{ marginTop: '12px', fontWeight: '500' }}>
              У вас сейчас {locations.length} торговая точка. Создайте ещё одну для формирования сети.
            </div>
          )}
        </div>
      </CustomModal>
    </Page>
  );
};

export default ManagersPage;
