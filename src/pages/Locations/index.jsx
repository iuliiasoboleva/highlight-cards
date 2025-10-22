import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { MapPin, Pencil, Trash2 } from 'lucide-react';
import { useDebounce } from 'use-debounce';

import EditLayout from '../../components/EditLayout';
import GeoBadge from '../../components/GeoBadge';
import LoaderCentered from '../../components/LoaderCentered';
import { useToast } from '../../components/Toast';
import YandexMapPicker from '../../components/YandexMapPicker';
import CustomInput from '../../customs/CustomInput/index.jsx';
import CustomModal from '../../customs/CustomModal';
import CustomSelect from '../../customs/CustomSelect';
import CustomTextArea from '../../customs/CustomTextarea/index.jsx';
import ToggleSwitch from '../../customs/CustomToggleSwitch/index.jsx';
import { formatAddress, normalizeAddr, sameCoords } from '../../helpers/normalizeAddr.jsx';
import { setCurrentCard } from '../../store/cardsSlice';
import {
  createBranch as createBranchThunk,
  deleteBranch as deleteBranchThunk,
  editBranch,
  fetchBranches,
} from '../../store/salesPointsSlice';
import { DADATA_TOKEN, DADATA_URL, MAX_LOCATIONS } from '../../utils/locations.jsx';
import {
  ActionButton,
  ActionRow,
  AddLocationBtn,
  AddressWrap,
  DeleteLocationBtn,
  LimitAlert,
  LocationActions,
  LocationCard,
  LocationInfo,
  LocationList,
  LocationsSubtext,
  PrimaryBtn,
  SearchLoading,
  SuggestItem,
  SuggestList,
} from './styles.jsx';

