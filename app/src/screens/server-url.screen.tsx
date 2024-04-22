import React from 'react';
import { Text } from '@chakra-ui/react';
import { ServerUrlEditable } from '../components';

export const ServerUrlScreen: React.FC<{}> = () => {
  return (
    <>
      <div className='flex flex-col p-8 pt-5 bg-slate-100 min-h-screen justify-center items-center w-full'>
        <div className='pb-12'>
          <Text fontSize={'xx-large'} fontWeight={'bold'}>
            Server URL
          </Text>
        </div>
        <div className='pb-4 flex w-full'>
          <ServerUrlEditable />
        </div>
      </div>
    </>
  );
};
