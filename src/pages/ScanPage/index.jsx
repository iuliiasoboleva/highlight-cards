import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Html5Qrcode } from 'html5-qrcode';

import './styles.css';

const ScanPage = () => {
  const scannerRef = useRef(null);
  const isScannerRunning = useRef(false);
  const navigate = useNavigate();

  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('initializing');

  const handleScanSuccess = (decodedText) => {
    setMessage(`QR-код: ${decodedText}`);

    if (isScannerRunning.current && scannerRef.current) {
      scannerRef.current
        .stop()
        .then(() => (isScannerRunning.current = false))
        .catch(console.warn);
    }

    const user = findUserByQr(decodedText);
    if (user) {
      navigate(`/clients/${user.id}`);
    } else {
      setMessage('Пользователь не найден');
    }
  };

  const findUserByQr = (qrCode) => {
    const mockUsers = [
      { id: 1, qr: '123456' },
      { id: 2, qr: 'abcdef' },
    ];
    return mockUsers.find((u) => u.qr === qrCode);
  };

  useEffect(() => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const scanner = new Html5Qrcode('qr-reader', false);

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
        container.innerHTML = '';

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
        scanner.stop().catch(console.warn);
      }
    };
  }, []);

  return (
    <div className="scan-page">
      <header className="scan-header">
        <img src="/logoColored.png" alt="Logo" className="scan-logo" />
      </header>

      <main className="scan-main">
        <div className="scan-user">
          <p>Отсканируйте карту, чтобы найти пользователя</p>
        </div>

        {status === 'initializing' && (
          <div className="loader">
            <div className="spinner" />
            <p>🔄 Инициализация камеры...</p>
          </div>
        )}

        {status === 'error' && (
          <p className="scan-message">
            ⚠️ Ошибка при запуске камеры. Проверьте разрешения или перезагрузите страницу.
          </p>
        )}

        <div
          id="qr-reader"
          style={{
            width: '100%',
            maxWidth: '500px',
            aspectRatio: '1',
            margin: '0 auto',
            overflow: 'hidden',
            backgroundColor: '#000',
            borderRadius: '12px',
          }}
        />

        {status === 'scanning' && (
          <p className="scan-message">📷 Камера работает. Наведите на QR-код</p>
        )}

        {message && <p className="scan-message result">{message}</p>}
      </main>
    </div>
  );
};

export default ScanPage;
