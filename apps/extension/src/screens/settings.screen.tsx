import React from 'react';
import { Text, IconButton, Button, Icon } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';

import { useLogout } from '../hooks';

import { LuSettings2, LuPersonStanding } from 'react-icons/lu';
import { BsPersonLock, BsInfoCircle } from 'react-icons/bs';
import { FaRegTrashAlt, FaSignOutAlt } from 'react-icons/fa';
import { ExtensionRoutes } from '../hooks/use-extension-navigation';
import { useExtensionNavigation } from '../hooks';

export const SettingsScreen: React.FC<object> = () => {
  const { navigateTo } = useExtensionNavigation();
  const { logout } = useLogout();

  return (
    <>
      <div className='flex flex-col px-5 py-3 items-center w-full'>
        <div className='flex w-full justify-start pb-4 gap-4 items-center'>
          <IconButton
            aria-label='Settings icon'
            onClick={() => navigateTo(ExtensionRoutes.NAVIGATION_ENTRIES)}
          >
            <ArrowBackIcon boxSize={5} />
          </IconButton>
          <div className='flex w-full justify-center pr-[40px]'>
            <Text fontSize={'xx-large'} fontWeight='bold'>
              Settings
            </Text>
          </div>
        </div>
        <div className='flex flex-col gap-3 w-full h-full'>
          <div
            className='flex gap-2 items-center w-full p-2 select-none bg-white rounded-lg cursor-pointer'
            onClick={() => navigateTo(ExtensionRoutes.PROFILE)}
          >
            <Icon as={LuPersonStanding} boxSize={5} color='gray.600' />
            <Text fontSize='medium'>Profile</Text>
          </div>
          <div
            className='flex gap-2 items-center w-full p-2 select-none bg-white rounded-lg cursor-pointer'
            onClick={() => navigateTo(ExtensionRoutes.PREFERENCES)}
          >
            <Icon as={LuSettings2} boxSize={5} color='gray.600' />
            <Text fontSize='medium'>Preferences</Text>
          </div>
          <div
            className='flex gap-2 items-center w-full p-2 select-none bg-white rounded-lg cursor-pointer'
            onClick={() => navigateTo(ExtensionRoutes.ACTIVE_SESSIONS)}
          >
            <Icon as={BsPersonLock} boxSize={5} color='gray.600' />
            <Text fontSize='medium'>Active Sessions</Text>
          </div>
          <div
            className='flex gap-2 items-center w-full p-2 select-none bg-white rounded-lg cursor-pointer'
            onClick={() => navigateTo(ExtensionRoutes.ABOUT_WTMS)}
          >
            <Icon as={BsInfoCircle} boxSize={5} color='gray.600' />
            <Text fontSize='medium'>About WebTM</Text>
          </div>
          <div
            className='flex gap-2 items-center w-full p-2 select-none bg-white rounded-lg cursor-pointer'
            onClick={() => navigateTo(ExtensionRoutes.CONFIRM_DELETE_ACCOUNT)}
          >
            <Icon as={FaRegTrashAlt} boxSize={4} color='red.600' />
            <Text fontSize='medium' color='red.600'>
              Delete account
            </Text>
          </div>
        </div>
        <div className='pb-8'>
          <Button
            rightIcon={<FaSignOutAlt />}
            colorScheme='blue'
            onClick={() => logout()}
          >
            Logout
          </Button>
        </div>
      </div>
    </>
  );
};
