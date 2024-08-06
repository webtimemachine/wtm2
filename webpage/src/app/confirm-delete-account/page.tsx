'use client';

import React, { useEffect } from 'react';
import { Text, IconButton, Button } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { useNavigation } from '@/store';
import { useConfirmDeleteAccount } from '@/hooks';

const ConfirmDeleteAccountScreen: React.FC<object> = () => {
  const { navigateBack, navigateTo } = useNavigation();
  const { confirmDeleteAccountMutation } = useConfirmDeleteAccount();

  useEffect(() => {
    if (confirmDeleteAccountMutation.isSuccess) {
      navigateTo('login');
    }
  }, [confirmDeleteAccountMutation.isSuccess, navigateTo]);

  return (
    <>
      <div className='flex flex-col px-5 py-3 min-h-screen items-center w-full'>
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
        <div className='flex justify-center items-center w-full h-max rounded'>
          <div className='flex flex-col justify-center items-center bg-white w-full max-w-[600px] mx-auto rounded-lg'>
            <div className='flex flex-col justify-center items-center m-5 gap-2'>
              <Text
                fontWeight={600}
                fontSize={'medium'}
                align={'center'}
                w={'100%'}
              >
                Do you confirm that you want to delete your account data?
              </Text>
              <Text align={'center'}>
                Once this information is deleted, it cannot be recovered again.
              </Text>
            </div>
            <div className='flex justify-center gap-5 w-100 p-8'>
              <Button onClick={() => navigateBack()} colorScheme='blue'>
                Cancel
              </Button>
              <Button
                colorScheme='red'
                variant={'outline'}
                onClick={() => confirmDeleteAccountMutation.mutate()}
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default ConfirmDeleteAccountScreen;
