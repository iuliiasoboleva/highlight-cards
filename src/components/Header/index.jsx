import React, { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

import { Contact, GraduationCap, LogOut } from 'lucide-react';

import { pluralize } from '../../helpers/pluralize';
import { logout as authLogout } from '../../store/authSlice';
import { fetchSubscription } from '../../store/subscriptionSlice';
import { logout as userLogout } from '../../store/userSlice';
import {
  AvatarCircle,
  DemoBadge,
  DesktopHeader,
  HeaderBar,
  HeaderIcons,
  IconButton,
  Logo,
  UserName,
  UserSection,
} from './styles';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.user);
  const subscription = useSelector((state) => state.subscription.info);
  const subLoading = useSelector((state) => state.subscription.loading);

  useEffect(() => {
    if (!user?.organization_id || subLoading) return;
    if (!subscription) {
      dispatch(fetchSubscription(user.organization_id));
    }
  }, [dispatch, user?.organization_id, subscription, subLoading]);

  const { isTrial, daysLeft, dayWord, demoLabel } = useMemo(() => {
    const status = String(subscription?.status || '').toLowerCase();
    const d = Math.max(0, Number(subscription?.days_left ?? 0));
    return {
      isTrial: status === 'trial',
      daysLeft: d,
      dayWord: pluralize(d, ['день', 'дня', 'дней']),
      demoLabel: `Демо-версия доступна ещё: ${d} ${pluralize(d, ['день', 'дня', 'дней'])}`,
    };
  }, [subscription?.status, subscription?.days_left]);

  const initials = useMemo(() => {
    const f = (user?.firstName || user?.name || '').trim();
    const l = (user?.lastName || '').trim();
    return `${f[0] || ''}${l[0] || ''}`.toUpperCase();
  }, [user?.firstName, user?.lastName, user?.name]);

  const handleLogout = useCallback(() => {
    dispatch(userLogout());
    dispatch(authLogout());
    navigate('/auth');
  }, [dispatch, navigate]);

  const headerIcons = useMemo(
    () => [
      {
        icon: <Contact size={22} strokeWidth={1.3} />,
        tooltip: 'Мой профиль',
        onClick: () => navigate('/settings/personal'),
      },
      {
        icon: <GraduationCap size={22} strokeWidth={1.3} />,
        tooltip: 'База знаний',
        onClick: () => navigate('/education'),
      },
      {
        icon: <LogOut size={22} strokeWidth={1.3} />,
        tooltip: 'Выйти',
        onClick: handleLogout,
      },
    ],
    [navigate, handleLogout],
  );

  const userName = user?.firstName || user?.name;

  return (
    <HeaderBar>
      <DesktopHeader>
        <Logo src="/logoColored.png" alt="Logo" onClick={() => navigate('/')} />

        {userName && (
          <UserSection>
            <AvatarCircle>
              {user?.avatar ? <img src={user.avatar} alt="Avatar" /> : <>{initials}</>}
            </AvatarCircle>
            <UserName>{userName}</UserName>

            {isTrial && (
              <DemoBadge
                onClick={() => navigate('/settings')}
                role="button"
                aria-label={`Осталось ${daysLeft} ${dayWord}`}
              >
                {demoLabel}
              </DemoBadge>
            )}
          </UserSection>
        )}

        <HeaderIcons>
          {headerIcons.map(({ icon, tooltip, onClick }, i) => {
            const tooltipId = `header-tooltip-${i}`;
            return (
              <React.Fragment key={tooltipId}>
                <IconButton
                  onClick={onClick}
                  data-tooltip-id={tooltipId}
                  data-tooltip-content={tooltip}
                  data-tooltip-place="bottom"
                >
                  {icon}
                </IconButton>
                <Tooltip id={tooltipId} className="sidebar-tooltip" />
              </React.Fragment>
            );
          })}
        </HeaderIcons>
      </DesktopHeader>
    </HeaderBar>
  );
};

export default Header;
