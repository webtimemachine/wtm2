import React from 'react';

import { useNavigation } from './store';
import clsx from 'clsx';

const App: React.FC<object> = () => {
  const { CurrentScreen } = useNavigation();

  return (
    <div className='flex min-h-screen bg-slate-100'>
      <div className={clsx(['flex w-[550px] min-h-screen '])}>
        <CurrentScreen />
      </div>
    </div>
  );
};

export default App;
