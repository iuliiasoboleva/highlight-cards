import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import ImageEditorModal from '../../components/ImageEditorModal';
import LoaderCentered from '../../components/LoaderCentered';
import { logout as authLogout } from '../../store/authSlice';
import {
  changePin,
  deleteAccount,
  logout,
  removeAvatar,
  updateField,
  updateProfile,
  updateUserSettings,
  uploadAvatar,
} from '../../store/userSlice';
import AvatarBlock from './components/AvatarBlock';
import DeleteAccountSection from './components/DeleteAccountSection';
import ProfileForm from './components/ProfileForm';
import useLinearProgress from './hooks/useLinearProgress';
import usePinInput from './hooks/usePinInput';
import {
  ButtonProgress,
  MainButton,
  ProfileCard,
  ProfileEmail,
  ProfileForm as ProfileFormWrap,
  ProfileName,
  ProfileRightBlock,
  ProfileSection,
  Toast,
  Wrapper,
} from './styles';
import dataUrlToFile from './utils/dataUrlToFile';

const SettingsPersonal = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  // PIN-инпуты
  const {
    newPin,
    confirmPin,
    newPinRefs,
    confirmPinRefs,
    handlePinChange,
    handlePinKey,
    resetPins,
  } = usePinInput();

  // Тост + прогресс
  const [toast, setToast] = useState(null);
  const [pinSaving, setPinSaving] = useState(false);
  const showToast = useCallback((msg, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  }, []);
  const { saving, startProgress, finishProgress, progress, setSaving } = useLinearProgress();

  const [editorOpen, setEditorOpen] = useState(false);
  const [rawImageUrl, setRawImageUrl] = useState(null);
  const [lastCropSettings, setLastCropSettings] = useState(null);
  const [fileInputKey, setFileInputKey] = useState(Date.now());
  const revokeRef = useRef(null);

  useEffect(() => {
    return () => {
      if (revokeRef.current) URL.revokeObjectURL(revokeRef.current);
    };
  }, []);

  const openEditorWithFile = useCallback(
    (file) => {
      if (!file) return;
      if (!file.type?.startsWith('image/')) {
        showToast('Выберите файл изображения', false);
        return;
      }
      if (revokeRef.current) URL.revokeObjectURL(revokeRef.current);
      const url = URL.createObjectURL(file);
      revokeRef.current = url;
      setRawImageUrl(url);
      setEditorOpen(true);
      setFileInputKey(Date.now());
    },
    [showToast],
  );

  const onAvatarInput = useCallback(
    (e) => {
      const file = e.target.files?.[0];
      openEditorWithFile(file);
    },
    [openEditorWithFile],
  );

  const handleEditorSave = useCallback(
    async (croppedDataUrl) => {
      try {
        const file = await dataUrlToFile(croppedDataUrl, 'avatar.jpg');
        await dispatch(uploadAvatar(file)).unwrap();
        showToast('Фото обновлено', true);
      } catch {
        showToast('Не удалось загрузить фото', false);
      } finally {
        setEditorOpen(false);
        if (revokeRef.current) {
          URL.revokeObjectURL(revokeRef.current);
          revokeRef.current = null;
        }
        setRawImageUrl(null);
      }
    },
    [dispatch, showToast],
  );

  const handleEditorStateChange = useCallback((settings) => {
    setLastCropSettings(settings);
  }, []);

  const closeEditor = useCallback(() => {
    setEditorOpen(false);
  }, []);

  const removeAvatarAction = useCallback(async () => {
    try {
      await dispatch(removeAvatar());
      showToast('Фото удалено', true);
    } catch {
      showToast('Не удалось удалить фото', false);
    }
  }, [dispatch, showToast]);

  const handleChange = useCallback(
    (field, value) => {
      dispatch(updateField({ field, value }));
    },
    [dispatch],
  );

  const countries = useMemo(() => [{ value: 'Russia', label: 'Россия' }], []);
  const languages = useMemo(() => [{ value: 'Russian', label: 'Русский' }], []);
  const timezones = useMemo(
    () => [{ value: '(UTC+03:00) Moscow', label: '(UTC+03:00) Москва' }],
    [],
  );

  const handleSavePin = async () => {
    if (!newPin || newPin.length !== 4 || newPin !== confirmPin) {
      showToast('PIN-коды не совпадают', false);
      return;
    }

    try {
      setPinSaving(true);
      await dispatch(changePin(newPin)).unwrap();
      resetPins();
      showToast('Изменения сохранены', true);
    } catch {
      showToast('Не удалось сохранить PIN', false);
    } finally {
      setPinSaving(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    startProgress();
    try {
      await dispatch(
        updateProfile({
          name: user.firstName,
          surname: user.lastName,
          phone: user.phone,
          extra_contacts: user.contact,
        }),
      ).unwrap();

      await dispatch(
        updateUserSettings({
          date_format: user.dateFormat,
          country: user.country,
          language: user.language,
          timezone: user.timezone,
          extra_contacts: user.contact,
          avatar_url: user.avatar,
        }),
      ).unwrap();

      showToast('Настройки сохранены', true);
    } catch (err) {
      showToast(typeof err === 'string' ? err : 'Ошибка сохранения', false);
    } finally {
      setSaving(false);
      finishProgress();
    }
  };

  const handleDeleteAccount = async (payload) => {
    try {
      await dispatch(deleteAccount(payload)).unwrap();
      showToast('Аккаунт удалён', true);
      setTimeout(() => {
        dispatch(logout());
        dispatch(authLogout());
        window.location.href = '/auth';
      }, 1200);
    } catch (err) {
      showToast(typeof err === 'string' ? err : 'Ошибка удаления', false);
    }
  };

  if (user.isLoading) return <LoaderCentered />;

  return (
    <>
      <Wrapper>
        <h2>Персональные настройки</h2>

        <form onSubmit={handleSubmit}>
          <ProfileSection>
            <ProfileCard>
              <AvatarBlock
                user={user}
                fileInputKey={fileInputKey}
                onAvatarInput={onAvatarInput}
                removeAvatarAction={removeAvatarAction}
              />
              <ProfileName>
                {user.firstName} {user.lastName}
              </ProfileName>
              <ProfileEmail>{user.email}</ProfileEmail>
            </ProfileCard>

            <ProfileRightBlock>
              <ProfileFormWrap>
                <ProfileForm
                  user={user}
                  countries={countries}
                  languages={languages}
                  timezones={timezones}
                  onFieldChange={handleChange}
                  newPin={newPin}
                  confirmPin={confirmPin}
                  newPinRefs={newPinRefs}
                  confirmPinRefs={confirmPinRefs}
                  onPinChange={handlePinChange}
                  onPinKey={handlePinKey}
                  onSavePin={handleSavePin}
                  pinSaving={pinSaving}
                />

                <MainButton type="submit" disabled={saving}>
                  <span style={{ opacity: saving ? 0 : 1 }}>Сохранить изменения</span>
                  {saving && <ButtonProgress style={{ width: `${progress}%` }} />}
                </MainButton>
              </ProfileFormWrap>

              <DeleteAccountSection onSubmit={handleDeleteAccount} />
            </ProfileRightBlock>
          </ProfileSection>
        </form>

        {toast && <Toast ok={toast.ok}>{toast.msg}</Toast>}
      </Wrapper>

      <ImageEditorModal
        open={editorOpen}
        image={rawImageUrl}
        onClose={closeEditor}
        onSave={handleEditorSave}
        initialState={lastCropSettings || {}}
        onStateChange={handleEditorStateChange}
      />
    </>
  );
};

export default SettingsPersonal;
