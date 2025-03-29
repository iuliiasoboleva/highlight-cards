import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { useNavigate } from 'react-router-dom';
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
        .then(() => {
          isScannerRunning.current = false;
          return scannerRef.current.clear();
        })
        .catch((err) => {
          console.warn('Ошибка при остановке сканера:', err);
        });
    }

    const user = findUserByQr(decodedText);
    if (user) {
      navigate(`/users/${user.id}`);
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
    const scanner = new Html5Qrcode('qr-reader');
    scannerRef.current = scanner;

    Html5Qrcode.getCameras()
      .then((devices) => {
        if (devices && devices.length) {
          const backCamera =
            devices.find((d) =>
              d.label.toLowerCase().includes('back') ||
              d.label.toLowerCase().includes('rear')
            ) || devices[0];

          const cameraId = backCamera.id;

          scanner
            .start(
              cameraId,
              { fps: 10, qrbox: 300 },
              handleScanSuccess,
              (errorMessage) => {
                console.log('Ошибка сканирования:', errorMessage);
              }
            )
            .then(() => {
              isScannerRunning.current = true;
              setStatus('scanning');
            })
            .catch((err) => {
              console.error('Ошибка при запуске сканера:', err);
              setStatus('error');
            });
        } else {
          setStatus('no-camera');
        }
      })
      .catch((err) => {
        console.error('Ошибка получения камер:', err);
        setStatus('error');
      });

    return () => {
      if (isScannerRunning.current && scannerRef.current) {
        scannerRef.current
          .stop()
          .then(() => {
            isScannerRunning.current = false;
            return scannerRef.current.clear();
          })
          .catch((err) => {
            console.warn('Ошибка при остановке сканера:', err);
          });
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

        {status === 'no-camera' && (
          <p className="scan-message">❌ Камера не найдена. Попробуйте с телефона или подключите веб-камеру.</p>
        )}

        {status === 'error' && (
          <p className="scan-message">⚠️ Ошибка при запуске камеры. Проверьте разрешения или перезагрузите страницу.</p>
        )}

        <div id="qr-reader" className="qr-reader" />

        {status === 'scanning' && (
          <p className="scan-message">📷 Камера работает. Наведите карту с QR-кодом.</p>
        )}

        {message && <p className="scan-message result">{message}</p>}
      </main>
    </div>
  );
};

export default ScanPage;
