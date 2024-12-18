import { useBrowserLocation } from 'wouter/use-browser-location';

export enum ROUTES {
  LOGIN = '/',
  NAVIGATION_ENTRIES = '/navigation-entries',
  SETTINGS = '/settings',
  PREFERENCES = '/preferences',
  ACTIVE_SESSIONS = '/active-sessions',
  SIGN_UP = '/sign-up',
  VALIDATE_EMAIL = '/validate-email',
  CONFIRM_DELETE_ACCOUNT = '/confirm-delete-account',
  FORGOT_PASSWORD = '/forgot-password',
  VALIDATE_RECOVERY_CODE = '/validate-recovery-code',
  RECOVERY_NEW_PASSWORD = '/recovery-new-password',
  ABOUT_WTMS = '/about-wtm',
  PROFILE = '/profile',
}

export const useExtensionNavigation = () => {
  const [location, setLocation] = useBrowserLocation();

  const goBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      setLocation('/');
    }
  };

  const navigateTo = (path: ROUTES, replace?: boolean) => {
    setLocation(path, { replace });
  };

  const currentRoute = () => {
    return location;
  };

  return {
    goBack,
    navigateTo,
    currentRoute,
  };
};