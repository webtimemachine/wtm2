import React, { useEffect } from 'react';
import { Text, IconButton, Button } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { useConfirmDeleteAccount } from '../hooks';
import {
  useExtensionNavigation,
  ExtensionRoutes,
} from '../hooks/use-extension-navigation';

export const ConfirmDeleteAccountScreen: React.FC = () => {
  const { confirmDeleteAccountMutation } = useConfirmDeleteAccount();
  const { navigateTo } = useExtensionNavigation();

  useEffect(() => {
    if (confirmDeleteAccountMutation.isSuccess) {
      navigateTo(ExtensionRoutes.LOGIN);
    }
  }, [confirmDeleteAccountMutation.isSuccess, navigateTo]);

  return (
    <div className='flex flex-col px-5 py-3 min-h-screen items-center w-full'>
      <div className='flex w-full justify-start pb-4 gap-4 items-center'>
        <IconButton
          aria-label='Back icon'
          onClick={() => navigateTo(ExtensionRoutes.NAVIGATION_ENTRIES)}
        >
          <ArrowBackIcon boxSize={5} />
        </IconButton>
        <div className='flex w-full justify-center pr-[40px]'>
          <Text fontSize='xx-large' fontWeight='bold'>
            Delete Account
          </Text>
        </div>
      </div>

      <div className='flex flex-col w-full h-full'>
        <Text fontSize='medium'>
          Do you confirm that you want to delete your account data? Once this
          information is deleted, it cannot be recovered again.
        </Text>
      </div>

      <div className='pb-8'>
        <Button
          colorScheme='red'
          onClick={() => confirmDeleteAccountMutation.mutate()}
        >
          Confirm
        </Button>
      </div>
    </div>
  );
};
