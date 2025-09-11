import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Html5Qrcode } from 'html5-qrcode';

import {
  Arrow,
  BackBtn,
  DesktopNotice,
  Header,
  Loader,
  Logo,
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
    setMessage(`Найден QR-код: ${decodedText}`);

    if (isScannerRunning.current && scannerRef.current) {
      scannerRef.current
        .stop()
        .then(() => (isScannerRunning.current = false))
        .catch(console.warn);
    }

    // В демонстрационных целях перенаправляем всегда на /customers/10
    // В реальном приложении здесь будет поиск пользователя по QR
    navigate('/customer/10');

    // Пример реальной реализации:
    // const user = findUserByQr(decodedText);
    // if (user) {
    //   navigate(`/customers/${user.id}`);
    // } else {
    //   setMessage('Пользователь не найден');
    // }
  };

  const findUserByQr = (qrCode) => {
    const mockUsers = [
      { id: 1, qr: '123456' },
      { id: 2, qr: 'abcdef' },
    ];
    return mockUsers.find((u) => u.qr === qrCode);
  };

  useEffect(() => {
    const mobile = isProbablyMobile();

    if (!mobile) {
      setStatus('desktop');
      return;
    }

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

    const scanner = new Html5Qrcode('qr-reader', false);
    scannerRef.current = scanner;

    const config = {
      fps: 10,
      qrbox: { width: 250, height: 250 },
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

        await scanner.start({ facingMode: 'environment' }, config, handleScanSuccess, (err) => {
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
          <p>Отсканируйте карту, чтобы найти пользователя</p>
        </UserText>

        {status === 'initializing' && (
          <Loader>
            <div className="spinner" />
            <p>🔄 Инициализация камеры...</p>
          </Loader>
        )}

        {status === 'error' && (
          <Message>
            ⚠️ Ошибка при запуске камеры. Проверьте разрешения или перезагрузите страницу.
          </Message>
        )}

        {status === 'desktop' ? (
          <DesktopNotice>
            Сканер предназначен для использования на мобильном устройстве (смартфоне/планшете).
          </DesktopNotice>
        ) : (
          <QrReaderBox />
        )}

        {status === 'scanning' && <Message>📷 Камера работает. Наведите на QR-код</Message>}

        {message && <Message className="result">{message}</Message>}
      </Main>
    </Page>
  );
};

export default ScanPage;
