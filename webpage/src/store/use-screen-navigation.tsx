'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export type ScreenName =
  | 'login'
  | 'server-url'
  | 'navigation-entries'
  | 'settings'
  | 'preferences'
  | 'active-sessions'
  | 'sign-up'
  | 'validate-email'
  | 'confirm-delete-account'
  | 'forgot-password'
  | 'validate-recovery-code'
  | 'recovery-new-password'
  | 'about-wtm'
  | '404';

export function useScreenNavigation() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const mappedScreensToRouter: { [key in ScreenName]: () => void } = {
    login: () => router.push('/login'),
    'server-url': () => router.push('/server-url'),
    'navigation-entries': () => router.push('/navigation-entries'),
    settings: () => router.push('/settings'),
    preferences: () => router.push('/preferences'),
    'active-sessions': () => router.push('/active-sessions'),
    'sign-up': () => router.push('/sign-up'),
    'validate-email': () => router.push('/validate-email'),
    'confirm-delete-account': () => router.push('/confirm-delete-account'),
    'forgot-password': () => router.push('/forgot-password'),
    'validate-recovery-code': () => router.push('/validate-recovery-code'),
    'recovery-new-password': () => router.push('/recovery-new-password'),
    'about-wtm': () => router.push('/about-wtm'),
    '404': () => router.push('/404'),
  };

  function navigateTo(screen: ScreenName) {
    if (!isMounted) return;
    const navigate = mappedScreensToRouter[screen];
    if (navigate) {
      navigate();
    } else {
      mappedScreensToRouter['404'];
    }
  }

  return { navigateTo };
}
