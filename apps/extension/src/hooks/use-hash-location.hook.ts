import { useState, useEffect } from 'react';
import { readAuthStateFromLocal } from '../store/auth.store';

const stripHash = (hash: string) => hash.replace(/^#/, '') || '/';

export function useHashLocation(): [string, (to: string) => void] {
  const [location, setLocation] = useState(() =>
    stripHash(window.location.hash),
  );

  useEffect(() => {
    const onHashChange = () => {
      const newLocation = stripHash(window.location.hash);

      const authState = readAuthStateFromLocal();
      if (newLocation === '/' && authState?.isLoggedIn) {
        window.location.hash = '/navigation-entries';
        setLocation('/navigation-entries');
      } else {
        setLocation(newLocation);
      }
    };

    window.addEventListener('hashchange', onHashChange);
    onHashChange();
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navigate = (to: string) => {
    window.location.hash = to;
  };

  return [location, navigate];
}
