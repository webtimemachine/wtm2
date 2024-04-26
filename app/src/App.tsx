import React from 'react';
import { useNavigation } from './store';

const App: React.FC<{}> = () => {
  const { CurrentScreen } = useNavigation();
  return <CurrentScreen />;
};

export default App;
