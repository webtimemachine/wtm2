import { useAtom } from 'jotai';
import { currentScreenAtom } from '../store';

export const useCurrentScreen = () => {
  const [currentScreen, setCurrentScreen] = useAtom(currentScreenAtom);
  return { currentScreen, setCurrentScreen };
};
