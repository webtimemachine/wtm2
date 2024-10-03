import React from 'react';
import { Spinner, Text, useMediaQuery } from '@chakra-ui/react';

import { useNavigation } from './store';
import { isMobile } from '@wtm/utils';
import clsx from 'clsx';
import { useWebLLM } from './hooks/use-web-llm.hook';

const App: React.FC<object> = () => {
  const { CurrentScreen } = useNavigation();
  const { isLoading } = useWebLLM();
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
        {isLoading ? (
          <div className='flex flex-col gap-1 items-center justify-center w-full h-[400px]'>
            <Spinner size={'lg'} />
            <Text>App Loading...</Text>
          </div>
        ) : (
          <CurrentScreen />
        )}
      </div>
    </div>
  );
};

export default App;
