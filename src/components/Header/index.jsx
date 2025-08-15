import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import { GraduationCap, LogOut, User as UserIcon } from 'lucide-react';

import { pluralize } from '../../helpers/pluralize';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { logout as authLogout } from '../../store/authSlice';
import { fetchSubscription } from '../../store/subscriptionSlice';
import { logout as userLogout } from '../../store/userSlice';
import {
  AvatarCircle,
  DemoBadge,
  DesktopHeader,
  HeaderBar,
  HeaderIcons,
  HelpBlock,
  Logo,
  LogoBlock,
  LogoutBlock,
  MobileItem,
  MobileMenu,
  MobileOnly,
  MobileSheet,
  UserName,
  UserSection,
} from './styles';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery('(max-width: 999px)');
  const avatarRef = useRef(null);
  const menuRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const user = useSelector((state) => state.user);
  const subscription = useSelector((state) => state.subscription.info);
  const subLoading = useSelector((state) => state.subscription.loading);

  useEffect(() => {
    if (!menuOpen) return;

    const handleDocPointer = (e) => {
      const t = e.target;
      if (!menuRef.current || !avatarRef.current) return;
      if (menuRef.current.contains(t)) return;
      if (avatarRef.current.contains(t)) return;
      setMenuOpen(false);
    };

    const handleEsc = (e) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };

    document.addEventListener('mousedown', handleDocPointer);
    document.addEventListener('touchstart', handleDocPointer, { passive: true });
    document.addEventListener('keydown', handleEsc);

    return () => {
      document.removeEventListener('mousedown', handleDocPointer);
      document.removeEventListener('touchstart', handleDocPointer);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [menuOpen]);

  const handleAvatarClick = useCallback(() => {
    if (isMobile) {
      setMenuOpen((v) => !v);
    } else {
      navigate('/profile');
    }
  }, [isMobile, navigate]);

  const handleAvatarKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleAvatarClick();
      }
    },
    [handleAvatarClick],
  );

  useEffect(() => {
    if (!user?.organization_id || subLoading || subscription) return;
    dispatch(fetchSubscription(user.organization_id));
  }, [dispatch, user?.organization_id, subLoading, subscription]);

  const d = Math.max(0, Number(subscription?.days_left ?? 0));
  const isTrial = String(subscription?.status || '').toLowerCase() === 'trial';
  const dayWord = pluralize(d, ['день', 'дня', 'дней']);

  const initials = useMemo(() => {
    const f = (user?.firstName || user?.name || '').trim();
    const l = (user?.lastName || '').trim();
    return `${f[0] || ''}${l[0] || ''}`.toUpperCase();
  }, [user?.firstName, user?.lastName, user?.name]);

  const userName = (user?.firstName || user?.name || '').trim();

  const handleLogout = useCallback(() => {
    dispatch(userLogout());
    dispatch(authLogout());
    navigate('/auth');
  }, [dispatch, navigate]);

  // Закрывать при смене маршрута
  useEffect(() => {
    if (menuOpen) setMenuOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  useEffect(() => {
    if (menuOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [menuOpen]);

  const go = (to) => () => {
    navigate(to);
    setMenuOpen(false);
  };

  return (
    <>
      <HeaderBar>
        <DesktopHeader>
          <LogoBlock>
            <Logo src="/logoColored.png" alt="Logo" onClick={() => navigate('/')} />
            {isMobile ? (
              <DemoBadge>
                {userName && `Привет, ${user?.firstName || user?.lastName}!`}
                {isTrial && (
                  <span
                    onClick={() => navigate('/settings')}
                    role="button"
                    aria-label={`Осталось ${d} ${dayWord}`}
                  >
                    Демо: {d} {dayWord}
                  </span>
                )}
              </DemoBadge>
            ) : (
              isTrial && (
                <DemoBadge
                  onClick={() => navigate('/settings')}
                  role="button"
                  aria-label={`Осталось ${d} ${dayWord}`}
                >
                  Демо-версия доступна
                  <span>
                    ещё: {d} {dayWord}
                  </span>
                </DemoBadge>
              )
            )}
          </LogoBlock>

          <HeaderIcons>
            <HelpBlock onClick={() => navigate('/education')} aria-label="База знаний">
              <GraduationCap size={22} strokeWidth={1.3} />
              <p>База знаний</p>
            </HelpBlock>

            {userName && (
              <>
                <UserSection
                  onClick={handleAvatarClick}
                  onKeyDown={handleAvatarKeyDown}
                  aria-haspopup={isMobile ? 'menu' : undefined}
                  aria-expanded={isMobile ? menuOpen : undefined}
                  ref={avatarRef}
                >
                  <AvatarCircle>
                    {user?.avatar ? <img src={user.avatar} alt="Avatar" /> : <>{initials}</>}
                  </AvatarCircle>
                  <UserName>
                    {user?.firstName} {user?.lastName}
                  </UserName>
                </UserSection>
              </>
            )}

            <LogoutBlock onClick={handleLogout} aria-label="Выйти">
              <LogOut size={22} strokeWidth={1.3} />
            </LogoutBlock>
          </HeaderIcons>
        </DesktopHeader>
      </HeaderBar>

      <MobileOnly>
        {menuOpen && (
          <>
            <MobileSheet role="menu" aria-label="Меню профиля">
              <MobileMenu ref={menuRef} role="menu">
                {' '}
                {/* ← меню */}
                <MobileItem onClick={go('/profile')}>
                  <UserIcon size={18} strokeWidth={1.5} />
                  Личный кабинет
                </MobileItem>
                <MobileItem onClick={go('/education')}>
                  <GraduationCap size={18} strokeWidth={1.5} />
                  База знаний
                </MobileItem>
                <MobileItem onClick={handleLogout}>
                  <LogOut size={18} strokeWidth={1.5} />
                  Выход
                </MobileItem>
              </MobileMenu>
            </MobileSheet>
          </>
        )}
      </MobileOnly>
    </>
  );
};

export default Header;
