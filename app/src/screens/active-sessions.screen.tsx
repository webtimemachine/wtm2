import React from 'react';
import { Text, IconButton } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { useNavigationStore } from '../store';

export const ActiveSessionsScreen: React.FC<object> = () => {
  const { navigateBack } = useNavigationStore();

  return (
    <>
      <div className='flex flex-col px-5 py-3 bg-slate-100 min-h-screen items-center w-full'>
        <div className='flex w-full justify-start pb-4 gap-4 items-center'>
          <IconButton aria-label='Back icon' onClick={() => navigateBack()}>
            <ArrowBackIcon boxSize={5} />
          </IconButton>
          <div className='flex w-full justify-center pr-[40px]'>
            <Text fontSize={'xx-large'} fontWeight={'bold'}>
              Active Sessions
            </Text>
          </div>
        </div>
        <div className='flex flex-col w-full min-h-[400px]'>
          <Text fontSize={'medium'}>
            Below you can see the complete list of active sessions:
          </Text>
        </div>
      </div>
    </>
  );
};
