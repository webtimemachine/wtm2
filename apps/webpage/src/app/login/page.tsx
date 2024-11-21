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
import { isLoginRes } from '@wtm/api';

import clsx from 'clsx';
import { readAuthStateFromLocal } from '../../store/auth.store';
import { AtSignIcon, LockIcon } from '@chakra-ui/icons';
import Link from 'next/link';
import { AuthLayout } from '../../components/auth-layout';

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
      navigateTo('navigation-entries');
    }
  }, [authState]);

  return (
    <AuthLayout>
      <Link href='/'>
        <Text fontSize={'xx-large'} fontWeight={'bold'}>
          WebTM<span className='text-[#3182CE]'>.</span>
        </Text>
      </Link>

      <div className='flex flex-col gap-1 w-full'>
        <div className='pb-4 flex w-full'>
          <ServerUrlEditable />
        </div>
        <FormControl isInvalid={!!emailError}>
          <div
            className={clsx(['flex flex-col w-full', !emailError && 'pb-4'])}
          >
            <InputGroup colorScheme='blue'>
              <InputLeftAddon bgColor={'blue.500'} textColor={'white'}>
                <AtSignIcon />
              </InputLeftAddon>
              <Input
                type='text'
                name='email'
                colorScheme='blue'
                placeholder='Email'
                value={email}
                autoCapitalize={'off'}
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

        <div className='flex flex-col w-full'>
          <InputGroup size='md' colorScheme='blue'>
            <InputLeftAddon bgColor={'blue.500'} textColor={'white'}>
              <LockIcon />
            </InputLeftAddon>
            <Input
              pr='4.5rem'
              type={showPass ? 'text' : 'password'}
              colorScheme='blue'
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
                colorScheme='blue'
                onClick={() => setShowPass(!showPass)}
              >
                {showPass ? 'Hide' : 'Show'}
              </Button>
            </InputRightElement>
          </InputGroup>
        </div>

        <div className='flex flex-row w-full justify-between mt-2'>
          <Text
            fontSize={'small'}
            className='hover:cursor-pointer hover:underline font-medium hover:text-[#3182CE] hover:font-bold'
            onClick={() => navigateTo('forgot-password')}
          >
            Forgot password?
          </Text>
        </div>
      </div>
      <div className='flex gap-2 w-full mt-auto'>
        <Button
          onClick={() => handleLogin()}
          isDisabled={!email || !password || !!emailError}
          isLoading={loginMutation.isPending}
          className='w-full'
          colorScheme='blue'
        >
          Sign In
        </Button>
        <Button
          colorScheme='blue'
          variant={'outline'}
          isLoading={loginMutation.isPending}
          className='w-full'
          onClick={() => navigateTo('sign-up')}
        >
          Sign Up
        </Button>
      </div>
    </AuthLayout>
  );
};
export default LoginScreen;
