import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

import CardInfo from '../../components/CardInfo';

const EditInfo = () => {
  const { id } = useParams();
  const [info, setInfo] = useState({
    name: '',
    description: '',
  });

  const handleSaveInfo = () => {
    console.log('Сохранение информации:', info);
  };

  return (
    <div className="edit-type-main-container">
      <div className="edit-type-page"></div>
      <div className="type-card-image-container">
        <img className="card-image-add" src="/phone.svg" alt="preview" />
        <CardInfo card={{ id, title: 'Карта', name: 'Накопительная карта' }} />
      </div>
    </div>
  );
};

export default EditInfo;
