import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Loader2, Trash2 } from 'lucide-react';
import { useDebounce } from 'use-debounce';

import CustomSelect from '../../components/CustomSelect';
import PushPreview from '../../components/PushPreview';
import ToggleSwitch from '../../components/ToggleSwitch';
import YandexMapPicker from '../../components/YandexMapPicker';
import { setCurrentCard } from '../../store/cardsSlice';
import {
  createBranch as createBranchThunk,
  deleteBranch as deleteBranchThunk,
  editBranch,
  fetchBranches,
} from '../../store/salesPointsSlice';

import './styles.css';

const MAX_LOCATIONS = 10;

const Locations = () => {
  const mapRef = useRef(null);
  const dispatch = useDispatch();

  const currentCard = useSelector((state) => state.cards.currentCard);
  const allCards = useSelector((state) => state.cards.cards);
  const { list: locations, loading: locationsLoading } = useSelector((state) => state.locations);
  const orgId = useSelector((state) => state.user.organization_id);

  const [organizationResults, setOrganizationResults] = useState([]);
  const [limitReached, setLimitReached] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [pushMessage, setPushMessage] = useState(
    currentCard.pushNotification?.message ||
      `Новое уведомление по вашей карте "${currentCard.title}"`,
  );

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  const [activeTab, setActiveTab] = useState('map');

  const [debouncedSearchQuery] = useDebounce(searchQuery, 2000);

  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    const searchAddress = async () => {
      if (!debouncedSearchQuery || !mapRef.current) return;

      try {
        setIsSearching(true);
        const coords = await mapRef.current.search(debouncedSearchQuery.trim());

        if (coords && Array.isArray(coords) && coords.length === 2) {
          setSelectedLocation({
            address: debouncedSearchQuery,
            coords: {
              lat: coords[0],
              lon: coords[1],
            },
          });
        }
      } catch (error) {
        console.error('Ошибка поиска:', error);
      } finally {
        setIsSearching(false);
      }
    };

    searchAddress();
  }, [debouncedSearchQuery]);

  const handleCardSelect = (cardId) => {
    const selected = allCards.find((c) => c.id === cardId);
    if (selected) {
      dispatch(
        setCurrentCard({
          ...selected,
          pushNotification: selected.pushNotification || {
            message: `Новое уведомление по вашей карте "${selected.title}"`,
            scheduledDate: '',
          },
        }),
      );
    }
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (orgId) dispatch(fetchBranches(orgId));
  }, [orgId]);

  const removeLocation = (id) => {
    dispatch(deleteBranchThunk(id));
  };

  const handleAddLocation = () => {
    const remaining = MAX_LOCATIONS - locations.length;
    if (remaining <= 0) {
      setLimitReached(true);
      return;
    }

    const newLoc = organizationResults[0];
    if (!newLoc) return;

    const payload = {
      name: newLoc.name,
      address: newLoc.name,
      coords_lat: newLoc.coords[0],
      coords_lon: newLoc.coords[1],
      organization_id: orgId,
    };
    dispatch(createBranchThunk(payload));

    setOrganizationResults([]);
    setSelectedLocation(null);
    setSearchQuery('');
  };

  const handleSearchOrganizations = async () => {
    if (!debouncedSearchQuery || !mapRef.current) return;

    try {
      setIsSearching(true);
      const results = await mapRef.current.searchOrganizations(debouncedSearchQuery.trim());

      if (Array.isArray(results) && results.length > 0) {
        setOrganizationResults(results);
        console.log('Найдено бизнес-точек:', results);
      } else {
        setOrganizationResults([]);
        console.log('Бизнес-точки не найдены');
      }
    } catch (error) {
      console.error('Ошибка при поиске организаций:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const toggleGeo = (loc) => {
    dispatch(
      editBranch({
        id: loc.id,
        geo_active: !loc.active,
      }),
    );
  };

  const renderMapSection = () => (
    <div className="edit-type-left">
      <div className="edit-type-page">
        <h2>
          Локации <span className="geo-badge">Geo-push в радиусе 100 метров</span>
        </h2>
        <p className="locations-subtext">
          Добавьте адреса, рядом с которыми вашим клиентам будут автоматически приходить
          push-уведомления. Geo-push работает, когда клиент оказывается в радиусе 100 метров от
          вашей точки.
        </p>
        {noLocations && showAddForm && (
          <button
            className="card-form-add-btn location-toggle-btn"
            onClick={() => setShowAddForm(false)}
          >
            Скрыть добавление локации
          </button>
        )}
        <CustomSelect
          value={currentCard?.id || allCards[0]?.id || null}
          onChange={handleCardSelect}
          options={allCards.map((card) => ({
            value: card.id,
            label: card.name || card.title,
          }))}
          className="tariff-period-select"
        />
        {limitReached && (
          <div className="limit-alert">Вы достигли лимита в {MAX_LOCATIONS} локаций</div>
        )}

        <div className="search-container">
          <input
            type="text"
            className="location-modal-input"
            placeholder="Введите адрес локации"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && setSearchQuery(e.target.value)}
          />
          <button
            className="btn btn-outline search-org-btn"
            onClick={handleSearchOrganizations}
            disabled={!debouncedSearchQuery.trim()}
            style={{ marginLeft: '10px' }}
          >
            Найти все
          </button>
        </div>

        {isSearching && <div className="search-loading">Идет поиск...</div>}

        {selectedLocation && (
          <div className="location-info">
            <p>Выбрано: {selectedLocation.address}</p>
            <p>
              Координаты: {selectedLocation.coords.lat.toFixed(6)},{' '}
              {selectedLocation.coords.lon.toFixed(6)}
            </p>
          </div>
        )}
        {organizationResults.length > 0 && (
          <div className="location-info">
            <h4>Найденные организации:</h4>
            <ul>
              {organizationResults.map((org, index) => (
                <li key={index}>
                  {org.name} ({org.coords[0].toFixed(5)}, {org.coords[1].toFixed(5)})
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="location-push-textarea">
          <YandexMapPicker
            ref={mapRef}
            onSelect={setSelectedLocation}
            initialCoords={selectedLocation?.coords}
          />
        </div>

        <textarea
          className="custom-textarea"
          value={pushMessage}
          onChange={(e) => setPushMessage(e.target.value)}
          placeholder="Введите текст push-уведомления"
        />

        <button
          className="card-form-add-btn"
          onClick={handleAddLocation}
          disabled={!pushMessage.trim()}
        >
          Добавить
        </button>
        <div className="location-list">
          {locations.map((loc) => (
            <div key={loc.id} className="location-card">
              <div className="location-info">
                <p>{loc.name}</p>
                {loc.coords && (
                  <div className="location-coords">
                    {loc.coords.lat.toFixed(5)}, {loc.coords.lon.toFixed(5)}
                  </div>
                )}
              </div>
              <div className="location-actions">
                <ToggleSwitch checked={loc.active} onChange={() => toggleGeo(loc)} />
                <button
                  className="card-form-delete-btn"
                  onClick={() => removeLocation(loc.id)}
                  aria-label="Удалить поле"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPreviewSection = () => (
    <div className="edit-type-right">
      <div className="phone-sticky">
        <div className="card-state">
          <span className={`status-indicator ${currentCard.isActive ? 'active' : 'inactive'}`} />
          {currentCard.isActive ? 'Активна' : 'Не активна'}
        </div>
        <div className="phone-frame">
          <img className="phone-image" src={currentCard.frameUrl} alt={currentCard.name} />
          <div className="phone-screen">
            <PushPreview card={currentCard} message={pushMessage} />
          </div>
        </div>
        <p className="activate-text">Geo-push доступны только для устройств на iOS</p>
      </div>
    </div>
  );

  // пустой экран при отсутствии локаций
  const renderEmptyState = () => (
    <div className="edit-type-left">
      <div className="edit-type-page">
        <h2>
          Локации <span className="geo-badge">Geo-push в радиусе 100 метров</span>
        </h2>
        <p className="locations-subtext">
          Добавьте адреса, рядом с которыми вашим клиентам будут автоматически приходить
          push-уведомления. Geo-push работает, когда клиент оказывается в радиусе 100 метров от
          вашей точки.
        </p>
        <button
          className="card-form-add-btn location-toggle-btn"
          onClick={() => setShowAddForm(true)}
        >
          Добавить локацию
        </button>
      </div>
    </div>
  );

  const noLocations = locations.length === 0;

  // будем отображать левый блок в зависимости от состояния
  const leftBlock = noLocations && !showAddForm ? renderEmptyState() : renderMapSection();

  if (locationsLoading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 'calc(100vh - 200px)',
        }}
      >
        <Loader2 className="spinner" size={48} strokeWidth={1.4} />
      </div>
    );
  }

  return (
    <div className="edit-type-layout locations-layout">
      {isMobile && (
        <div className="edit-type-tabs">
          <button
            className={`edit-type-tab ${activeTab === 'map' ? 'active' : ''}`}
            onClick={() => setActiveTab('map')}
          >
            Локация
          </button>
          <button
            className={`edit-type-tab ${activeTab === 'preview' ? 'active' : ''}`}
            onClick={() => setActiveTab('preview')}
          >
            Превью
          </button>
        </div>
      )}

      {isMobile ? (
        activeTab === 'map' ? (
          leftBlock
        ) : (
          renderPreviewSection()
        )
      ) : (
        <>
          {leftBlock}
          {renderPreviewSection()}
        </>
      )}

      {/* если локаций ещё нет, даём кнопку скрыть форму */}
      {noLocations && isMobile === false && (
        <></>
      )}
    </div>
  );
};

export default Locations;
