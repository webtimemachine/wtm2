import React from 'react';
import { Text, IconButton, Button, Icon } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';

import { useLogout } from '../hooks';
import { useNavigation } from '../store';

import { LuSettings2 } from 'react-icons/lu';
import { BsPersonLock, BsInfoCircle } from 'react-icons/bs';
import { FaRegTrashAlt, FaSignOutAlt } from 'react-icons/fa';
import { PiTabs } from 'react-icons/pi';

export const SettingsScreen: React.FC<object> = () => {
  const { navigateBack, navigateTo } = useNavigation();
  const { logout } = useLogout();

  return (
    <>
      <div className='flex flex-col px-5 py-3 items-center w-full'>
        <div className='flex w-full justify-start pb-4 gap-4 items-center'>
          <IconButton aria-label='Settings icon' onClick={() => navigateBack()}>
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
            onClick={() => navigateTo('preferences')}
          >
            <Icon as={LuSettings2} boxSize={5} color='gray.600' />
            <Text fontSize='medium'>Preferences</Text>
          </div>
          <div
            className='flex gap-2 items-center w-full p-2 select-none bg-white rounded-lg cursor-pointer'
            onClick={() => navigateTo('active-sessions')}
          >
            <Icon as={BsPersonLock} boxSize={5} color='gray.600' />
            <Text fontSize='medium'>Active Sessions</Text>
          </div>
          <div
            className='flex gap-2 items-center w-full p-2 select-none bg-white rounded-lg cursor-pointer'
            onClick={() => window.open(window.location.href, '_blank')}
          >
            <Icon as={PiTabs} boxSize={5} color='gray.600' />
            <Text fontSize='medium'>Open in new tab</Text>
          </div>
          <div
            className='flex gap-2 items-center w-full p-2 select-none bg-white rounded-lg cursor-pointer'
            onClick={() => navigateTo('about-wtm')}
          >
            <Icon as={BsInfoCircle} boxSize={5} color='gray.600' />
            <Text fontSize='medium'>About WTM</Text>
          </div>
          <div
            className='flex gap-2 items-center w-full p-2 select-none bg-white rounded-lg cursor-pointer'
            onClick={() => navigateTo('confirm-delete-account')}
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
