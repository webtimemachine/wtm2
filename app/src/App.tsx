import React from 'react';
import { useNavigationStore } from './store';

const App: React.FC<{}> = () => {
  const CurrentScreen = useNavigationStore((state) => state.CurrentScreen);
  return <CurrentScreen />;
};

export default App;
