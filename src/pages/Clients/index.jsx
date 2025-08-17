import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import FilterableTable from '../../components/FilterableTable';
import LoaderCentered from '../../components/LoaderCentered';
import TitleWithHelp from '../../components/TitleWithHelp';
import CustomMainButton from '../../customs/CustomMainButton';
import { mockClientsHeaders } from '../../mocks/clientsInfo';
import { fetchClients } from '../../store/clientsSlice';
import AddClientModal from './modals/AddClientModal';
import ClientAddedModal from './modals/ClientAddedModal';
import NoBranchModal from './modals/NoBranchModal';
import SmsWalletModal from './modals/SmsWalletModal';
import {
  ClientsActionsBar,
  ClientsContainer,
  ClientsStatCard,
  ClientsStatsGrid,
  ClientsTooltip,
  ClientsTooltipWrapper,
  PushActions,
  PushCard,
  PushCardWrapper,
  PushDescription,
  SectionHeading,
  StatClientsLabel,
  StatClientsValue,
} from './styles';

const Clients = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { list: clients, loading } = useSelector((s) => s.clients);

  const branches = useSelector((s) => s.locations.list);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showNoBranchModal, setShowNoBranchModal] = useState(false);

  const [showAddedModal, setShowAddedModal] = useState(false);
  const [showSmsWalletModal, setShowSmsWalletModal] = useState(false);

  const [generatedLink, setGeneratedLink] = useState('');

  useEffect(() => {
    dispatch(fetchClients());
  }, [dispatch]);

  useEffect(() => {
    const onOpenSmsWallet = () => setShowSmsWalletModal(true);
    window.addEventListener('open-sms-wallet-modal', onOpenSmsWallet);
    return () => window.removeEventListener('open-sms-wallet-modal', onOpenSmsWallet);
  }, []);

  const columns = useMemo(() => {
    return mockClientsHeaders.map((header) => {
      const base = {
        key: header.key,
        title: header.label,
        className: 'text-center',
        cellClassName: 'text-center',
      };
      if (header.key === 'cards') {
        base.render = (row) => (Array.isArray(row.cards) ? row.cards.length : 0);
      }
      return base;
    });
  }, []);

  const totalClients = clients.length;
  const transactions = 0;
  const cardsIssued = 0;
  const returnRate = 0;

  const firstStatRef = useRef(null);
  const [statWidth, setStatWidth] = useState();

  useEffect(() => {
    const measure = () => {
      if (firstStatRef.current) {
        setStatWidth(firstStatRef.current.offsetWidth);
      }
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (firstStatRef.current) ro.observe(firstStatRef.current);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  const handleOpenAdd = () => {
    if (branches.length === 0) {
      setShowAddModal(true);
    } else {
      setShowAddModal(true);
    }
  };

  const handleCreated = (clientId) => {
    const link = '/example';
    setGeneratedLink(link);

    setShowAddModal(false);
    setShowAddedModal(true);
  };

  if (loading) return <LoaderCentered />;

  return (
    <ClientsContainer>
      <TitleWithHelp
        title="Клиентская база"
        tooltipId="clients-help"
        tooltipHtml
        tooltipContent={`Здесь вы управляете своей клиентской базой: добавляете новых клиентов, импортируете
        существующих и отправляете push-уведомления`}
      />

      <ClientsStatsGrid>
        <ClientsStatCard ref={firstStatRef}>
          <StatClientsValue>{totalClients}</StatClientsValue>
          <StatClientsLabel>Клиентов в базе</StatClientsLabel>
        </ClientsStatCard>
        <ClientsStatCard>
          <StatClientsValue>{transactions}</StatClientsValue>
          <StatClientsLabel>Транзакций по картам</StatClientsLabel>
        </ClientsStatCard>
        <ClientsStatCard>
          <StatClientsValue>{cardsIssued}</StatClientsValue>
          <StatClientsLabel>Карт установлено</StatClientsLabel>
        </ClientsStatCard>
        <ClientsStatCard as={ClientsTooltipWrapper}>
          <StatClientsValue>{returnRate}%</StatClientsValue>
          <StatClientsLabel>Возвращаемость</StatClientsLabel>
          <ClientsTooltip>
            Процент клиентов, которые вернулись к вам хотя бы один раз.
          </ClientsTooltip>
        </ClientsStatCard>
      </ClientsStatsGrid>

      <ClientsActionsBar>
        <CustomMainButton onClick={handleOpenAdd}>
          <span>+</span>Добавить клиента
        </CustomMainButton>
      </ClientsActionsBar>

      {clients.length === 0 ? (
        <div style={{ marginTop: 40, textAlign: 'center', color: '#666' }}>
          Здесь будут отображены клиенты
        </div>
      ) : (
        <div className="table-wrapper">
          <FilterableTable
            columns={columns}
            rows={clients}
            onRowClick={(row) => navigate(`/clients/${row.id}`)}
            onShowModal={() => setShowAddModal(true)}
          />
        </div>
      )}

      {/* Модалки */}
      <AddClientModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onCreated={handleCreated}
      />

      <ClientAddedModal
        open={showAddedModal}
        onClose={() => setShowAddedModal(false)}
        link={generatedLink}
      />

      <SmsWalletModal open={showSmsWalletModal} onClose={() => setShowSmsWalletModal(false)} />
      <NoBranchModal open={showNoBranchModal} onClose={() => setShowNoBranchModal(false)} />

      <SectionHeading>Рассылка push</SectionHeading>

      <PushCardWrapper $width={statWidth}>
        <PushCard>
          <StatClientsLabel as="div" style={{ fontWeight: 600 }}>
            Отправляйте своим клиентам push-уведомления
          </StatClientsLabel>
          <PushDescription>
            Настройте и отправьте кампанию по базе клиентов за пару кликов.
          </PushDescription>
        </PushCard>
      </PushCardWrapper>

      <PushActions>
        <CustomMainButton onClick={() => navigate('/mailings/push')}>
          Создать рассылку
        </CustomMainButton>
      </PushActions>
    </ClientsContainer>
  );
};

export default Clients;
