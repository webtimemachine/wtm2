import React, { useEffect, useRef, useState } from 'react';
import {
  Button,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  FormControl,
  FormErrorMessage,
  Tooltip,
  useDisclosure,
  IconButton,
  useToast,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Portal,
} from '@chakra-ui/react';
import { ArrowBackIcon, InfoIcon } from '@chakra-ui/icons';

import { ServerUrlEditable } from '../components';
import { useSignUp, useExtensionNavigation } from '../hooks';

import clsx from 'clsx';
import { generateSecurePassword } from '@wtm/utils';
import { screenStore } from '../store/screens.store';
import { ExtensionRoutes } from '../hooks/use-extension-navigation';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[^\s]{8,20}$/;
const passwordRegexMessage =
  'Password must be between 8 and 20 characters long and contain at least one uppercase letter, one lowercase letter, and one digit. Spaces are not allowed.';

export const SignUpScreen: React.FC = () => {
  const { signUpMutation } = useSignUp();
  const { navigateTo } = useExtensionNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPassError, setConfirmPassError] = useState('');

  const [loadingGeneratePassword, setLoadingGeneratePassword] = useState(false);
  const [passwordTooltipIsOpen, setPasswordTooltipIsOpen] = useState(false);

  const passwordInputRef = useRef<HTMLInputElement>(null);

  const toast = useToast();

  const {
    isOpen: passTooltipIsOpen,
    onOpen: passTooltipOnOpen,
    onClose: passTooltipOnClose,
    onToggle: passTooltipOnToggle,
  } = useDisclosure();
  useEffect(() => {
    screenStore.getState().notifyForgotPassword();
  }, []);
  const validateInputs = () => {
    let emailErrorFound = false;
    let passwordErrorFound = false;
    let confirmPassErrorFound = false;

    if (!email) {
      setEmailError('Email is required');
      emailErrorFound = true;
    } else {
      if (!emailRegex.test(email)) {
        setEmailError('Please enter a valid email address');
        emailErrorFound = true;
      }
    }

    if (!password) {
      setPasswordError('Password is required');
      passwordErrorFound = true;
    } else {
      if (!passwordRegex.test(password)) {
        setPasswordError('Please enter a valid password');
        passwordErrorFound = true;
      }
    }

    if (!confirmPassword) {
      setConfirmPassError('Confirmation password is required');
      confirmPassErrorFound = true;
    } else {
      if (confirmPassword !== password) {
        setConfirmPassError('Confirmation password must be equal to Password');
        confirmPassErrorFound = true;
      }
    }

    return emailErrorFound || passwordErrorFound || confirmPassErrorFound;
  };

  const handleSignUp = () => {
    const errorsFound = validateInputs();
    if (!errorsFound) {
      const signUpData = {
        email,
        password,
        displayname: email.split('@')[0] || '',
      };
      signUpMutation.mutate(signUpData);
    }
  };

  const handleGenerateSecurePassword = async () => {
    setLoadingGeneratePassword(true);

    const securePassword = generateSecurePassword();
    setShowConfirmPass(true);
    setShowPass(true);
    setPassword(securePassword);
    setConfirmPassword(securePassword);

    try {
      await navigator.clipboard.writeText(securePassword);

      toast({
        title: 'Success',
        description: 'Secure password copied to clipboard!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error copying secure password to clipboard.', error);
    } finally {
      setLoadingGeneratePassword(false);
      setPasswordTooltipIsOpen(false);
    }
  };

  return (
    <>
      <div className='flex flex-col p-8 pt-10 items-center w-full'>
        <div className='flex w-full justify-start pb-4 gap-4 items-center'>
          <IconButton
            aria-label='Back icon'
            onClick={() => {
              screenStore.getState().goBack();
              navigateTo(ExtensionRoutes.LOGIN);
            }}
          >
            <ArrowBackIcon boxSize={5} />
          </IconButton>

          <div className='flex w-full justify-center pr-[40px]'>
            <Text fontSize={'xx-large'} fontWeight={'bold'}>
              Sign Up
            </Text>
          </div>
        </div>

        <div className='pb-4 flex w-full'>
          <ServerUrlEditable />
        </div>
        <FormControl isInvalid={!!emailError}>
          <div
            className={clsx(['flex flex-col w-full', !emailError && 'pb-4'])}
          >
            <Input
              type='text'
              name='email'
              placeholder='Email'
              value={email}
              autoCapitalize={'off'}
              onChange={(event) => {
                setEmail(event.target.value);
                if (emailError) setEmailError('');
              }}
              backgroundColor={'white'}
            />
            <div className='[&>div]:mt-1 [&>div]:mb-1 select-none'>
              <FormErrorMessage>{emailError}</FormErrorMessage>
            </div>
          </div>
        </FormControl>

        <FormControl isInvalid={!!passwordError}>
          <div className='flex flex-col w-full pb-4 '>
            <InputGroup size='md'>
              <Popover
                isOpen={passwordTooltipIsOpen}
                initialFocusRef={passwordInputRef}
              >
                <PopoverTrigger>
                  <Input
                    ref={passwordInputRef}
                    pr='4.5rem'
                    type={showPass ? 'text' : 'password'}
                    name='password'
                    placeholder='Enter password'
                    value={password}
                    onChange={(event) => {
                      if (passwordTooltipIsOpen) {
                        setPasswordTooltipIsOpen(false);
                      }

                      setPassword(event.target.value);
                      if (passwordError) setPasswordError('');
                    }}
                    backgroundColor={'white'}
                    onClick={() => {
                      if (password.length) return;
                      setPasswordTooltipIsOpen(true);
                    }}
                  />
                </PopoverTrigger>
                <Portal>
                  <PopoverContent>
                    <PopoverArrow />
                    <PopoverHeader>Generate Secure Password</PopoverHeader>
                    <PopoverCloseButton
                      onClick={() => setPasswordTooltipIsOpen(false)}
                    />
                    <PopoverBody
                      justifyContent={'center'}
                      alignItems={'center'}
                      display={'flex'}
                    >
                      <Button
                        isLoading={loadingGeneratePassword}
                        disabled={loadingGeneratePassword}
                        size='sm'
                        colorScheme='gray'
                        onClick={handleGenerateSecurePassword}
                      >
                        Generate
                      </Button>
                    </PopoverBody>
                    <PopoverFooter>
                      <Text fontSize={'sm'}>
                        This will generate a secure password of 12 characters
                        for you.
                      </Text>
                    </PopoverFooter>
                  </PopoverContent>
                </Portal>
              </Popover>
              <InputRightElement width='4.5rem'>
                <Button
                  h='1.75rem'
                  size='sm'
                  onClick={() => setShowPass(!showPass)}
                >
                  {showPass ? 'Hide' : 'Show'}
                </Button>
              </InputRightElement>
            </InputGroup>
            <div className='[&>div]:mt-1 [&>div]:mb-1 flex gap-2 select-none'>
              <FormErrorMessage>{passwordError}</FormErrorMessage>
              {!!passwordError && (
                <div>
                  <Tooltip
                    bg='red.600'
                    label={passwordRegexMessage}
                    isOpen={passTooltipIsOpen}
                    hasArrow
                    data-testid='info-icon'
                    onMouseEnter={passTooltipOnOpen}
                    onMouseLeave={passTooltipOnClose}
                    onClick={passTooltipOnToggle}
                  >
                    <InfoIcon color='red.600' />
                  </Tooltip>
                </div>
              )}
            </div>
          </div>
        </FormControl>

        <FormControl isInvalid={!!confirmPassError}>
          <div className='flex flex-col w-full pb-4 '>
            <InputGroup size='md'>
              <Input
                pr='4.5rem'
                type={showConfirmPass ? 'text' : 'password'}
                name='password'
                placeholder='Confirm password'
                value={confirmPassword}
                onChange={(event) => {
                  setConfirmPassword(event.target.value);
                  if (confirmPassError) setConfirmPassError('');
                }}
                backgroundColor={'white'}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    handleSignUp();
                  }
                }}
              />
              <InputRightElement width='4.5rem'>
                <Button
                  h='1.75rem'
                  size='sm'
                  onClick={() => setShowConfirmPass(!showConfirmPass)}
                >
                  {showConfirmPass ? 'Hide' : 'Show'}
                </Button>
              </InputRightElement>
            </InputGroup>
            <div className='[&>div]:mt-1 [&>div]:mb-1 select-none'>
              <FormErrorMessage>{confirmPassError}</FormErrorMessage>
            </div>
          </div>
        </FormControl>

        <div className='flex gap-4'>
          <Button
            colorScheme='blue'
            onClick={() => handleSignUp()}
            isDisabled={
              !email ||
              !password ||
              !confirmPassword ||
              !!emailError ||
              !!passwordError ||
              !!confirmPassError
            }
            isLoading={signUpMutation.isPending}
          >
            Sign Up
          </Button>
        </div>
      </div>
    </>
  );
};
