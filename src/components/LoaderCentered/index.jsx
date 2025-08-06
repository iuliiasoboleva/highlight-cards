import React from 'react';

import { Loader2 } from 'lucide-react';

import { LoaderWrapper } from './styles';

const LoaderCentered = () => {
  return (
    <LoaderWrapper>
      <Loader2 className="spinner" size={48} strokeWidth={1.4} />
    </LoaderWrapper>
  );
};

export default LoaderCentered;
