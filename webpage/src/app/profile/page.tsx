'use client';
import { getColorFromEmail } from '../../utils/formatterUtils';
import { useGetBasicUserIngormation } from '../../hooks/use-get-user-basic-information.hook';
import { useNavigation } from '../../store';
import { ArrowBackIcon, HamburgerIcon } from '@chakra-ui/icons';
import {
  AbsoluteCenter,
  Badge,
  Box,
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
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { CustomDrawer } from '@/components/custom-drawer';
import React from 'react';
import CustomInputBox from './components/CustomInputBox';
import { useChangeUserPassword } from '@/hooks/use-change-user-password.hook';
import { BsKey } from 'react-icons/bs';

const ProfileScreen: React.FC<object> = () => {
  const { navigateBack } = useNavigation();
  const { basicUserInformationQuery } = useGetBasicUserIngormation();
  const { changeUserPasswordMutation } = useChangeUserPassword();
  const [isReady, setIsReady] = useState<boolean>(false);
  const btnRef = React.useRef<HTMLElement>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [windowSize, setWindowSize] = useState<[number, number]>();
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWindowSize([window?.innerWidth, window?.innerHeight]);
    }
  }, []);

  const getUserNameFromEmail = (email: string) => {
    return email.split('@')[0].toUpperCase();
  };

  useEffect(() => {
    const handleResize = () => {
      setWindowSize([window.innerWidth, window.innerHeight]);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (
      basicUserInformationQuery &&
      basicUserInformationQuery.data &&
      basicUserInformationQuery.data.email &&
      basicUserInformationQuery.data.userType
    ) {
      setIsReady(true);
    }
  }, [basicUserInformationQuery]);

  const getInitialsFromMail = (email: string) => {
    return email.length > 2
      ? email.charAt(0).toUpperCase() + email.charAt(1).toUpperCase()
      : '';
  };
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
          onClick={onOpen}
          display={'flex'}
          justifyContent={'space-between'}
          alignItems={'center'}
          gap={2}
        >
          <BsKey /> Change password
        </Button>

        <Modal isOpen={isOpen} onClose={onClose}>
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
                />{' '}
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
                  <FormErrorMessage>Passwords don't match.</FormErrorMessage>
                )}
              </FormControl>
            </ModalBody>

            <ModalFooter>
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
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    );
  };
  const ProfileCard = () => {
    return (
      <Box className='bg-white p-6 rounded-lg shadow-lg w-full max-w-[80vw]'>
        <Box display={'flex'} width={'25%'} gap={2} mb={5}>
          <IconButton width={'20%'} aria-label='Back icon' onClick={onOpen}>
            <HamburgerIcon boxSize={5} />
          </IconButton>
          <IconButton
            width={'60%'}
            aria-label='Back icon'
            onClick={() => navigateBack()}
          >
            <Text
              fontWeight={400}
              display={'flex'}
              justifyContent={'space-around'}
              alignItems={'center'}
            >
              <ArrowBackIcon boxSize={5} /> Go Back
            </Text>
          </IconButton>
        </Box>
        <Box
          display={'flex'}
          justifyContent={'space-between'}
          width={'100%'}
          alignItems={'center'}
        >
          <Box display={'flex'} alignItems={'center'} gap={5} h={'100%'}>
            <Box
              className={`bg-primary rounded-full w-16 h-16 flex items-center justify-center ${getColorFromEmail(
                basicUserInformationQuery.data?.email!,
              )} text-xl font-bold`}
            >
              {basicUserInformationQuery.data?.email &&
                getInitialsFromMail(basicUserInformationQuery.data.email)}
            </Box>
            <Box>
              <Box
                fontWeight={500}
                fontSize={'xl'}
                className='text-card-foreground text-lg font-medium'
              >
                {basicUserInformationQuery.data?.email &&
                  getUserNameFromEmail(basicUserInformationQuery.data?.email)}
              </Box>
              <Badge
                colorScheme={`${
                  basicUserInformationQuery.data?.userType == 'ADMIN'
                    ? 'red'
                    : 'green'
                }`}
                variant={'solid'}
              >
                {basicUserInformationQuery.data?.userType}
              </Badge>
            </Box>
          </Box>
          <Box>
            <ChangePasswordModal />
          </Box>
        </Box>

        <Box position='relative' padding='10'>
          <Divider />
          <AbsoluteCenter px='4' fontWeight={200} fontSize={12}>
            Personal Information
          </AbsoluteCenter>
        </Box>
        <Box
          display={'flex'}
          justifyContent={'space-between'}
          flexWrap={'wrap'}
          gap={5}
        >
          <CustomInputBox
            width={'40%'}
            label={'Email'}
            value={basicUserInformationQuery.data?.email || ''}
          />
        </Box>
      </Box>
    );
  };

  const MobileProfileCard = () => {
    return (
      <Box className='flex flex-col  justify-around bg-white p-6 rounded-lg shadow-lg h-[90vh] w-full max-w-[80vw]'>
        <Box
          display={'flex'}
          justifyContent={'space-between'}
          alignItems={'center'}
        >
          <IconButton aria-label='Back icon' onClick={onOpen}>
            <HamburgerIcon boxSize={5} />
          </IconButton>
          <Box>
            <ChangePasswordModal />
          </Box>
        </Box>
        <Box
          display={'flex'}
          justifyContent={'flex-start'}
          flexDir={'column'}
          width={'100%'}
          gap={4}
          alignItems={'flex-start'}
          height={'30%'}
        >
          <Box
            display={'flex'}
            flexDir={'column'}
            alignItems={'center'}
            gap={5}
            h={'100%'}
            w={'100%'}
          >
            <Box
              className={`bg-primary rounded-full w-[40%] aspect-square flex items-center justify-center ${getColorFromEmail(
                basicUserInformationQuery.data?.email!,
              )} text-3xl font-bold`}
            >
              {basicUserInformationQuery.data?.email &&
                getInitialsFromMail(basicUserInformationQuery.data.email)}
            </Box>
            <Box display={'flex'} flexDir={'column'} alignItems={'center'}>
              <Badge
                colorScheme={`${
                  basicUserInformationQuery.data?.userType == 'ADMIN'
                    ? 'red'
                    : 'green'
                }`}
                variant={'solid'}
              >
                {basicUserInformationQuery.data?.userType}
              </Badge>
              <Box
                fontWeight={500}
                fontSize={'xl'}
                className='text-card-foreground text-lg font-medium'
              >
                {basicUserInformationQuery.data?.email &&
                  getUserNameFromEmail(basicUserInformationQuery.data?.email)}
              </Box>
            </Box>
          </Box>
          <Box position='relative' padding='10' w={'100%'} mb={5}>
            <Divider />
            <AbsoluteCenter fontWeight={400} fontSize={12}>
              Personal Information
            </AbsoluteCenter>
          </Box>
        </Box>
        <Box
          display={'flex'}
          justifyContent={'space-between'}
          flexWrap={'wrap'}
          gap={5}
        >
          <CustomInputBox
            width={'100%'}
            label={'Email'}
            value={basicUserInformationQuery.data?.email || ''}
          />
        </Box>
        <Box width={'100%'}>
          <IconButton
            width={'100%'}
            aria-label='Back icon'
            onClick={() => navigateBack()}
          >
            <Text
              fontWeight={400}
              display={'flex'}
              justifyContent={'space-around'}
              alignItems={'center'}
            >
              <ArrowBackIcon boxSize={5} /> Go Back
            </Text>
          </IconButton>
        </Box>
      </Box>
    );
  };

  return (
    <Box className='flex flex-col items-center justify-center h-screen bg-background'>
      <CustomDrawer isOpen={isOpen} onClose={onClose} btnRef={btnRef} />

      {isReady ? (
        windowSize && windowSize[0] > 690 ? (
          <ProfileCard />
        ) : (
          <MobileProfileCard />
        )
      ) : (
        <Spinner />
      )}
    </Box>
  );
};

export default ProfileScreen;
