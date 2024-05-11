import React from 'react';
import { useNavigation } from './store';

const App: React.FC<object> = () => {
  const { CurrentScreen } = useNavigation();
  return <CurrentScreen />;
};

export default App;
