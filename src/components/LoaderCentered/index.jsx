import React from 'react';

import { LoaderWrapper, SpinnerIcon } from './styles';

const LoaderCentered = () => {
  return (
    <LoaderWrapper>
      <SpinnerIcon role="status" aria-label="Загрузка" />
    </LoaderWrapper>
  );
};

export default LoaderCentered;
