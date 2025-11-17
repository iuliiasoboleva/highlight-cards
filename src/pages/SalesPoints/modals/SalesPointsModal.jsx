import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import { useDebounce } from 'use-debounce';

import { useToast } from '../../../components/Toast';
import { DADATA_TOKEN } from '../../../config/env';
import YandexMapPicker from '../../../components/YandexMapPicker';
import CustomInput from '../../../customs/CustomInput';
import CustomMainButton from '../../../customs/CustomMainButton';
import CustomModal from '../../../customs/CustomModal';
import CustomSelect from '../../../customs/CustomSelect';
import CustomToggleSwitch from '../../../customs/CustomToggleSwitch';
import { assignManagerToSalesPoint } from '../../../store/managersSlice';
import { normalizeErr } from '../../../utils/normalizeErr';
import axiosInstance from '../../../axiosInstance';
import {
  AddressWrap,
  FieldGroup,
  InlineRow,
  Label,
  LocationInfo,
  ModalBody,
  SuggestItem,
  SuggestList,
} from '../styles';

const DarkButton = styled(CustomMainButton)`
  background: #2c3e50;
  color: #fff;
  width: 100%;
  max-width: 100%;
  margin-top: 0;
  flex: 1 0 100%;

  &:hover:not(:disabled) {
    background: #1a252f;
    color: #fff;
  }
`;

