import React, { useState, useEffect } from 'react';
import {
  Button,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  FormControl,
  FormErrorMessage,
} from '@chakra-ui/react';
import { ServerUrlEditable } from '../components';
import { useLogin } from '../hooks';
import { useAuthStore, useNavigation } from '../store';
import { isLoginRes } from 'wtm-lib/interfaces';

import clsx from 'clsx';
import { updateIcon } from '../utils/updateIcon';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const LoginScreen: React.FC<{}> = () => {
  updateIcon(false);

  const deviceKey = useAuthStore((state) => state.deviceKey);

  const { loginMutation } = useLogin();
  const { navigateTo } = useNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  const [emailError, setEmailError] = useState('');

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

  return (
    <>
      <div className='flex flex-col p-8 pt-10 items-center w-full'>
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
            <div className='[&>div]:mt-1 [&>div]:mb-1'>
              <FormErrorMessage>{emailError}</FormErrorMessage>
            </div>
          </div>
        </FormControl>

        <div className='flex flex-col w-full pb-4'>
          <InputGroup size='md'>
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
    </>
  );
};
