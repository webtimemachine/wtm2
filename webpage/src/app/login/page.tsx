'use client';

import React, { useState, useEffect } from 'react';
import {
  Button,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  FormControl,
  FormErrorMessage,
  InputLeftAddon,
} from '@chakra-ui/react';
import { ServerUrlEditable } from '../../components';
import { useLogin } from '../../hooks';
import { useAuthStore, useNavigation } from '../../store';
import { isLoginRes } from '../../interfaces/login.interface';

import clsx from 'clsx';
import { readAuthStateFromLocal } from '../../store/auth.store';
import { AtSignIcon, LockIcon } from '@chakra-ui/icons';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const LoginScreen: React.FC<{}> = () => {
  const deviceKey = useAuthStore((state) => state.deviceKey);

  const { loginMutation } = useLogin();
  const { navigateTo } = useNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  const [emailError, setEmailError] = useState('');

  const authState = readAuthStateFromLocal();
  const { navigateTo: navigateToScreen } = useNavigation();

  const validateInputs = () => {
    let emailErrorFound = false;

    if (!email) {
      setEmailError('Email is required');
      emailErrorFound = true;
    } else {
      if (!emailRegex.test(email)) {
        setEmailError('Please enter a valid email address');
        emailErrorFound = true;
      }
    }

    return emailErrorFound;
  };

  const handleLogin = () => {
    const errorsFound = validateInputs();
    if (!errorsFound) {
      const loginData = {
        email,
        password,
        deviceKey,
        userAgent: window.navigator.userAgent,
        userAgentData: JSON.stringify(
          (window as any)?.navigator?.userAgentData || '{}',
        ),
      };
      loginMutation.mutate(loginData);
    }
  };

  useEffect(() => {
    if (loginMutation.isSuccess)
      if (isLoginRes(loginMutation.data)) {
        navigateTo('navigation-entries');
      } else {
        navigateTo('validate-email');
      }
  }, [loginMutation.isSuccess, loginMutation.data]);
  // For redirection if user is logged in.
  useEffect(() => {
    if (authState && authState.isLoggedIn) {
      navigateToScreen('navigation-entries');
    }
  }, [authState]);

  return (
    <div className='flex justify-center items-center h-screen'>
      <div className='flex flex-col p-3 md:p-8 py-10 items-center md:h-1/3 max-w-6xl min-w-[360px] w-1/3 md:min-h-[500px] bg-white rounded-md shadow-2xl transition-shadow filter drop-shadow'>
        <div className='pb-4'>
          <Text fontSize={'xx-large'} fontWeight={'bold'}>
            WebTM
          </Text>
        </div>
        <div className='pb-4 flex w-full'>
          <ServerUrlEditable />
        </div>

        <FormControl isInvalid={!!emailError}>
          <div
            className={clsx(['flex flex-col w-full', !emailError && 'pb-4'])}
          >
            <InputGroup>
              <InputLeftAddon>
                <AtSignIcon />
              </InputLeftAddon>
              <Input
                type='text'
                name='email'
                placeholder='Email'
                value={email}
                autoCapitalize='false'
                onChange={(event) => {
                  setEmail(event.target.value);
                  if (emailError) setEmailError('');
                }}
                backgroundColor={'white'}
              />
            </InputGroup>
            <div className='[&>div]:mt-1 [&>div]:mb-1'>
              <FormErrorMessage>{emailError}</FormErrorMessage>
            </div>
          </div>
        </FormControl>

        <div className='flex flex-col w-full pb-4'>
          <InputGroup size='md'>
            <InputLeftAddon>
              <LockIcon />
            </InputLeftAddon>
            <Input
              pr='4.5rem'
              type={showPass ? 'text' : 'password'}
              name='password'
              placeholder='Enter password'
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              backgroundColor={'white'}
            />
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
        </div>

        <div className='flex flex-row w-full justify-between pb-4'>
          <Text
            fontSize={'small'}
            className='hover:cursor-pointer hover:underline'
            onClick={() => navigateTo('forgot-password')}
          >
            Forgot password?
          </Text>
          <Text
            fontSize={'small'}
            className='hover:cursor-pointer hover:underline'
            onClick={() => navigateTo('sign-up')}
          >
            Sign up
          </Text>
        </div>
        <div className='flex gap-4'>
          <Button
            colorScheme='blue'
            onClick={() => handleLogin()}
            isDisabled={!email || !password || !!emailError}
            isLoading={loginMutation.isPending}
          >
            Sign In
          </Button>
        </div>
      </div>
    </div>
  );
};
export default LoginScreen;
