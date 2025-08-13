import React from 'react';

import { LoaderWrapper, SpinnerIcon } from './styles';

const LoaderCentered = () => {
  return (
    <LoaderWrapper>
      <SpinnerIcon strokeWidth={1.4} role="status" aria-label="Загрузка" />
    </LoaderWrapper>
  );
};

export default LoaderCentered;
