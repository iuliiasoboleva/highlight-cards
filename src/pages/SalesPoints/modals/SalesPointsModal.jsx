import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useDebounce } from 'use-debounce';

import { useToast } from '../../../components/Toast';
import YandexMapPicker from '../../../components/YandexMapPicker';
import CustomInput from '../../../customs/CustomInput';
import CustomMainButton from '../../../customs/CustomMainButton';
import CustomModal from '../../../customs/CustomModal';
import CustomSelect from '../../../customs/CustomSelect';
import CustomToggleSwitch from '../../../customs/CustomToggleSwitch';
import { assignManagerToSalesPoint } from '../../../store/managersSlice';
import { FieldGroup, InlineRow, Label, LocationInfo, ModalBody, Spacer } from '../styles';

const SalesPointsModalWithMap = ({
  isOpen,
  onClose,
  onSave,
  onDelete = () => {},
  initialData = {},
  isEdit = false,
}) => {
  const dispatch = useDispatch();
  const toast = useToast();

  const allManagers = useSelector((s) => s.managers.list) || [];
  const networks = useSelector((s) => s.networks.list) || [];

  const currentUser = useSelector((s) => s.user) || {};
  const currentAdminId =
    currentUser?.id ||
    currentUser?.userId ||
    currentUser?.profile?.id ||
    currentUser?.profile?.userId ||
    null;

  const currentAdminName =
    [currentUser?.name, currentUser?.surname].filter(Boolean).join(' ') ||
    [currentUser?.profile?.first_name, currentUser?.profile?.last_name].filter(Boolean).join(' ') ||
    'Текущий администратор';

  const mapRef = useRef(null);

  const [selectedManager, setSelectedManager] = useState(null);
  const [name, setName] = useState(initialData.name || '');
  const [searchQuery, setSearchQuery] = useState(initialData.address || '');
  const [selectedLocation, setSelectedLocation] = useState(
    initialData.address && initialData.coords
      ? { address: initialData.address, coords: initialData.coords }
      : null,
  );
  const [isSearching, setIsSearching] = useState(false);

  const [isPartOfNetwork, setIsPartOfNetwork] = useState(Boolean(initialData.network_id));
  const [selectedNetwork, setSelectedNetwork] = useState(initialData.network_id || null);

  const [confirmOpen, setConfirmOpen] = useState(false);

  const [debouncedSearchQuery] = useDebounce(searchQuery, 1500);

  const isDeletable =
    !initialData.clientsCount && !initialData.cardsIssued && !initialData.pointsAccumulated;

  useEffect(() => {
    if (!isOpen) return;

    if (Array.isArray(allManagers) && allManagers.length > 0) {
      const initialManagerFromData =
        (Array.isArray(initialData.employees) && initialData.employees[0]) || null;
      setSelectedManager(initialManagerFromData ?? allManagers[0]?.id ?? null);
      return;
    }

    setSelectedManager(currentAdminId ?? null);
  }, [isOpen, allManagers, initialData.employees, currentAdminId]);

  useEffect(() => {
    if (isOpen) {
      setName(initialData.name || '');
      setSearchQuery(initialData.address || '');
      setSelectedLocation(
        initialData.address && initialData.coords
          ? { address: initialData.address, coords: initialData.coords }
          : null,
      );
      setIsPartOfNetwork(Boolean(initialData.network_id));
      setSelectedNetwork(initialData.network_id || null);
      setConfirmOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData, isOpen]);

  // поиск координат по вводу адреса
  useEffect(() => {
    const searchAddress = async () => {
      if (!debouncedSearchQuery || !mapRef.current) return;

      try {
        setIsSearching(true);
        const coords = await mapRef.current.search(debouncedSearchQuery.trim());
        if (Array.isArray(coords) && coords.length === 2) {
          setSelectedLocation({
            address: debouncedSearchQuery,
            coords: { lat: coords[0], lon: coords[1] },
          });
        }
      } catch (error) {
        console.error('Ошибка поиска адреса:', error);
      } finally {
        setIsSearching(false);
      }
    };

    searchAddress();
  }, [debouncedSearchQuery]);

  const handleMapSelect = useCallback((location) => {
    setSelectedLocation(location);
    if (location?.address) setSearchQuery(location.address);
  }, []);

  const resetForm = () => {
    setSelectedManager(null);
    setName('');
    setSearchQuery('');
    setSelectedLocation(null);
    setIsSearching(false);
    setIsPartOfNetwork(false);
    setSelectedNetwork(null);
    setConfirmOpen(false);
  };

  const normalizeErr = (e) => {
    if (!e) return 'Неизвестная ошибка';
    if (typeof e === 'string') return e;
    if (e instanceof Error) return e.message;
    if (e?.response?.data?.message) return e.response.data.message;
    if (e?.data?.message) return e.data.message;
    if (e?.message) return e.message;
    try {
      return JSON.stringify(e);
    } catch {
      return String(e);
    }
  };

  const handleSave = async () => {
    if (!name.trim() || !selectedLocation) {
      toast.error('Введите название и выберите адрес на карте');
      return;
    }

    const responsibleId =
      (Array.isArray(allManagers) && allManagers.length > 0 ? selectedManager : currentAdminId) ||
      selectedManager ||
      null;

    const newSalesPoint = {
      name,
      address: selectedLocation.address,
      coords: selectedLocation.coords, // { lat, lon }
      employees: responsibleId ? [responsibleId] : initialData.employees || [],
      network_id: isPartOfNetwork ? (selectedNetwork ?? null) : null,
    };

    console.debug('[SalesPointsModal] save payload:', newSalesPoint);

    try {
      await Promise.resolve(onSave?.(newSalesPoint));

      // Привязка менеджера (если выбран/определён)
      if (responsibleId) {
        await Promise.resolve(
          dispatch(
            assignManagerToSalesPoint({
              managerId: responsibleId,
              salesPointName: name,
            }),
          ),
        );
      }

      toast.success('Точка продаж сохранена');
      onClose?.();
      resetForm();
    } catch (e) {
      console.error('[SalesPointsModal] save error:', e);
      toast.error(normalizeErr(e));
    }
  };

  const isConfirm = confirmOpen;

  const title = isConfirm
    ? 'Удалить точку продаж?'
    : isEdit
      ? 'Редактировать точку продаж'
      : 'Добавить точку продаж';

  const actions = isConfirm ? (
    <>
      <CustomMainButton
        onClick={() => {
          if (initialData?.id) onDelete(initialData.id);
          setConfirmOpen(false);
          onClose?.();
        }}
        style={{ background: '#e53935', maxWidth: '100%' }}
      >
        Удалить
      </CustomMainButton>
      <CustomMainButton
        onClick={() => setConfirmOpen(false)}
        style={{ background: '#f5f5f5', color: '#2c3e50', maxWidth: '100%' }}
      >
        Отмена
      </CustomMainButton>
    </>
  ) : (
    <>
      {isEdit && (
        <CustomMainButton
          onClick={() => setConfirmOpen(true)}
          disabled={!isDeletable}
          style={{ background: '#e53935', maxWidth: '100%' }}
        >
          Удалить
        </CustomMainButton>
      )}
      <Spacer />
      <CustomMainButton onClick={handleSave} style={{ maxWidth: '100%' }}>
        Сохранить
      </CustomMainButton>
    </>
  );

  return (
    <CustomModal
      open={isOpen}
      onClose={() => {
        onClose?.();
        resetForm();
      }}
      title={title}
      actions={actions}
    >
      {isConfirm ? (
        <Label style={{ color: '#2c3e50' }}>
          Удалить точку продаж без возможности восстановления? Все данные будут потеряны.
        </Label>
      ) : (
        <ModalBody>
          <FieldGroup>
            <Label>Название точки</Label>
            <CustomInput
              placeholder="Название точки"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </FieldGroup>

          <FieldGroup>
            <Label>Адрес</Label>
            <CustomInput
              placeholder="Введите адрес"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              required
            />
            {isSearching && <Label style={{ color: '#7f8c8d' }}>Поиск адреса…</Label>}
          </FieldGroup>

          {selectedLocation && (
            <LocationInfo>
              <div>Выбрано: {selectedLocation.address}</div>
              <div>
                Координаты:&nbsp;
                {selectedLocation.coords.lat.toFixed(6)}, {selectedLocation.coords.lon.toFixed(6)}
              </div>
            </LocationInfo>
          )}

          <FieldGroup>
            <YandexMapPicker
              ref={mapRef}
              onSelect={handleMapSelect}
              initialCoords={selectedLocation?.coords}
            />
          </FieldGroup>

          <InlineRow>
            <FieldGroup style={{ flex: 1, minWidth: 280 }}>
              <Label>Ответственный сотрудник</Label>

              {Array.isArray(allManagers) && allManagers.length > 0 ? (
                <CustomSelect
                  value={selectedManager}
                  onChange={setSelectedManager}
                  options={allManagers.map((m) => ({
                    value: m.id,
                    label: `${m.name} ${m.surname}`.trim(),
                  }))}
                  placeholder="Выберите сотрудника"
                />
              ) : (
                <>
                  <CustomInput
                    value={currentAdminName}
                    disabled
                    placeholder="Будет назначен текущий администратор"
                  />
                </>
              )}
            </FieldGroup>

            <FieldGroup style={{ flex: 1, minWidth: 280 }}>
              <Label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  justifyContent: 'space-between',
                }}
              >
                Эта точка продаж является частью сети?
                <CustomToggleSwitch
                  checked={isPartOfNetwork}
                  onChange={(e) => {
                    const checked = e?.target ? e.target.checked : !isPartOfNetwork;
                    setIsPartOfNetwork(checked);
                    if (!checked) setSelectedNetwork(null);
                  }}
                />
              </Label>

              {isPartOfNetwork && (
                <div style={{ marginTop: 10 }}>
                  <CustomSelect
                    value={selectedNetwork}
                    onChange={setSelectedNetwork}
                    options={networks.map((n) => ({ value: n.id, label: n.name }))}
                    placeholder="Выберите сеть"
                  />
                </div>
              )}
            </FieldGroup>
          </InlineRow>
        </ModalBody>
      )}
    </CustomModal>
  );
};

export default SalesPointsModalWithMap;
