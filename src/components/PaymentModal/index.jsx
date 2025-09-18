import React, { useEffect, useRef } from 'react';

import CustomModal from '../../customs/CustomModal';

const loadYooScript = () =>
  new Promise((resolve, reject) => {
    if (document.getElementById('yookassa-checkout-js')) return resolve();
    const s = document.createElement('script');
    s.src = 'https://yookassa.ru/checkout-widget/v1/checkout-widget.js';
    s.async = true;
    s.id = 'yookassa-checkout-js';
    s.onload = () => resolve();
    s.onerror = reject;
    document.body.appendChild(s);
  });

const PaymentModal = ({ open, onClose, confirmationToken }) => {
  const containerRef = useRef(null);
  const widgetRef = useRef(null);

  useEffect(() => {
    if (!open || !confirmationToken) return;

    let cancelled = false;

    loadYooScript()
      .then(() => {
        if (cancelled) return;
        // eslint-disable-next-line no-undef
        widgetRef.current = new window.YooMoneyCheckoutWidget({
          confirmation_token: confirmationToken,
          return_url: window.location.href,
          error_callback: (error) => {
            console.error('YooKassa widget error', error);
          },
        });
        const id = 'yookassa-widget-container';
        if (containerRef.current && !containerRef.current.id) {
          containerRef.current.id = id;
        }
        setTimeout(() => {
          try {
            widgetRef.current.render(containerRef.current?.id || id);
          } catch (e) {
            console.error('Widget render error', e);
          }
        }, 0);
      })
      .catch((e) => console.error('Failed to load YooKassa widget', e));

    return () => {
      cancelled = true;
      try {
        widgetRef.current?.destroy();
        widgetRef.current = null;
      } catch (_) {}
    };
  }, [open, confirmationToken]);

  return (
    <CustomModal
      open={open}
      onClose={onClose}
      title="Оплата"
      maxWidth={860}
      actions={
        <>
          <CustomModal.SecondaryButton onClick={onClose}>Закрыть</CustomModal.SecondaryButton>
        </>
      }
    >
      <div style={{ height: 640 }}>
        <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
      </div>
    </CustomModal>
  );
};

export default PaymentModal;
