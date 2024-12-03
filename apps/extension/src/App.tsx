import React from 'react';

import { useNavigation, useTabState } from './store';
import clsx from 'clsx';

const App: React.FC<object> = () => {
  const { CurrentScreen } = useNavigation();
  const isDeferred = useTabState((state) => state.isDeferred);
  console.log(isDeferred);
  return (
    <div
      className={`flex min-h-screen bg-slate-100 ${isDeferred ? 'w-full justify-center' : 'w-[ 550px]'}`}
    >
      <div className={clsx([`flex w-[550px] min-h-screen `])}>
        <CurrentScreen />
      </div>
    </div>
  );
};

export default App;
