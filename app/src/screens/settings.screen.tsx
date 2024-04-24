import React from 'react';
import { Text, IconButton } from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';

export const SettingsScreen: React.FC<object> = () => {
  return (
    <>
      <div className='flex flex-col px-5 py-3 bg-slate-100 min-h-screen items-center w-full'>
        <div className='flex w-full justify-end'>
          <IconButton aria-label='Settings icon'>
            <CloseIcon boxSize={5} />
          </IconButton>
        </div>
        <div className='pb-4'>
          <Text fontSize={'xx-large'} fontWeight={'bold'}>
            Settings
          </Text>
        </div>
        <div className='flex flex-col w-full min-h-[400px] justify-between'></div>
      </div>
    </>
  );
};
