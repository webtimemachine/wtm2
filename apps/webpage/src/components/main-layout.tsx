'use client';

import React from 'react';
import {
  Text,
  Icon,
  Divider,
  Button,
  Avatar,
  IconButton,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from '@chakra-ui/react';

import { useNavigation } from '@/store';
import { useGetBasicUserInformation, useLogout } from '@/hooks';

import { LuSettings2 } from 'react-icons/lu';
import { BsPersonLock, BsInfoCircle } from 'react-icons/bs';
import { FaSignOutAlt } from 'react-icons/fa';
import { CgProfile } from 'react-icons/cg';
import { LuHistory } from 'react-icons/lu';
import { HamburgerIcon } from '@chakra-ui/icons';
import { usePathname } from 'next/navigation';

import { User } from '@wtm/api';

import { clsx } from 'clsx';

interface Props {
  children?: React.ReactNode;
}

export const MainLayout: React.FC<Props> = ({ children }) => {
  const { navigateTo } = useNavigation();
  const { logout } = useLogout();

  const { basicUserInformationQuery } = useGetBasicUserInformation();
  const user: User | undefined = basicUserInformationQuery?.data;

  const ProfileSection = () => {
    const username = user?.displayname;
    return (
      <div className='flex w-full gap-2'>
        <Avatar name={user?.email} size='lg' bg='gray.400' />
        <div className='flex flex-col pt-1'>
          <span className='text-lg font-medium text-card-foreground'>
            {username}
          </span>
          <span className='text-xs text-gray-600'>{user?.email}</span>
        </div>
      </div>
    );
  };

  interface NavigationOptionProps {
    NavIcon: () => JSX.Element;
    title: string;
    selected?: boolean;
    onClick: () => void;
  }

  const NavigationOption: React.FC<NavigationOptionProps> = (props) => {
    const { NavIcon, title, selected, onClick } = props;
    return (
      <div
        className={clsx([
          'flex gap-2 items-center w-full p-2 select-none hover:bg-slate-100 rounded-lg cursor-pointer',
          selected && 'bg-slate-200 hover:bg-slate-200',
        ])}
        onClick={onClick}
      >
        <NavIcon />
        <Text fontSize='medium'>{title}</Text>
      </div>
    );
  };

  const NavigationSection = () => {
    const pathname = usePathname();
    return (
      <div className='flex flex-col gap-3 w-full h-full'>
        <NavigationOption
          NavIcon={() => <Icon as={LuHistory} boxSize={5} color='gray.600' />}
          title='Navigation History'
          selected={pathname?.includes('navigation-entries')}
          onClick={() => navigateTo('navigation-entries')}
        />

        <NavigationOption
          NavIcon={() => <Icon as={CgProfile} boxSize={5} color='gray.600' />}
          title='Profile'
          selected={pathname?.includes('profile')}
          onClick={() => navigateTo('profile')}
        />

        <NavigationOption
          NavIcon={() => <Icon as={LuSettings2} boxSize={5} color='gray.600' />}
          title='Preferences'
          selected={pathname?.includes('preferences')}
          onClick={() => navigateTo('preferences')}
        />

        <NavigationOption
          NavIcon={() => (
            <Icon as={BsPersonLock} boxSize={5} color='gray.600' />
          )}
          title='Active Sessions'
          selected={pathname?.includes('active-sessions')}
          onClick={() => navigateTo('active-sessions')}
        />

        <NavigationOption
          NavIcon={() => (
            <Icon as={BsInfoCircle} boxSize={5} color='gray.600' />
          )}
          title='About WebTM'
          selected={pathname?.includes('about')}
          onClick={() => navigateTo('about')}
        />
      </div>
    );
  };

  const SidePanel = () => {
    return (
      <div className='flex flex-col gap-4 h-full'>
        <ProfileSection />
        <Divider />
        <NavigationSection />
        <Button
          rightIcon={<FaSignOutAlt />}
          colorScheme='blue'
          onClick={() => logout()}
          className='w-full'
        >
          Logout
        </Button>
      </div>
    );
  };

  const SideCard = () => {
    return (
      <div className='bg-white rounded-lg shadow-lg p-5 min-w-[320px] h-full'>
        <SidePanel />
      </div>
    );
  };

  const sideDrawerDisclosure = useDisclosure();

  const SideDrawer = () => {
    return (
      <Drawer
        isOpen={sideDrawerDisclosure.isOpen}
        onClose={sideDrawerDisclosure.onClose}
        placement='left'
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />

          <div className='h-full p-5'>
            <SidePanel />
          </div>
        </DrawerContent>
      </Drawer>
    );
  };

  return (
    <div className='flex h-screen p-5 gap-5 relative'>
      <div className='absolute top-5 left-5 md:hidden'>
        <IconButton
          aria-label='Menu'
          onClick={sideDrawerDisclosure.onOpen}
          variant='ghost'
          colorScheme='gray'
        >
          <HamburgerIcon boxSize={5} />
        </IconButton>
        <SideDrawer />
      </div>

      <div className='hidden md:block'>
        <SideCard />
      </div>

      <div className='flex flex-col w-full mx-auto max-w-[900px] px-5'>
        {children}
      </div>
    </div>
  );
};
