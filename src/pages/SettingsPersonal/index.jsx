import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import ImageEditorModal from '../../components/ImageEditorModal';
import LoaderCentered from '../../components/LoaderCentered';
import { useToast } from '../../components/Toast';
import { logout as authLogout } from '../../store/authSlice';
import {
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
import {
  ButtonProgress,
  MainButton,
  ProfileCard,
  ProfileEmail,
  ProfileForm as ProfileFormWrap,
  ProfileRightBlock,
  ProfileSection,
  Wrapper,
} from './styles';
import dataUrlToFile from './utils/dataUrlToFile';

const SettingsPersonal = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const toast = useToast();
  const navigate = useNavigate();

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

  const showToast = useCallback(
    (msg, ok = true) => (ok ? toast.success(msg) : toast.error(msg)),
    [toast],
  );

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
        toast.success('Фото обновлено');
      } catch {
        toast.error('Не удалось загрузить фото');
      } finally {
        setEditorOpen(false);
        if (revokeRef.current) {
          URL.revokeObjectURL(revokeRef.current);
          revokeRef.current = null;
        }
        setRawImageUrl(null);
      }
    },
    [dispatch, toast],
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
      toast.success('Фото удалено');
    } catch {
      toast.error('Не удалось удалить фото');
    }
  }, [dispatch, toast]);

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

      toast.success('Настройки сохранены');
    } catch (err) {
      toast.error(typeof err === 'string' ? err : 'Ошибка сохранения');
    } finally {
      setSaving(false);
      finishProgress();
    }
  };

  const handleDeleteAccount = async (payload) => {
    try {
      await dispatch(deleteAccount(payload)).unwrap();
      toast.success('Аккаунт удалён');
      setTimeout(() => {
        dispatch(logout());
        dispatch(authLogout());
        navigate('/auth');
      }, 1200);
    } catch (err) {
      toast.error(typeof err === 'string' ? err : 'Ошибка удаления');
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
              <h3>
                {user.firstName} {user.lastName}
              </h3>
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
                  showToast={(m, ok = true) => showToast(m, ok)}
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
