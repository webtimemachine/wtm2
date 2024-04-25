import React, { useEffect } from 'react';
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
import { useAuthStore, useNavigationStore } from '../store';

import clsx from 'clsx';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const LoginScreen: React.FC<{}> = () => {
  const deviceKey = useAuthStore((state) => state.deviceKey);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  const { loginMutation } = useLogin();
  const { navigateTo } = useNavigationStore();

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPass, setShowPass] = React.useState(false);

  const [emailError, setEmailError] = React.useState('');

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
      };
      loginMutation.mutate(loginData);
    }
  };

  useEffect(() => {
    if (isLoggedIn) navigateTo('navigation-entries');
  }, [isLoggedIn]);

  useEffect(() => {
    if (loginMutation.isSuccess) {
      navigateTo('navigation-entries');
    }
  }, [loginMutation.isSuccess]);

  return (
    <>
      <div className='flex flex-col p-8 pt-5 bg-slate-100 min-h-screen justify-center items-center w-full'>
        <div className='pb-12'>
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
          >
            Recovery password
          </Text>
          <Text
            fontSize={'small'}
            className='hover:cursor-pointer hover:underline'
            onClick={() => {
              navigateTo('sign-up');
            }}
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