const Locations = () => {
  const mapRef = useRef(null);
  const clickAwayRef = useRef(null);
  const dispatch = useDispatch();
  const toast = useToast();

  const currentCard = useSelector((state) => state.cards.currentCard);
  const allCards = useSelector((state) => state.cards.cards);
  const { list: locations, loading: locationsLoading } = useSelector((state) => state.locations);
  const orgId = useSelector((state) => state.user.organization_id);
  const currentUser = useSelector((s) => s.user);

  const [organizationResults, setOrganizationResults] = useState([]);
  const [limitReached, setLimitReached] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  const [debouncedSearchQuery] = useDebounce(searchQuery, 400);
  const [showAddForm, setShowAddForm] = useState(false);

  const [suggests, setSuggests] = useState([]);
  const [showSuggests, setShowSuggests] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const isSingleExisting = locations.length === 1;
  const singleLoc = useMemo(
    () => (isSingleExisting ? locations[0] : null),
    [isSingleExisting, locations],
  );
  const [singleEditMode, setSingleEditMode] = useState(false);
  const [singleAddress, setSingleAddress] = useState('');
  const [singleCoords, setSingleCoords] = useState(null);
  const [singleShowMap, setSingleShowMap] = useState(false);

  const [locationToDelete, setLocationToDelete] = useState(null);

  // подтягиваем список точек
  useEffect(() => {
    if (orgId) dispatch(fetchBranches(orgId));
  }, [orgId, dispatch]);

  // если карточка не выбрана — выберем первую
  useEffect(() => {
    if (!currentCard?.id && allCards?.length) {
      dispatch(setCurrentCard(allCards[0]));
    }
  }, [currentCard?.id, allCards, dispatch]);

  const [pushMessage, setPushMessage] = useState(
    currentCard?.pushNotification?.message ||
      `Новое уведомление по вашей карте "${currentCard?.name || currentCard?.title || 'Карта'}"`,
  );

  useEffect(() => {
    if (singleLoc) {
      setSingleAddress(singleLoc.name || singleLoc.address || '');
      setSingleCoords(singleLoc.coords || null);
      setSingleEditMode(false);
      setSingleShowMap(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singleLoc?.id]);

  useEffect(() => {
    let aborted = false;
    const fetchSuggests = async () => {
      if (!DADATA_TOKEN || isSingleExisting) {
        setSuggests([]);
        setShowSuggests(false);
        return;
      }
      const q = debouncedSearchQuery.trim();
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
      } catch (e) {
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
  }, [
    debouncedSearchQuery,
    isSingleExisting,
    currentUser?.company?.city,
    currentUser?.profile?.city,
  ]);

  useEffect(() => {
    const onDocClick = (e) => {
      if (!clickAwayRef.current) return;
      if (!clickAwayRef.current.contains(e.target)) setShowSuggests(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  useEffect(() => {
    const searchAddress = async () => {
      if (!debouncedSearchQuery || !mapRef.current || isSingleExisting) return;
      if (DADATA_TOKEN) return;
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
        console.error('Ошибка поиска:', error);
        toast.error('Ошибка поиска адреса');
      } finally {
        setIsSearching(false);
      }
    };
    searchAddress();
  }, [debouncedSearchQuery, toast, isSingleExisting]);

  const handleCardSelect = (cardId) => {
    const selected = allCards.find((c) => c.id === cardId);
    if (selected) {
      dispatch(
        setCurrentCard({
          ...selected,
          pushNotification: selected.pushNotification || {
            message: `Новое уведомление по вашей карте "${selected.name || selected.title}"`,
            scheduledDate: '',
          },
        }),
      );
      setPushMessage(
        selected.pushNotification?.message ||
          `Новое уведомление по вашей карте "${selected.name || selected.title}"`,
      );
    }
  };

  const handleDeleteClick = (location) => {
    setLocationToDelete(location);
  };

  const handleConfirmDelete = () => {
    if (!locationToDelete) return;
    
    dispatch(deleteBranchThunk(locationToDelete.id))
      .unwrap()
      .then(() => {
        toast.success('Локация удалена');
        setLocationToDelete(null);
      })
      .catch(() => {
        toast.error('Не удалось удалить локацию');
        setLocationToDelete(null);
      });
  };

  const handleCancelDelete = () => {
    setLocationToDelete(null);
  };

  const applySuggest = async (s) => {
    const addr = s?.value || s?.unrestricted_value || '';
    const lat = Number(s?.data?.geo_lat);
    const lon = Number(s?.data?.geo_lon);

    setSearchQuery(addr);
    setShowSuggests(false);

    if (!Number.isNaN(lat) && !Number.isNaN(lon)) {
      const loc = { address: formatAddress(addr), coords: { lat, lon } };
      setSelectedLocation(loc);
      if (mapRef.current?.setCenter) mapRef.current.setCenter([lat, lon]);
      return;
    }

    if (mapRef.current?.search) {
      const coords = await mapRef.current.search(addr);
      if (Array.isArray(coords) && coords.length === 2) {
        setSelectedLocation({
          address: formatAddress(addr),
          coords: { lat: coords[0], lon: coords[1] },
        });
      }
    }
  };

  const handleKeyDownOnSearch = (e) => {
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

  // добавление локации (заблокировано при одной)
  const handleAddLocation = () => {
    if (isSingleExisting) {
      toast.info('Ваш тариф позволяет только одну точку продаж');
      return;
    }

    const remaining = MAX_LOCATIONS - locations.length;
    if (remaining <= 0) {
      setLimitReached(true);
      toast.info('Достигнут лимит локаций');
      return;
    }

    const candidate = organizationResults[0] || selectedLocation || null;
    if (!candidate) return;

    const nextAddressRaw = formatAddress(
      candidate.name || candidate.address || (debouncedSearchQuery || searchQuery || '').trim(),
    );
    if (!nextAddressRaw) return;

    const nextCoords = {
      lat: candidate.coords?.lat ?? candidate.coords?.[0] ?? 55.75,
      lon: candidate.coords?.lon ?? candidate.coords?.[1] ?? 37.61,
    };

    // строгая проверка дублей
    const nAddr = normalizeAddr(nextAddressRaw);
    const dupByText = locations.some((l) => normalizeAddr(l.name || l.address) === nAddr);
    const dupByCoords = locations.some((l) => l?.coords && sameCoords(l.coords, nextCoords));
    if (dupByText || dupByCoords) {
      toast.error('Точка продаж с таким адресом уже создана');
      return;
    }

    dispatch(
      createBranchThunk({
        name: nextAddressRaw,
        address: nextAddressRaw,
        coords_lat: nextCoords.lat,
        coords_lon: nextCoords.lon,
        organization_id: orgId,
      }),
    )
      .unwrap()
      .then(() => {
        toast.success('Локация добавлена');
        setOrganizationResults([]);
        setSelectedLocation(null);
        setSearchQuery('');
      })
      .catch(() => toast.error('Не удалось создать локацию'));
  };

  // поиск организаций (заблокирован при одной)
  const handleSearchOrganizations = async () => {
    if (isSingleExisting) {
      toast.info('Добавление новых адресов недоступно на текущем тарифе');
      return;
    }
    const q = (debouncedSearchQuery || '').trim();
    if (!q || !mapRef.current) return;

    try {
      setIsSearching(true);
      const results = await mapRef.current.searchOrganizations(q);
      setOrganizationResults(Array.isArray(results) ? results : []);
    } catch (error) {
      console.error('Ошибка при поиске организаций:', error);
      toast.error('Ошибка поиска организаций');
    } finally {
      setIsSearching(false);
    }
  };

  const toggleGeo = (loc) => {
    const currentState = loc.active !== undefined ? loc.active : true;
    const newState = !currentState;
    
    dispatch(
      editBranch({
        id: loc.id,
        geo_active: newState,
      }),
    )
      .unwrap()
      .then(() => {
        toast.info(`Geo-push ${newState ? 'включён' : 'выключен'}`);
      })
      .catch(() => {
        toast.error('Не удалось переключить Geo-push');
      });
  };

  // сохранить изменённый адрес для единственной локации
  const saveSingle = async () => {
    const addr = formatAddress((singleAddress || '').trim());
    if (!addr) {
      toast.error('Введите адрес');
      return;
    }

    const targetCoords = singleCoords || singleLoc.coords || null;

    const dupByText = locations.some(
      (l) => l.id !== singleLoc.id && normalizeAddr(l.name || l.address) === normalizeAddr(addr),
    );
    const dupByCoords = locations.some(
      (l) =>
        l.id !== singleLoc.id && l.coords && targetCoords && sameCoords(l.coords, targetCoords),
    );

    if (dupByText || dupByCoords) {
      toast.error('Точка продаж с таким адресом уже создана');
      return;
    }

    try {
      await dispatch(
        editBranch({
          id: singleLoc.id,
          name: addr,
          address: addr,
          coords_lat: targetCoords?.lat,
          coords_lon: targetCoords?.lon,
        }),
      ).unwrap();
      setSingleEditMode(false);
      toast.success('Адрес обновлён');
    } catch {
      toast.error('Не удалось сохранить адрес');
    }
  };

  // показать карту по единственной локации
  const showSingleOnMap = async () => {
    if (!singleAddress?.trim()) {
      toast.error('Сначала укажите адрес');
      return;
    }
    
    if (singleShowMap && singleCoords) {
      toast.info('Адрес показан на карте');
      return;
    }

    setSingleShowMap(true);
    
    if (!singleCoords) {
      setIsSearching(true);
      
      setTimeout(async () => {
        try {
          if (mapRef.current) {
            const coords = await mapRef.current.search(singleAddress.trim());
            if (Array.isArray(coords) && coords.length === 2) {
              setSingleCoords({ lat: coords[0], lon: coords[1] });
              toast.info('Адрес показан на карте');
            } else {
              toast.error('Адрес не найден');
            }
          } else {
            toast.error('Карта не загружена, повторите попытку');
          }
        } catch (err) {
          toast.error('Не удалось показать адрес на карте');
        } finally {
          setIsSearching(false);
        }
      }, 500);
    } else {
      toast.info('Адрес показан на карте');
    }
  };

  if (locationsLoading) return <LoaderCentered />;

  const renderMapSection = () => (
    <>
      <GeoBadge title="Адреса точек продаж" badgeText="Geo-push в радиусе 100 метров" />

      <LocationsSubtext>
        Добавьте адреса, рядом с которыми вашим клиентам будут автоматически приходить
        push-уведомления. Geo-push работает, когда клиент оказывается в радиусе 100 метров от вашей
        точки.
      </LocationsSubtext>

      <CustomSelect
        value={currentCard?.id || allCards?.[0]?.id || null}
        onChange={handleCardSelect}
        options={(allCards || []).map((card) => ({
          value: card.id,
          label: card.name || card.title,
        }))}
      />

      {isSingleExisting ? (
        <>
          <LocationsSubtext style={{ marginTop: 8, color: 'red' }}>
            У вас активен тариф с одной точкой продаж. Добавление новых адресов недоступно.
          </LocationsSubtext>

          <ActionRow>
            <CustomInput
              value={singleAddress}
              onChange={(e) => setSingleAddress(e.target.value)}
              placeholder="Адрес точки продаж"
              disabled={!singleEditMode}
              style={{ minWidth: 320 }}
            />
            <ActionButton
              variant="secondary"
              onClick={() => setSingleEditMode((v) => !v)}
              aria-label="Редактировать адрес"
              title={singleEditMode ? 'Отменить редактирование' : 'Редактировать адрес'}
            >
              <Pencil className="icon" size={16} />
              {singleEditMode ? 'Отмена' : 'Править'}
            </ActionButton>
            <ActionButton
              variant="secondary"
              onClick={showSingleOnMap}
              aria-label="Проверить адрес"
              title="Показать на карте"
            >
              <MapPin className="icon" size={16} />
              Проверить адрес
            </ActionButton>
          </ActionRow>

          {singleEditMode && (
            <PrimaryBtn onClick={saveSingle} disabled={!singleAddress.trim()}>
              Сохранить
            </PrimaryBtn>
          )}

          {isSearching && <SearchLoading>Идёт поиск…</SearchLoading>}

          {singleShowMap && (
            <div style={{ marginTop: 12, marginBottom: 12 }}>
              <YandexMapPicker
                ref={mapRef}
                onSelect={(loc) => {
                  if (loc?.coords) {
                    setSingleCoords(loc.coords);
                  }
                }}
                initialCoords={
                  singleCoords ? { lat: singleCoords.lat, lon: singleCoords.lon } : undefined
                }
              />
            </div>
          )}

          <CustomTextArea
            rows={3}
            value={pushMessage}
            placeholder="Введите текст push-уведомления"
            onChange={(e) => setPushMessage(e.target.value)}
          />
        </>
      ) : (
        <>
          {limitReached && <LimitAlert>Вы достигли лимита в {MAX_LOCATIONS} локаций</LimitAlert>}

          <ActionRow ref={clickAwayRef}>
            <AddressWrap style={{ flex: 1 }}>
              <CustomInput
                type="text"
                placeholder="Введите адрес локации"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (DADATA_TOKEN) setShowSuggests(true);
                }}
                onFocus={() => {
                  if (DADATA_TOKEN && suggests.length) setShowSuggests(true);
                }}
                onKeyDown={handleKeyDownOnSearch}
                style={{ width: '100%' }}
              />

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

            {/* Кнопка "Найти все" скрыта по требованию */}
          </ActionRow>

          {/* Блок координат скрыт по требованию */}

          {organizationResults.length > 0 && (
            <LocationInfo>
              <h4>Найденные организации:</h4>
              <ul>
                {organizationResults.map((org, index) => (
                  <li key={index}>
                    {org.name} ({org.coords[0].toFixed(5)}, {org.coords[1].toFixed(5)})
                  </li>
                ))}
              </ul>
            </LocationInfo>
          )}

          <div style={{ marginTop: 12, marginBottom: 12 }}>
            <YandexMapPicker
              ref={mapRef}
              onSelect={setSelectedLocation}
              initialCoords={selectedLocation?.coords}
            />
          </div>

          <CustomTextArea
            rows={3}
            value={pushMessage}
            placeholder="Введите текст push-уведомления"
            onChange={(e) => setPushMessage(e.target.value)}
          />

          <PrimaryBtn onClick={handleAddLocation} disabled={!pushMessage.trim()}>
            Добавить
          </PrimaryBtn>
        </>
      )}

      <LocationList>
        {locations.map((loc) => (
          <LocationCard key={loc.id}>
            <LocationInfo>
              <p>{loc.name}</p>
              {loc.coords && (
                <div className="location-coords">
                  {loc.coords.lat.toFixed(5)}, {loc.coords.lon.toFixed(5)}
                </div>
              )}
            </LocationInfo>

            <LocationActions>
              <ToggleSwitch checked={loc.active !== undefined ? loc.active : true} onChange={() => toggleGeo(loc)} />
              <DeleteLocationBtn
                onClick={() => handleDeleteClick(loc)}
                aria-label="Удалить локацию"
              >
                <Trash2 size={20} />
              </DeleteLocationBtn>
            </LocationActions>
          </LocationCard>
        ))}
      </LocationList>
    </>
  );

  const leftContent =
    locations.length === 0 && !showAddForm ? (
      <>
        <GeoBadge title="Адреса точек продаж" badgeText="Geo-push в радиусе 100 метров" />
        <LocationsSubtext>
          Добавьте адреса, рядом с которыми вашим клиентам будут автоматически приходить
          push-уведомления. Geo-push работает, когда клиент оказывается в радиусе 100 метров от
          вашей точки.
        </LocationsSubtext>
        <AddLocationBtn onClick={() => setShowAddForm(true)}>Добавить локацию</AddLocationBtn>
      </>
    ) : (
      renderMapSection()
    );

  return (
    <>
      <EditLayout defaultPlatform="chat" chatMessage={pushMessage}>
        {leftContent}
      </EditLayout>

      <CustomModal
        open={!!locationToDelete}
        onClose={handleCancelDelete}
        title="Удалить адрес точки продаж?"
        maxWidth={480}
        closeOnOverlayClick={false}
        actions={
          <>
            <CustomModal.SecondaryButton onClick={handleCancelDelete}>
              Отмена
            </CustomModal.SecondaryButton>
            <CustomModal.PrimaryButton 
              onClick={handleConfirmDelete}
              style={{ background: '#e53935' }}
            >
              Удалить
            </CustomModal.PrimaryButton>
          </>
        }
      >
        <p style={{ margin: '12px 0', fontWeight: 500, color: '#2c3e50' }}>
          Адрес будет удален из системы без возможности восстановления
        </p>
        {locationToDelete && (
          <p style={{ margin: '16px 0 0', color: '#2c3e50' }}>
            Удалить адрес: <strong>{locationToDelete.name || locationToDelete.address}</strong>?
          </p>
        )}
      </CustomModal>
    </>
  );
};

export default Locations;
