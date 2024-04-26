import React from 'react';
import { Text, IconButton, Button } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { useNavigationStore } from '../store';

export const ConfirmDeleteAccountScreen: React.FC<object> = () => {
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
              Delete Account
            </Text>
          </div>
        </div>
        <div className='flex flex-col w-full min-h-[400px]'>
          <Text fontSize={'medium'}>
            Do you confirm that you want to delete your account data? Once this
            information is deleted, it cannot be recovered again.
          </Text>
        </div>
        <div className='pb-8'>
          <Button
            colorScheme='red'
            // isDisabled={enabled && !days}
            // onClick={handleSavePreferences}
          >
            Confirm
          </Button>
        </div>
      </div>
    </>
  );
};
