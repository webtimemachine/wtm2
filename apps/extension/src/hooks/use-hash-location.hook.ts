import { useState, useEffect } from 'react';
import { screenStore } from '../store/screens.store';

const stripHash = (hash: string) => hash.replace(/^#/, '') || '/';

export function useHashLocation(): [string, (to: string) => void] {
  const [location, setLocation] = useState(() =>
    stripHash(window.location.hash),
  );

  useEffect(() => {
    const onHashChange = () => {
      const newLocation = stripHash(window.location.hash);

      const { screenStack, isLoggedIn } = screenStore.getState();
      const persistedScreen = screenStack[screenStack.length - 1];
      if (isLoggedIn) {
        if (persistedScreen !== '/') {
          window.location.hash = persistedScreen;
          setLocation(persistedScreen);
        } else {
          if (newLocation === '/') {
            window.location.hash = '/navigation-entries';
            setLocation('/navigation-entries');
          } else {
            window.location.hash = newLocation;
            setLocation(newLocation);
          }
        }
      } else {
        if (persistedScreen !== '/') {
          window.location.hash = persistedScreen;
          setLocation(persistedScreen);
        } else {
          setLocation(newLocation);
        }
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