const DangerButton = styled(CustomMainButton)`
  background: #bf4756;
  color: #fff;
  width: 100%;
  max-width: 100%;
  margin-top: 0;
  flex: 1 0 100%;

  &:hover:not(:disabled) {
    background: #a63d49;
    color: #fff;
  }
`;

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

  const managersList = useSelector((s) => s.managers.list);
  const networksList = useSelector((s) => s.networks.list);

  const allManagers = useMemo(() => managersList ?? [], [managersList]);
  const networks = useMemo(() => networksList ?? [], [networksList]);
  const currentUser = useSelector((s) => s.user) || {};

  const hasManagers = useMemo(
    () => Array.isArray(allManagers) && allManagers.length > 0,
    [allManagers],
  );
  const managerOptions = useMemo(
    () =>
      (allManagers || []).map((m) => ({
        value: m.id,
        label: `${m.name || ''} ${m.surname || ''}`.trim() || 'Без имени',
      })),
    [allManagers],
  );

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
  const clickAwayRef = useRef(null);
  const addressInputRef = useRef(null);

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

  const [debouncedSearchQuery] = useDebounce(searchQuery, 400);

  const [suggests, setSuggests] = useState([]);
  const [showSuggests, setShowSuggests] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const isDeletable =
    !initialData.clientsCount && !initialData.cardsIssued && !initialData.pointsAccumulated;

  useEffect(() => {
    if (!isOpen) return;

    if (hasManagers) {
      const initialManagerFromData =
        (Array.isArray(initialData.employees) && initialData.employees[0]) || null;
      setSelectedManager(initialManagerFromData ?? allManagers[0]?.id ?? null);
    } else {
      setSelectedManager(currentAdminId ?? null);
    }
  }, [isOpen, hasManagers, allManagers, initialData.employees, currentAdminId]);

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

  useEffect(() => {
    const onDocClick = (e) => {
      if (!clickAwayRef.current) return;
      if (!clickAwayRef.current.contains(e.target)) {
        setShowSuggests(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  useEffect(() => {
    let aborted = false;

    const fetchSuggests = async () => {
      const q = debouncedSearchQuery?.trim();
      if (!q) {
        setSuggests([]);
        setShowSuggests(false);
        return;
      }

      try {
        setIsSearching(true);

        const response = await axiosInstance.get('/address/suggest', {
          params: { query: q, count: 8 }
        });

        if (!aborted) {
          const s = Array.isArray(response.data?.suggestions) ? response.data.suggestions : [];
          setSuggests(s);
          setShowSuggests(s.length > 0);
          setActiveIndex(-1);
        }
      } catch (err) {
        if (!aborted) {
          setSuggests([]);
          setShowSuggests(false);
        }
      } finally {
        if (!aborted) setIsSearching(false);
      }
    };

    fetchSuggests();
    return () => {
      aborted = true;
    };
  }, [debouncedSearchQuery]);

  const handleMapSelect = useCallback((location) => {
    setSelectedLocation(location);
    if (location?.address) setSearchQuery(location.address);
  }, []);

  const applySuggest = async (s) => {
    try {
      const addr = s?.value || s?.unrestricted_value || '';
      const lat = Number(s?.data?.geo_lat);
      const lon = Number(s?.data?.geo_lon);

      setSearchQuery(addr);
      setShowSuggests(false);

      if (!Number.isNaN(lat) && !Number.isNaN(lon)) {
        setSelectedLocation({ address: addr, coords: { lat, lon } });
        if (mapRef.current?.setCenter) mapRef.current.setCenter([lat, lon]);
        return;
      }

      if (mapRef.current?.search) {
        const coords = await mapRef.current.search(addr);
        if (Array.isArray(coords) && coords.length === 2) {
          setSelectedLocation({
            address: addr,
            coords: { lat: coords[0], lon: coords[1] },
          });
        }
      }
    } catch (e) {
      console.error('applySuggest error:', e);
    }
  };

  const handleKeyDownOnInput = (e) => {
    if (!showSuggests || !suggests.length) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % suggests.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + suggests.length) % suggests.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const s = suggests[activeIndex] || suggests[0];
      if (s) applySuggest(s);
    } else if (e.key === 'Escape') {
      setShowSuggests(false);
    }
  };

  const resetForm = () => {
    setSelectedManager(null);
    setName('');
    setSearchQuery('');
    setSelectedLocation(null);
    setIsSearching(false);
    setIsPartOfNetwork(false);
    setSelectedNetwork(null);
    setConfirmOpen(false);
    setSuggests([]);
    setShowSuggests(false);
    setActiveIndex(-1);
  };

  const handleSave = async () => {
    if (!name.trim() || !selectedLocation) {
      toast.error('Введите название и выберите адрес на карте');
      return;
    }

    const responsibleId =
      (hasManagers ? selectedManager : currentAdminId) || selectedManager || null;

    const newSalesPoint = {
      name,
      address: selectedLocation.address,
      coords: selectedLocation.coords,
      employees: responsibleId ? [responsibleId] : initialData.employees || [],
      network_id: isPartOfNetwork ? (selectedNetwork ?? null) : null,
    };

    try {
      await Promise.resolve(onSave?.(newSalesPoint));

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
        style={{ background: '#f5f5f5', color: '#2c3e50', maxWidth: '100%' }}
      >
        Удалить
      </CustomMainButton>
      <CustomMainButton
        onClick={() => setConfirmOpen(false)}
        style={{ background: '#bf4756', maxWidth: '100%' }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#a63d49';
          e.currentTarget.style.color = '#fff';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = '#bf4756';
          e.currentTarget.style.color = '';
        }}
      >
        Отмена
      </CustomMainButton>
    </>
  ) : (
    <>
      {isEdit && (
        <DarkButton onClick={() => setConfirmOpen(true)} disabled={!isDeletable}>
          Удалить
        </DarkButton>
      )}
      <DangerButton onClick={handleSave}>
        Сохранить
      </DangerButton>
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
        <ModalBody ref={clickAwayRef}>
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

            <AddressWrap>
              <CustomInput
                ref={addressInputRef}
                placeholder="Введите адрес"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (DADATA_TOKEN) setShowSuggests(true);
                }}
                onFocus={() => {
                  if (DADATA_TOKEN && suggests.length) setShowSuggests(true);
                }}
                onKeyDown={handleKeyDownOnInput}
                required
              />

              {isSearching && (
                <Label style={{ color: '#7f8c8d', marginTop: 6 }}>Поиск адреса…</Label>
              )}

              {showSuggests && suggests.length > 0 && (
                <SuggestList role="listbox">
                  {suggests.map((s, idx) => (
                    <SuggestItem
                      key={`${s.value}-${idx}`}
                      $active={idx === activeIndex}
                      onMouseEnter={() => setActiveIndex(idx)}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        applySuggest(s);
                      }}
                      role="option"
                      aria-selected={idx === activeIndex}
                    >
                      {s.value}
                    </SuggestItem>
                  ))}
                </SuggestList>
              )}
            </AddressWrap>
          </FieldGroup>

          {selectedLocation && (
            <LocationInfo>
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

              {hasManagers ? (
                <CustomSelect
                  value={selectedManager}
                  onChange={setSelectedManager}
                  options={managerOptions}
                  placeholder="Выберите сотрудника"
                />
              ) : (
                <CustomInput
                  value={currentAdminName}
                  disabled
                  placeholder="Будет назначен текущий администратор"
                />
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
