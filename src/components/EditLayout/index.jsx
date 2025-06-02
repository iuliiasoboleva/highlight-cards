import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import CardInfo from '../../components/CardInfo';
import { updateCurrentCardField } from '../../store/cardsSlice';
import { statusConfig } from '../../utils/statusConfig';

import './styles.css';

const EditLayout = ({ children }) => {
  const dispatch = useDispatch();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  const [activeTab, setActiveTab] = useState('description');

  const currentCard = useSelector((state) => state.cards.currentCard);

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
            <div className="phone-frame">
              <img className="phone-image" src={currentCard.frameUrl} alt={currentCard.name} />
              <div className="phone-screen">
                <CardInfo card={currentCard} />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default EditLayout;
