'use client';

import { useEffect, useState } from 'react';

import { useGetBasicUserIngormation } from '../../hooks/use-get-user-basic-information.hook';
import {
  Avatar,
  Badge,
  Button,
  Divider,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  useDisclosure,
} from '@chakra-ui/react';

import React from 'react';
import CustomInputBox from './components/CustomInputBox';
import { useChangeUserPassword } from '@/hooks/use-change-user-password.hook';
import { BsKey } from 'react-icons/bs';

const ProfileScreen: React.FC<object> = () => {
  const { basicUserInformationQuery } = useGetBasicUserIngormation();
  const { changeUserPasswordMutation } = useChangeUserPassword();

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

  const ProfileCard = () => {
    const username = user?.email?.split('@')?.[0];
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
          <ChangePasswordModal />
        </div>
        <div className='relative py-10'>
          <Divider />
          <Text className='absolute inset-x-0 px-4 font-light text-xs text-center'>
            Personal Information
          </Text>
        </div>
        <div className='flex justify-between flex-wrap gap-5'>
          <CustomInputBox
            width={'40%'}
            label={'Email'}
            value={user?.email || ''}
          />
        </div>
      </div>
    );
  };

  return (
    <>
      <div className='flex flex-col h-full'>
        <div className='flex w-full justify-start pb-4 items-center'>
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
    </>
  );
};

export default ProfileScreen;
