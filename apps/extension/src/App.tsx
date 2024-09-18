import React from 'react';
import { useMediaQuery } from '@chakra-ui/react';

import { useNavigation } from './store';
import { isMobile } from './utils/isMobile';
import clsx from 'clsx';

const App: React.FC<{}> = () => {
  const { CurrentScreen } = useNavigation();
  const [isLargerThan800] = useMediaQuery('(min-width: 800px)');

  return (
    <div className='flex w-full min-h-screen bg-slate-100'>
      <div
        className={clsx([
          'flex w-full min-h-screen',
          isLargerThan800 && 'mx-[auto] max-w-[1080px]',
          !isMobile() && 'min-w-[500px]',
        ])}
      >
        <CurrentScreen />
      </div>
    </div>
  );
};

export default App;
