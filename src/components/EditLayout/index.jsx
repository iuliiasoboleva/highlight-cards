import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import CardInfoAndroid from '../../components/CardInfoAndroid';
import { updateCurrentCardField } from '../../store/cardsSlice';
import { statusConfig } from '../../utils/statusConfig';
import CardInfo from '../CardInfo';
import InfoOverlay from '../InfoOverlay';
import PushPreview from '../PushPreview';

import './styles.css';

const EditLayout = ({ children, onFieldClick }) => {
  const dispatch = useDispatch();
  const location = useLocation();

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  const [activeTab, setActiveTab] = useState('description');
  const [showInfo, setShowInfo] = useState(false);
  const [platform, setPlatform] = useState('ios'); // 'ios' | 'android' | 'chat'

  const currentCard = useSelector((state) => state.cards.currentCard);

  const isDesignStep = location.pathname.includes('/edit/design');

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (currentCard.status) {
      const defaultFields = (statusConfig[currentCard.status] || []).map((item) => ({
        type: item.valueKey,
        name: item.label,
      }));

      dispatch(
        updateCurrentCardField({
          path: 'fieldsName',
          value: defaultFields,
        }),
      );
    }
  }, [currentCard.status, dispatch]);

  const handleToggleActive = () => {
    dispatch(
      updateCurrentCardField({
        path: 'isActive',
        value: !currentCard.isActive,
      }),
    );
  };

  useEffect(() => {
    if (location.pathname.includes('/edit/info')) {
      setShowInfo(true);
    } else {
      setShowInfo(false);
    }
  }, [location.pathname]);

  return (
    <>
      {isMobile && (
        <div className="edit-type-tabs">
          <button
            className={`edit-type-tab ${activeTab === 'description' ? 'active' : ''}`}
            onClick={() => setActiveTab('description')}
          >
            Описание
          </button>
          <button
            className={`edit-type-tab ${activeTab === 'card' ? 'active' : ''}`}
            onClick={() => setActiveTab('card')}
          >
            Карта
          </button>
        </div>
      )}

      <div className="edit-type-layout">
        {(!isMobile || activeTab === 'description') && (
          <div className="edit-type-left">
            <div className="edit-type-page">{children}</div>
          </div>
        )}
        {(!isMobile || activeTab === 'card') && (
          <div className="edit-type-right">
            <div className="phone-container">
              <div>
                <div className="phone-sticky">
                  <div className="card-state">
                    <span
                      className={`status-indicator ${currentCard.isActive ? 'active' : 'inactive'}`}
                    />
                    {currentCard.isActive ? 'Активна' : 'Не активна'}
                  </div>
                  <div className="phone-frame">
                    <img
                      className="phone-image"
                      src={platform === 'android' ? '/frame-android.svg' : currentCard.frameUrl}
                      alt={currentCard.name}
                    />
                    <div className="phone-screen">
                      {platform === 'ios' && (
                        <CardInfo
                          card={currentCard}
                          showInfo={showInfo}
                          setShowInfo={setShowInfo}
                          onFieldClick={onFieldClick}
                        />
                      )}
                      {platform === 'android' && (
                        <CardInfoAndroid
                          card={currentCard}
                          showInfo={showInfo}
                          setShowInfo={setShowInfo}
                          onFieldClick={onFieldClick}
                        />
                      )}
                      {platform === 'chat' && (
                        <PushPreview
                          card={currentCard}
                          message={
                            currentCard.pushNotification?.message ||
                            `Новое уведомление по вашей карте "${currentCard.title}"`
                          }
                        />
                      )}
                      {showInfo && (
                        <InfoOverlay
                          infoFields={
                            isDesignStep
                              ? {
                                  stampsQuantity: currentCard.design?.stampsQuantity,
                                  activeStamp: currentCard.design?.activeStamp,
                                  inactiveStamp: currentCard.design?.inactiveStamp,
                                  logo: currentCard.design?.logo,
                                  icon: currentCard.design?.icon,
                                  stampBackground: currentCard.design?.stampBackground,
                                }
                              : currentCard.infoFields
                          }
                          onClose={() => setShowInfo(false)}
                          onFieldClick={onFieldClick}
                        />
                      )}
                    </div>
                  </div>
                </div>

                <button className="activate-button" onClick={handleToggleActive}>
                  Активировать
                </button>
                {/* <p className="activate-text">
                Пока карта не активирована, вы можете выдать до 10 карт клиентам{' '}
              </p> */}
              </div>
              <div className="platform-icons">
                <button
                  className={`platform-button ios ${platform === 'ios' ? 'active' : ''}`}
                  onClick={() => setPlatform('ios')}
                >
                  <img src="/icons/apple-icon.svg" alt="iOS" />
                </button>
                <button
                  className={`platform-button android ${platform === 'android' ? 'active' : ''}`}
                  onClick={() => setPlatform('android')}
                >
                  <img src="/icons/android-icon.svg" alt="Android" />
                </button>
                <button
                  className={`platform-button chat ${platform === 'chat' ? 'active' : ''}`}
                  onClick={() => setPlatform('chat')}
                >
                  <img src="/icons/chat-icon.svg" alt="Chat" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default EditLayout;
