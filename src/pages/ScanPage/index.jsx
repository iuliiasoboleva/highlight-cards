import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Html5Qrcode } from 'html5-qrcode';

import {
  Header,
  Loader,
  Main,
  Message,
  Page,
  QrReaderBox,
  UserText,
} from './styles';

const isProbablyMobile = () => {
  const ua = navigator.userAgent || '';
  const uaMobile = /Android|iPhone|iPad|iPod|Windows Phone|Mobile/i.test(ua);
  const coarse =
    typeof window !== 'undefined' && window.matchMedia
      ? window.matchMedia('(pointer: coarse)').matches
      : false;
  return uaMobile || coarse;
};

const ScanPage = () => {
  const scannerRef = useRef(null);
  const isScannerRunning = useRef(false);
  const navigate = useNavigate();

  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('initializing'); // initializing | scanning | error | desktop

  const handleScanSuccess = (decodedText) => {
    const cardNumber = decodedText.trim();
    setMessage(`Найдена карта: ${cardNumber}`);

    if (isScannerRunning.current && scannerRef.current) {
      scannerRef.current
        .stop()
        .then(() => (isScannerRunning.current = false))
        .catch(console.warn);
    }

    navigate(`/customer/card/${cardNumber}`);
  };

  useEffect(() => {
    const mobile = isProbablyMobile();
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

    const scanner = new Html5Qrcode('qr-reader', false);
    scannerRef.current = scanner;

    const config = {
      fps: 10,
      qrbox: mobile ? { width: 250, height: 250 } : { width: 300, height: 300 },
      aspectRatio: 1.0,
      disableFlip: true,
      experimentalFeatures: {
        useBarCodeDetectorIfSupported: false,
      },
    };

    const startScanner = async () => {
      try {
        const container = document.getElementById('qr-reader');
        if (container) container.innerHTML = '';

        const constraints = mobile 
          ? { facingMode: 'environment' }
          : { facingMode: 'user' };

        await scanner.start(constraints, config, handleScanSuccess, (err) => {
          if (err !== 'QR code parse error, ignoring...') {
            console.warn('Ошибка сканирования:', err);
          }
        });

        isScannerRunning.current = true;
        setStatus('scanning');

        if (isIOS) {
          setTimeout(() => {
            const buttons = document.querySelectorAll('#qr-reader button');
            buttons.forEach((btn) => (btn.style.display = 'none'));
          }, 1000);
        }
      } catch (err) {
        console.error('Ошибка запуска сканера:', err);
        setStatus('error');
      }
    };

    startScanner();

    return () => {
      if (isScannerRunning.current && scannerRef.current) {
        scannerRef.current
          .stop()
          .then(() => (isScannerRunning.current = false))
          .catch(console.warn);
      }
    };
  }, [navigate]);

  return (
    <Page>
      <Header />

      <Main>
        <UserText>
          <p>Отсканируйте QR-код с карты клиента</p>
        </UserText>

        {status === 'initializing' && (
          <Loader>
            <div className="spinner" />
            <p>🔄 Инициализация камеры...</p>
          </Loader>
        )}

        {status === 'error' && (
          <Message>
            ⚠️ Ошибка при запуске камеры. Разрешите доступ к камере в настройках браузера.
          </Message>
        )}

        <QrReaderBox />

        {status === 'scanning' && <Message>📷 Наведите камеру на QR-код карты</Message>}

        {message && <Message className="result">{message}</Message>}
      </Main>
    </Page>
  );
};

export default ScanPage;
