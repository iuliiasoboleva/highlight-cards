import { useLayoutEffect, useState } from 'react';

const RELOAD_KEY = 'loyalclub_edit_reload';

const EditGuard = ({ children }) => {
  const isReload = sessionStorage.getItem(RELOAD_KEY) === 'true';
  const [shouldRender, setShouldRender] = useState(!isReload);

  useLayoutEffect(() => {
    if (isReload) {
      sessionStorage.removeItem(RELOAD_KEY);
      window.location.replace('/cards');
      return;
    }

    const handleBeforeUnload = (e) => {
      sessionStorage.setItem(RELOAD_KEY, 'true');
      e.preventDefault();
      e.returnValue = '';
      return '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isReload]);

  if (!shouldRender) {
    return null;
  }

  return children;
};

export default EditGuard;

