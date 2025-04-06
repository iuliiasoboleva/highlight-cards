import React, { useEffect, useState } from 'react';

import { mockDialogs, mockFilters } from '../../mocks/mockInbox';

import './styles.css';

const MailingsInbox = () => {
  const [selectedDialog, setSelectedDialog] = useState(null);
  const [isMobileView, setIsMobileView] = useState(false);
  const [showDialogView, setShowDialogView] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobileView(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleDialogClick = (dialog) => {
    setSelectedDialog(dialog);
    if (isMobileView) {
      setShowDialogView(true);
    }
  };

  const handleBackClick = () => {
    setShowDialogView(false);
    setSelectedDialog(null);
  };

  return (
    <div className="mailing-inbox-container">
      <aside className="mailing-inbox-sidebar">
        <div className="mailing-inbox-sidebar-header">
          <h3>Входящие</h3>
          <button className="mailing-inbox-search-btn">🔍</button>
        </div>
        <ul className="mailing-inbox-filter-list">
          {mockFilters.map((filter) => (
            <li key={filter.label} className="mailing-inbox-filter-item">
              <span className="mailing-inbox-filter-icon">{filter.icon}</span>
              {filter.label}
              <span className="mailing-inbox-filter-count">{filter.count}</span>
            </li>
          ))}
        </ul>
      </aside>

      {(!isMobileView || !showDialogView) && (
        <section className="mailing-inbox-dialogs-panel">
          <h3 className="mailing-inbox-panel-title">Ваши диалоги</h3>
          {mockDialogs.length === 0 ? (
            <div className="mailing-inbox-empty-state">
              💬<p>Нет диалогов</p>
            </div>
          ) : (
            <ul className="mailing-inbox-dialogs-list">
              {mockDialogs.map((dialog) => (
                <li
                  key={dialog.id}
                  className={`mailing-inbox-dialog-item ${selectedDialog?.id === dialog.id ? 'active' : ''}`}
                  onClick={() => handleDialogClick(dialog)}
                >
                  <strong>{dialog.sender}</strong>
                  <p className="mailing-inbox-msg">{dialog.message}</p>
                  <span className="mailing-inbox-time">{dialog.time}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {(!isMobileView || showDialogView) && (
        <section className="mailing-inbox-dialog-view">
          {isMobileView && (
            <button className="mailing-inbox-back-btn" onClick={handleBackClick}>
              ← Назад
            </button>
          )}
          {selectedDialog ? (
            <div>
              <h4>Диалог с {selectedDialog.sender}</h4>
              <p>{selectedDialog.message}</p>
            </div>
          ) : (
            <div className="mailing-inbox-empty-state">
              💬<p>Выберите диалог</p>
            </div>
          )}
        </section>
      )}

      {(selectedDialog || !isMobileView) && (
        <section className="mailing-inbox-dialog-details">
          {selectedDialog ? (
            <div>
              <h4>Детали</h4>
              <p>
                <b>Время:</b> {selectedDialog.time}
              </p>
              <p>
                <b>Теги:</b> {selectedDialog.tags.join(', ')}
              </p>
            </div>
          ) : (
            !isMobileView && (
              <div className="mailing-inbox-empty-state">
                💬<p>Нет деталей</p>
              </div>
            )
          )}
        </section>
      )}
    </div>
  );
};

export default MailingsInbox;
