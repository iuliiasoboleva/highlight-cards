import React, { useEffect, useRef, useCallback } from 'react';

import CustomModal from '../../customs/CustomModal';

const loadCloudPaymentsScript = () =>
  new Promise((resolve, reject) => {
    if (document.getElementById('cloudpayments-widget-js')) return resolve();
    const s = document.createElement('script');
    s.src = 'https://widget.cloudpayments.ru/bundles/cloudpayments.js';
    s.async = true;
    s.id = 'cloudpayments-widget-js';
    s.onload = () => resolve();
    s.onerror = reject;
    document.body.appendChild(s);
  });

const PaymentModal = ({ 
  open, 
  onClose, 
  widgetConfig,
  onSuccess,
  onFail 
}) => {
  const widgetOpenedRef = useRef(false);

  const openWidget = useCallback(() => {
    if (!widgetConfig || widgetOpenedRef.current) return;
    
    widgetOpenedRef.current = true;
    
    const widget = new window.cp.CloudPayments();
    
    widget.pay('charge', {
      publicId: widgetConfig.publicId,
      description: widgetConfig.description,
      amount: widgetConfig.amount,
      currency: widgetConfig.currency || 'RUB',
      accountId: widgetConfig.accountId,
      invoiceId: widgetConfig.invoiceId,
      email: widgetConfig.email,
      skin: widgetConfig.skin || 'mini',
      data: widgetConfig.data,
      requireEmail: false,
      autoClose: 3,
    }, {
      onSuccess: (options) => {
        widgetOpenedRef.current = false;
        if (onSuccess) onSuccess(options);
        onClose();
      },
      onFail: (reason, options) => {
        widgetOpenedRef.current = false;
        if (onFail) onFail(reason, options);
      },
      onComplete: (paymentResult, options) => {
        widgetOpenedRef.current = false;
        if (paymentResult.success && onSuccess) {
          onSuccess(options);
        }
      }
    });
  }, [widgetConfig, onSuccess, onFail, onClose]);

  useEffect(() => {
    if (!open || !widgetConfig) return;

    loadCloudPaymentsScript()
      .then(() => {
        openWidget();
      })
      .catch((e) => console.error('Failed to load CloudPayments widget', e));

    return () => {
      widgetOpenedRef.current = false;
    };
  }, [open, widgetConfig, openWidget]);

  useEffect(() => {
    if (!open) {
      widgetOpenedRef.current = false;
    }
  }, [open]);

  return (
    <CustomModal
      open={open}
      onClose={onClose}
      title="Оплата"
      maxWidth={500}
      actions={
        <>
          <CustomModal.SecondaryButton onClick={onClose}>Закрыть</CustomModal.SecondaryButton>
          {widgetConfig && (
            <CustomModal.PrimaryButton onClick={openWidget}>
              Открыть форму оплаты
            </CustomModal.PrimaryButton>
          )}
        </>
      }
    >
      <div style={{ 
        padding: '20px', 
        textAlign: 'center',
        minHeight: 100,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16
      }}>
        {widgetConfig ? (
          <>
            <p style={{ margin: 0, fontSize: 16 }}>
              Сумма к оплате: <strong>{widgetConfig.amount?.toLocaleString('ru-RU')} ₽</strong>
            </p>
            <p style={{ margin: 0, fontSize: 14, color: '#666' }}>
              {widgetConfig.description}
            </p>
            <p style={{ margin: '10px 0 0', fontSize: 13, color: '#888' }}>
              Нажмите кнопку ниже, чтобы открыть форму оплаты
            </p>
          </>
        ) : (
          <p>Загрузка...</p>
        )}
      </div>
    </CustomModal>
  );
};

export default PaymentModal;
