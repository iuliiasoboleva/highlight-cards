import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useDebounce } from 'use-debounce';

import CustomSelect from '../../components/CustomSelect';
import PushPreview from '../../components/PushPreview';
import YandexMapPicker from '../../components/YandexMapPicker';
import { updateCurrentCard } from '../../store/cardsSlice';

import './styles.css';

const MAX_LOCATIONS = 10;

const Locations = () => {
  const mapRef = useRef(null);
  const dispatch = useDispatch();

  const currentCard = useSelector((state) => state.cards.currentCard);
  const allCards = useSelector((state) => state.cards.cards);
  const cards = allCards.filter((card) => card.id !== 'fixed');

  const [locations, setLocations] = useState([]);

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
    const selected = cards.find((c) => c.id === cardId);
    if (selected) {
      dispatch(
        updateCurrentCard({
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
    if (currentCard.pushNotification?.locations) {
      setLocations(currentCard.pushNotification.locations);
    }
  }, [currentCard]);

  const handleMapSelect = (location) => {
    setSelectedLocation(location);
  };

  const toggleLocation = (index) => {
    const updated = locations.map((loc, i) =>
      i === index ? { ...loc, active: !loc.active } : loc,
    );

    setLocations(updated);

    dispatch(
      updateCurrentCard({
        ...currentCard,
        pushNotification: {
          ...currentCard.pushNotification,
          locations: updated,
        },
      }),
    );
  };

  const handleAddLocation = () => {
    const remaining = MAX_LOCATIONS - locations.length;
    if (remaining <= 0) {
      setLimitReached(true);
      return;
    }

    const newLocations = organizationResults.slice(0, remaining).map((org) => ({
      id: crypto.randomUUID(),
      name: org.name,
      coords: [org.coords[0], org.coords[1]],
      active: true,
      message: '',
    }));

    const updatedLocations = [...locations, ...newLocations];
    setLocations(updatedLocations);

    dispatch(
      updateCurrentCard({
        ...currentCard,
        pushNotification: {
          ...currentCard.pushNotification,
          locations: updatedLocations,
        },
      }),
    );

    // Очистим результаты
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

  const removeLocation = (indexToRemove) => {
    const updated = locations.filter((_, index) => index !== indexToRemove);
    setLocations(updated);
    setLimitReached(false);

    dispatch(
      updateCurrentCard({
        ...currentCard,
        pushNotification: {
          ...currentCard.pushNotification,
          locations: updated,
        },
      }),
    );
  };

  const renderMapSection = () => (
    <div className="edit-type-page">
      <h2 className="locations-title">
        Локации <span className="geo-badge">Geo-push в радиусе 100 метров</span>
      </h2>

      <p className="locations-subtext">
        Добавьте адреса, рядом с которыми вашим клиентам будут автоматически приходить
        push-уведомления. Geo-push работает, когда клиент оказывается в радиусе 100 метров от вашей
        точки.
      </p>
      <CustomSelect
        value={currentCard?.id || null}
        onChange={handleCardSelect}
        options={cards.map((card) => ({
          value: card.id,
          label: card.title,
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
          onSelect={handleMapSelect}
          initialCoords={selectedLocation?.coords}
        />
      </div>

      <textarea
        className="push-textarea"
        value={pushMessage}
        onChange={(e) => setPushMessage(e.target.value)}
        placeholder="Введите текст push-уведомления"
      />

      <button className="btn btn-dark" onClick={handleAddLocation} disabled={!pushMessage.trim()}>
        Добавить
      </button>
      <div className="location-list">
        {locations.map((loc, index) => (
          <div key={loc.id} className="location-card">
            <div className="location-info">
              <strong>{loc.name}</strong>
              <div className="location-coords">
                {loc.coords[0].toFixed(5)}, {loc.coords[1].toFixed(5)}
              </div>
            </div>
            <div className="location-actions">
              <label className="switch">
                <input
                  type="checkbox"
                  checked={loc.active}
                  onChange={() => toggleLocation(index)}
                />
                <span className="slider round" />
              </label>
              <button
                className="delete-location-btn"
                onClick={() => removeLocation(index)}
                title="Удалить"
              >
                🗑
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPreviewSection = () => (
    <div className="type-card-image-container">
      <img className="card-image-add" src="/phone.svg" alt="preview" />
      <PushPreview card={currentCard} message={pushMessage} />
    </div>
  );

  return (
    <div className="edit-type-main-container">
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
          renderMapSection()
        ) : (
          renderPreviewSection()
        )
      ) : (
        <>
          {renderMapSection()}
          {renderPreviewSection()}
        </>
      )}
    </div>
  );
};

export default Locations;
