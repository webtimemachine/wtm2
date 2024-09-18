import { useGetBasicUserInformation } from '../hooks/use-get-user-basic-information.hook';
import { useLogout } from '../hooks';
import { useNavigation } from '../store';
import { ChevronDownIcon, SettingsIcon } from '@chakra-ui/icons';
import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  Menu,
  MenuButton,
  Button,
  MenuList,
  MenuItem,
  Divider,
  DrawerBody,
  IconButton,
  Text,
  DrawerFooter,
  MenuGroup,
  MenuDivider,
  Icon,
} from '@chakra-ui/react';
import { BsPersonLock, BsInfoCircle } from 'react-icons/bs';
import { FaRegTrashAlt, FaSignOutAlt } from 'react-icons/fa';
import { FaUser } from 'react-icons/fa6';
import { FcContacts } from 'react-icons/fc';
import { LuSettings2 } from 'react-icons/lu';
import { PiTabs } from 'react-icons/pi';
import { ImProfile } from 'react-icons/im';

export const CustomDrawer = ({
  isOpen,
  onClose,
  btnRef,
}: {
  isOpen: boolean;
  onClose: () => void;
  btnRef: any | undefined;
}) => {
  const { logout } = useLogout();
  const { navigateTo } = useNavigation();
  const { basicUserInformationQuery } = useGetBasicUserInformation();
  const getUserMail = (basicUserInformationQuery: any) => {
    if (basicUserInformationQuery && basicUserInformationQuery.data) {
      const email: string = basicUserInformationQuery.data.email;
      return email.split('@')[0];
    }
    return 'Loading...';
  };
  return (
    <Drawer
      isOpen={isOpen}
      placement='left'
      onClose={onClose}
      finalFocusRef={btnRef}
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>
          <Menu>
            <MenuButton
              as={Button}
              leftIcon={<FaUser />}
              rightIcon={<ChevronDownIcon />}
            >
              {basicUserInformationQuery &&
                getUserMail(basicUserInformationQuery)}
            </MenuButton>
            <MenuList>
              <MenuGroup title='Profile'>
                <MenuDivider />
                <MenuItem
                  icon={<ImProfile />}
                  onClick={() => navigateTo('profile')}
                >
                  <Text fontWeight={400} fontSize={12}>
                    My profile
                  </Text>
                </MenuItem>
              </MenuGroup>
            </MenuList>
          </Menu>
        </DrawerHeader>
        <Divider />
        <DrawerBody>
          <div className='flex flex-col w-full gap-5'>
            <Menu isLazy>
              <MenuButton as={Button} leftIcon={<SettingsIcon boxSize={5} />}>
                Settings
              </MenuButton>
              <MenuList aria-orientation='horizontal'>
                <MenuGroup title='Settings'>
                  <MenuDivider />
                  <MenuItem
                    icon={
                      <Icon as={LuSettings2} boxSize={5} color='gray.600' />
                    }
                    onClick={() => navigateTo('preferences')}
                  >
                    Preferences
                  </MenuItem>
                  <MenuItem
                    icon={
                      <Icon as={BsPersonLock} boxSize={5} color='gray.600' />
                    }
                    onClick={() => navigateTo('active-sessions')}
                  >
                    Active Sessions
                  </MenuItem>
                  <MenuItem
                    icon={<Icon as={PiTabs} boxSize={5} color='gray.600' />}
                    onClick={() => window.open(window.location.href, '_blank')}
                  >
                    Open in new tab
                  </MenuItem>
                  <MenuItem
                    icon={
                      <Icon as={BsInfoCircle} boxSize={5} color='gray.600' />
                    }
                    onClick={() => navigateTo('about')}
                  >
                    About
                  </MenuItem>
                  <MenuItem
                    icon={
                      <Icon as={FaRegTrashAlt} boxSize={4} color='red.600' />
                    }
                    onClick={() => navigateTo('confirm-delete-account')}
                  >
                    Delete account
                  </MenuItem>
                </MenuGroup>
              </MenuList>
            </Menu>
          </div>
        </DrawerBody>
        <Divider />
        <DrawerFooter>
          <Button
            rightIcon={<FaSignOutAlt />}
            colorScheme='blue'
            onClick={() => logout()}
            className='w-full'
          >
            Logout
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
