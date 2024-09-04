'use client';

import { useEffect, useState } from 'react';

import {
  Avatar,
  Badge,
  Button,
  Divider,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { useGetBasicUserInformation } from '../hooks/use-get-user-basic-information.hook';
import React from 'react';
import CustomInputBox from '../components/custom-input-box.component';
import { useChangeUserPassword } from '../hooks/use-change-user-password.hook';
import { BsKey, BsPerson } from 'react-icons/bs';
import { useChangeUserDisplayName } from '../hooks/use-change-user-displayname.hook';
import { relativeTime } from '../utils';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { useNavigation } from '../store';

export const ProfileScreen: React.FC<object> = () => {
  const { navigateBack } = useNavigation();
  const { basicUserInformationQuery } = useGetBasicUserInformation();
  const { changeUserPasswordMutation } = useChangeUserPassword();
  const { changeUserDisplayNameMutation } = useChangeUserDisplayName();
  const user = basicUserInformationQuery.data;

  const ChangePasswordModal = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [newPassword, setNewPassword] = useState('');
    const [reNewPassword, setReNewPassword] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const handleNewPasswordChange = (e: {
      target: { value: React.SetStateAction<string> };
    }) => setNewPassword(e.target.value);
    const handleOldPasswordChange = (e: {
      target: { value: React.SetStateAction<string> };
    }) => setOldPassword(e.target.value);
    const handleReNewPasswordChange = (e: {
      target: { value: React.SetStateAction<string> };
    }) => setReNewPassword(e.target.value);
    const isError = newPassword !== reNewPassword;
    useEffect(() => {
      if (!isOpen) {
        setNewPassword('');
        setOldPassword('');
        setReNewPassword('');
      }
    }, [isOpen]);
    const verifyFields = () => {
      return (
        newPassword &&
        oldPassword &&
        reNewPassword &&
        newPassword.length > 3 &&
        oldPassword.length > 3 &&
        reNewPassword.length > 3
      );
    };
    const handleSubmit = () => {
      if (verifyFields()) {
        changeUserPasswordMutation.mutate({
          oldPassword: oldPassword,
          newPassword: newPassword,
        });
      }
    };

    return (
      <>
        <Button
          size='sm'
          onClick={onOpen}
          className='flex justify-between items-center gap-2'
        >
          <BsKey /> Change password
        </Button>

        <Modal
          isOpen={isOpen}
          onClose={onClose}
          size={{ base: 'full', md: 'md' }}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Change the password</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl isInvalid={isError}>
                <FormLabel>Old Password</FormLabel>
                <Input
                  type='password'
                  value={oldPassword}
                  onChange={handleOldPasswordChange}
                />
                <FormHelperText>
                  Please enter your password for change.
                </FormHelperText>
                <Divider my={2} />
                <FormLabel>New Password</FormLabel>
                <Input
                  type='password'
                  value={newPassword}
                  onChange={handleNewPasswordChange}
                />
                <FormLabel pt={2}>Re-enter new Password</FormLabel>
                <Input
                  type='password'
                  value={reNewPassword}
                  onChange={handleReNewPasswordChange}
                />
                {!isError ? (
                  <FormHelperText>
                    Password must be between 4 to 8 characters, it must have a
                    Symbol, an Uppercase and Lowercase.
                  </FormHelperText>
                ) : (
                  <FormErrorMessage>
                    {"Passwords don't match."}
                  </FormErrorMessage>
                )}
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <div className='flex w-full justify-center md:justify-end'>
                <Button
                  colorScheme='blue'
                  mr={3}
                  onClick={handleSubmit}
                  disabled={isError}
                >
                  Change
                </Button>
                <Button variant='ghost' onClick={onClose}>
                  Close
                </Button>
              </div>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    );
  };

  const ChangeDisplayNameModal = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [newDisplayName, setNewDisplayName] = useState('');
    const isError =
      newDisplayName === basicUserInformationQuery.data?.displayname;
    const handleNewDisplaynameChange = (e: {
      target: { value: React.SetStateAction<string> };
    }) => setNewDisplayName(e.target.value);
    useEffect(() => {
      if (!isOpen) {
        setNewDisplayName('');
      }
    }, [isOpen]);
    const verifyFields = () => {
      return (
        newDisplayName &&
        newDisplayName.length > 3 &&
        newDisplayName != basicUserInformationQuery.data?.displayname
      );
    };
    const handleSubmit = () => {
      if (verifyFields()) {
        changeUserDisplayNameMutation.mutate({
          displayname: newDisplayName,
        });
      }
    };

    return (
      <>
        <Button
          size='sm'
          onClick={onOpen}
          className='flex justify-between items-center gap-2'
        >
          <BsPerson /> Change display name
        </Button>

        <Modal
          isOpen={isOpen}
          onClose={onClose}
          size={{ base: 'full', md: 'md' }}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Change the displayname</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl isInvalid={isError}>
                <FormLabel>Actual Displayname</FormLabel>
                <Input
                  type='text'
                  value={basicUserInformationQuery.data?.displayname}
                  disabled
                />
                <Divider my={2} />
                <FormLabel>New Displayname</FormLabel>
                <Input
                  type='text'
                  value={newDisplayName}
                  onChange={handleNewDisplaynameChange}
                />
                {!isError ? (
                  <FormHelperText>
                    Displayname must be different to actual displayname.
                  </FormHelperText>
                ) : (
                  <FormErrorMessage>
                    {'Displayname must be different to actual displayname.'}
                  </FormErrorMessage>
                )}
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <div className='flex w-full justify-center md:justify-end'>
                <Button
                  colorScheme='blue'
                  mr={3}
                  onClick={handleSubmit}
                  disabled={isError}
                >
                  Change
                </Button>
                <Button variant='ghost' onClick={onClose}>
                  Close
                </Button>
              </div>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    );
  };
  const ProfileCard = () => {
    const username = basicUserInformationQuery.data?.displayname;
    const relativeTimeLabel =
      basicUserInformationQuery.data &&
      relativeTime(
        new Date(),
        new Date(basicUserInformationQuery.data?.passChangedAt),
      );
    return (
      <div className='bg-white p-6 rounded-lg shadow-lg w-full'>
        <div className='flex justify-between '>
          <div className='flex flex-col items-center md:flex-row md:items-start w-full gap-2'>
            <Avatar
              name={user?.email}
              size={{ base: 'xl', md: 'lg' }}
              bg='gray.400'
            />
            <div className='flex flex-col items-center md:items-start pt-1'>
              <span className='text-lg font-medium text-card-foreground'>
                {username}
              </span>
              <span className='text-xs text-gray-600'>{user?.email}</span>
              <div className='block md:hidden'>
                <Badge
                  colorScheme={`${user?.userType == 'ADMIN' ? 'red' : 'green'}`}
                  variant={'solid'}
                >
                  {user?.userType}
                </Badge>
              </div>
            </div>
          </div>

          <div className='hidden md:block'>
            <Badge
              colorScheme={`${user?.userType == 'ADMIN' ? 'red' : 'green'}`}
              variant={'solid'}
            >
              {user?.userType}
            </Badge>
          </div>
        </div>

        <div className='flex justify-center w-full pt-5'>
          <Tabs w={'100%'} variant='enclosed'>
            <TabList>
              <Tab>Personal Information</Tab>
              <Tab>Actions</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <div className='flex justify-between flex-wrap gap-5'>
                  <CustomInputBox label={'Email'} value={user?.email || ''} />
                  <CustomInputBox
                    label={'Display Name'}
                    value={user?.displayname || ''}
                  />
                  <CustomInputBox
                    label={`Last password change (${relativeTimeLabel})`}
                    value={
                      user?.passChangedAt
                        ? typeof user.passChangedAt === 'string'
                          ? new Date(user.passChangedAt).toLocaleTimeString(
                              'en-US',
                              {
                                hour12: false,
                              },
                            ) +
                            ' ' +
                            new Date(user.passChangedAt)
                              .toLocaleDateString('en-US')
                              .split('/')
                              .reverse()
                              .join('/')
                          : user.passChangedAt.toLocaleTimeString('en-US', {
                              hour12: false,
                            }) +
                            ' ' +
                            user.passChangedAt
                              .toLocaleDateString('en-US')
                              .split('/')
                              .reverse()
                              .join('/')
                        : ''
                    }
                  />
                </div>
              </TabPanel>
              <TabPanel>
                <div className='flex flex-col justify-start gap-5'>
                  <ChangePasswordModal />
                  <ChangeDisplayNameModal />
                </div>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </div>
      </div>
    );
  };

  return (
    <div className='flex flex-col h-full w-full justify-center items-center'>
      <div className='flex flex-col h-full w-2/3'>
        <div className='flex w-full justify-start pb-4 items-center'>
          <IconButton aria-label='Back icon' onClick={() => navigateBack()}>
            <ArrowBackIcon boxSize={5} />
          </IconButton>
          <div className='flex flex-col leading-none w-full justify-center items-center px-[40px] mb-5 h-[40px]'>
            <Text
              fontSize={{ base: 'x-large', md: 'xx-large' }}
              fontWeight={'bold'}
            >
              Profile
            </Text>
          </div>
        </div>
        {user ? <ProfileCard /> : <Spinner />}
      </div>
    </div>
  );
};
