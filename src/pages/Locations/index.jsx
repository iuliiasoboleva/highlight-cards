import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import CardInfo from '../../components/CardInfo';
import YandexMapPicker from '../../components/YandexMapPicker';
import './styles.css';

const MAX_LOCATIONS = 10;
const API_KEY = 'a886f296-c974-43b3-aa06-a94c782939c2';

const Locations = () => {
  const { id } = useParams();
  const [locations, setLocations] = useState([]);
  const [currentCoords, setCurrentCoords] = useState(null);
  const [currentAddress, setCurrentAddress] = useState('');
  const [limitReached, setLimitReached] = useState(false);

  const handleSelect = async ({ coords }) => {
    const { lat, lon } = coords;
    setCurrentCoords([lat, lon]);

    try {
      const res = await fetch(
        `https://geocode-maps.yandex.ru/1.x/?apikey=${API_KEY}&geocode=${lon},${lat}&format=json`
      );
      const data = await res.json();
      const address =
        data.response.GeoObjectCollection.featureMember[0]?.GeoObject?.metaDataProperty?.GeocoderMetaData?.text;

      if (address) {
        setCurrentAddress(address);
      } else {
        setCurrentAddress('Не удалось получить адрес');
      }
    } catch (error) {
      console.error('Ошибка при геокодировании:', error);
      setCurrentAddress('Не удалось получить адрес');
    }
  };

  const handleAddLocation = () => {
    if (!currentCoords || !currentAddress || locations.length >= MAX_LOCATIONS) return;

    const newLocation = {
      name: currentAddress,
      coords: currentCoords,
      active: true,
    };

    setLocations((prev) => [...prev, newLocation]);
    setCurrentCoords(null);
    setCurrentAddress('');
  };

  const toggleLocation = (index) => {
    const updated = [...locations];
    updated[index].active = !updated[index].active;
    setLocations(updated);
  };

  return (
    <div className="edit-type-main-container">
      <div className="edit-type-page">
        <h2 className="locations-title">
          Локации <span className="geo-badge">Geo-push в радиусе 100 метров</span>
        </h2>

        <p className="locations-subtext">
          На вашем тарифе <strong>доступно {MAX_LOCATIONS - locations.length} локаций</strong>.
        </p>

        {limitReached && (
          <div className="limit-alert">Вы достигли лимита в {MAX_LOCATIONS} локаций</div>
        )}

        <YandexMapPicker onSelect={handleSelect} />

        {currentAddress && (
          <div className="location-preview">
            <p><strong>Выбранный адрес:</strong> {currentAddress}</p>
            <button
              className="btn-dark"
              onClick={handleAddLocation}
              disabled={locations.length >= MAX_LOCATIONS}
            >
              Добавить локацию
            </button>
          </div>
        )}

        <div className="location-list">
          {locations.map((loc, index) => (
            <div key={index} className="location-card">
              <div className="location-info">
                <strong>{loc.name}</strong>
                <div className="location-coords">
                  {loc.coords[0].toFixed(5)}, {loc.coords[1].toFixed(5)}
                </div>
              </div>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={loc.active}
                  onChange={() => toggleLocation(index)}
                />
                <span className="slider round" />
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="type-card-image-container">
        <img className="card-image-add" src="/phone.svg" alt="preview" />
        <CardInfo card={{ id, title: 'Карта', name: 'Накопительная карта' }} />
      </div>
    </div>
  );
};

export default Locations;
