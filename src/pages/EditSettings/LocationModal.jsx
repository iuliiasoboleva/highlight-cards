import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { useDebounce } from 'use-debounce';

import { useToast } from '../../components/Toast';
import YandexMapPicker from '../../components/YandexMapPicker';
import CustomInput from '../../customs/CustomInput';
import CustomMainButton from '../../customs/CustomMainButton';
import CustomModal from '../../customs/CustomModal';
import CustomSelect from '../../customs/CustomSelect';
import CustomToggleSwitch from '../../customs/CustomToggleSwitch';
import { normalizeCoords } from '../../helpers/formatCoords';
import { assignManagerToSalesPoint } from '../../store/managersSlice';
import { DADATA_TOKEN, DADATA_URL, MAX_LOCATIONS } from '../../utils/locations';
import { normalizeErr } from '../../utils/normalizeErr';
import {
  AddressWrap,
  EditLink,
  FieldGroup,
  InlineRow,
  Label,
  LimitNote,
  ModalBody,
  RowBetween,
  SmallGray,
  SuggestItem,
  SuggestList,
} from './styles';

const LocationModal = ({ isOpen, onClose, onSave, initialData = {}, isEdit = false }) => {
  const dispatch = useDispatch();
  const toast = useToast();
  const navigate = useNavigate();

  const allManagers = useSelector((s) => s.managers.list) || [];
  const networks = useSelector((s) => s.networks.list) || [];
  const salesPoints = useSelector((s) => s.salesPoints?.list) || [];
  const subscription = useSelector((s) => s.subscription?.info) || null;

  const currentUser = useSelector((s) => s.user) || {};
  const currentAdminId =
    currentUser?.id ||
    currentUser?.userId ||
    currentUser?.profile?.id ||
    currentUser?.profile?.userId ||
    null;

  const mapRef = useRef(null);
  const clickAwayRef = useRef(null);

  const [selectedManager, setSelectedManager] = useState(null);
  const [name, setName] = useState(initialData.name || '');

  const [searchQuery, setSearchQuery] = useState(initialData.address || '');
  const [selectedLocation, setSelectedLocation] = useState(
    initialData.address && initialData.coords
      ? { address: initialData.address, coords: normalizeCoords(initialData.coords) }
      : null,
  );
  const [isSearching, setIsSearching] = useState(false);

  const [isPartOfNetwork, setIsPartOfNetwork] = useState(Boolean(initialData.network_id));
  const [selectedNetwork, setSelectedNetwork] = useState(initialData.network_id || null);

  const [debouncedSearchQuery] = useDebounce(searchQuery, 400);

  const [suggests, setSuggests] = useState([]);
  const [showSuggests, setShowSuggests] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const maxLocations = useMemo(() => {
    const direct = Number(subscription?.limits?.locations);
    if (!Number.isNaN(direct) && direct > 0) return direct;
    if (String(subscription?.status || '').toLowerCase() === 'trial') return 1;
    return MAX_LOCATIONS;
  }, [subscription]);

  const isLimitReached = !isEdit && salesPoints.length >= maxLocations;

  useEffect(() => {
    if (!isOpen) return;

    const n = initialData?.name || '';
    const a = initialData?.address || '';
    const c = initialData?.coords || null;

    setName(n);
    setSearchQuery(a);

    if (c) {
      const nc = normalizeCoords(c);
      setSelectedLocation({ address: a, coords: nc });
      if (mapRef.current?.setCenter && nc.lat != null && nc.lng != null) {
        mapRef.current.setCenter([nc.lat, nc.lng]);
      }
    } else {
      setSelectedLocation(null);
    }

    setIsPartOfNetwork(Boolean(initialData.network_id));
    setSelectedNetwork(initialData.network_id || null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, initialData]);

  // Поиск адреса через карту, если DaData недоступна
  useEffect(() => {
    const searchAddress = async () => {
      if (!debouncedSearchQuery || !mapRef.current) return;
      if (DADATA_TOKEN) return;

      try {
        setIsSearching(true);
        const coords = await mapRef.current.search(debouncedSearchQuery.trim());
        if (Array.isArray(coords) && coords.length === 2) {
          const nc = normalizeCoords({ lat: coords[0], lon: coords[1] });
          setSelectedLocation({
            address: debouncedSearchQuery,
            coords: nc,
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

  useEffect(() => {
    let aborted = false;

    const fetchSuggests = async () => {
      if (!DADATA_TOKEN) {
        setSuggests([]);
        setShowSuggests(false);
        return;
      }
      const q = debouncedSearchQuery?.trim();
      if (!q) {
        setSuggests([]);
        setShowSuggests(false);
        return;
      }

      try {
        setIsSearching(true);

        const city = currentUser?.company?.city || currentUser?.profile?.city || null;

        const body = { query: q, count: 8 };
        if (city) body.locations = [{ city }];

        const res = await fetch(DADATA_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${DADATA_TOKEN}`,
          },
          body: JSON.stringify(body),
        });

        if (!res.ok) throw new Error(`DaData ${res.status}`);
        const data = await res.json();
        if (!aborted) {
          const s = Array.isArray(data?.suggestions) ? data.suggestions : [];
          setSuggests(s);
          setShowSuggests(true);
          setActiveIndex(-1);
        }
      } catch (err) {
        console.warn('DaData error:', err);
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
  }, [debouncedSearchQuery, currentUser?.company?.city, currentUser?.profile?.city]);

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

  const handleMapSelect = useCallback((location) => {
    const nc = normalizeCoords(location?.coords);
    setSelectedLocation({ address: location?.address ?? '', coords: nc });
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
    setSuggests([]);
    setShowSuggests(false);
    setActiveIndex(-1);
  };

  const applySuggest = async (s) => {
    try {
      const addr = s?.value || s?.unrestricted_value || '';
      const lat = Number(s?.data?.geo_lat);
      const lon = Number(s?.data?.geo_lon);

      setSearchQuery(addr);
      setShowSuggests(false);

      if (!Number.isNaN(lat) && !Number.isNaN(lon)) {
        const nc = normalizeCoords({ lat, lon });
        setSelectedLocation({ address: addr, coords: nc });
        if (mapRef.current?.setCenter) mapRef.current.setCenter([nc.lat, nc.lng]);
        return;
      }

      if (mapRef.current?.search) {
        const coords = await mapRef.current.search(addr);
        if (Array.isArray(coords) && coords.length === 2) {
          const nc = normalizeCoords({ lat: coords[0], lon: coords[1] });
          setSelectedLocation({ address: addr, coords: nc });
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

  const handleSave = async () => {
    if (isLimitReached) {
      toast.error('Достигнут лимит точек по вашему тарифу');
      return;
    }

    if (!name.trim() || !selectedLocation) {
      toast.error('Введите название и выберите адрес на карте');
      return;
    }

    const responsibleId =
      (Array.isArray(allManagers) && allManagers.length > 0 ? selectedManager : currentAdminId) ||
      selectedManager ||
      null;

    const addr = (searchQuery || selectedLocation?.address || '').trim();

    const newSalesPoint = {
      name,
      address: addr,
      coords: selectedLocation?.coords,
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

      toast.success(isEdit ? 'Точка продаж обновлена' : 'Точка продаж сохранена');
      onClose?.();
      resetForm();
    } catch (e) {
      console.error('[SalesPointsModal] save error:', e);
      toast.error(normalizeErr(e));
    }
  };

  const title = isEdit ? 'Редактировать локацию' : 'Добавить локацию';
  const initialCoords = selectedLocation?.coords || null;

  return (
    <CustomModal
      open={isOpen}
      onClose={() => {
        onClose?.();
        resetForm();
      }}
      title={title}
      actions={
        <CustomMainButton
          onClick={handleSave}
          style={{ maxWidth: '100%' }}
          disabled={isLimitReached}
        >
          {isEdit ? 'Сохранить изменения' : 'Сохранить'}
        </CustomMainButton>
      }
    >
      <ModalBody ref={clickAwayRef}>
        {isLimitReached && (
          <LimitNote>
            Сейчас у вас доступна <b>одна локация</b> по тарифу. Нужно больше?
            <br />
            Просто оплатите дополнительную точку — и вперёд!{' '}
            <EditLink onClick={() => navigate('/settings')}>Перейти в «Подписку»</EditLink>
          </LimitNote>
        )}

        <FieldGroup>
          <Label>Название локации</Label>
          <CustomInput
            placeholder="Название локации"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </FieldGroup>

        <FieldGroup>
          <Label>Адрес</Label>
          <AddressWrap>
            <CustomInput
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

            {isSearching && <SmallGray>Поиск адреса…</SmallGray>}

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

        {false && selectedLocation && (selectedLocation.address || searchQuery)}

        <FieldGroup>
          <YandexMapPicker ref={mapRef} onSelect={handleMapSelect} initialCoords={initialCoords} />
        </FieldGroup>

        <InlineRow>
          <FieldGroup style={{ flex: 1, minWidth: 280 }}>
            <RowBetween style={{ alignItems: 'center' }}>
              <Label as="span">Эта локация является частью сети?</Label>
              <CustomToggleSwitch
                checked={isPartOfNetwork}
                onChange={(e) => {
                  const checked = e?.target ? e.target.checked : !isPartOfNetwork;
                  setIsPartOfNetwork(checked);
                  if (!checked) setSelectedNetwork(null);
                }}
              />
            </RowBetween>

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
    </CustomModal>
  );
};

export default LocationModal;
