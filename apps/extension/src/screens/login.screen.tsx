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
import { useLogin, useExtensionNavigation } from '../hooks';
import { useAuthStore } from '../store';
import { isLoginRes, LoginResponse } from '@wtm/api';

import clsx from 'clsx';
import { updateIcon } from '../utils/updateIcon';
import { apiClient } from '../utils/api.client';

import { ROUTES } from '../hooks/use-extension-navigation';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FRONTEND_URL = 'http://localhost:3000';

interface NavigatorUABrandVersion {
  brand: string;
  version: string;
}

interface NavigatorUAData {
  brands: NavigatorUABrandVersion[];
  mobile: boolean;
  platform: string;
  getHighEntropyValues(hints: string[]): Promise<Record<string, string>>;
  toJSON(): object;
}

declare global {
  interface Navigator {
    userAgentData?: NavigatorUAData;
  }
}

export const LoginScreen: React.FC = () => {
  updateIcon(false);

  const deviceKey = useAuthStore((state) => state.deviceKey);
  const { loginMutation } = useLogin();
  const { navigateTo } = useExtensionNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [emailError, setEmailError] = useState('');

  const [loadingExternalLogin, setLoadingExternalLogin] = useState(false);

  const validateInputs = () => {
    let emailErrorFound = false;

    if (!email) {
      setEmailError('Email is required');
      emailErrorFound = true;
    } else if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      emailErrorFound = true;
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
        userAgentData: JSON.stringify(window?.navigator?.userAgentData || '{}'),
      };
      loginMutation.mutate(loginData);
    }
  };

  const handleExternalLogin = async () => {
    try {
      setLoadingExternalLogin(true);

      const response = await apiClient.retrieveExternalLoginToken({
        externalClientId: btoa(chrome.runtime.id),
        deviceKey,
        userAgent: window.navigator.userAgent,
        userAgentData: JSON.stringify(window?.navigator?.userAgentData || '{}'),
      });

      const webUrl = new URL(FRONTEND_URL + '/external-login');
      webUrl.searchParams.append(
        'externalClientToken',
        response.externalClientToken,
      );
      webUrl.searchParams.append(
        'redirect',
        'chrome-extension://' + chrome.runtime.id + '/index.html',
      );

      chrome.tabs.create({
        url: webUrl.toString(),
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingExternalLogin(false);
    }
  };

  useEffect(() => {
    const processLogin = async (data: LoginResponse) => {
      const { serverUrl } = await chrome.storage.local.get(['serverUrl']);

      const message = {
        refreshToken: data.refreshToken,
        backUrl: serverUrl,
        isLogin: true,
      };

      chrome.runtime.sendNativeMessage('com.ttt246llc.wtm', message);

      navigateTo(ROUTES.NAVIGATION_ENTRIES);
    };

    if (loginMutation.isSuccess) {
      if (isLoginRes(loginMutation.data)) {
        processLogin(loginMutation.data);
      } else {
        navigateTo(ROUTES.VALIDATE_EMAIL);
      }
    }
  }, [loginMutation.isSuccess, loginMutation.data, navigateTo]);

  return (
    <div className='flex flex-col p-8 pt-10 items-center w-full'>
      <div className='pb-4'>
        <Text id='extension-login-header' fontSize='xx-large' fontWeight='bold'>
          WebTM
        </Text>
      </div>

      <div className='pb-4 flex w-full'>
        <ServerUrlEditable />
      </div>

      <FormControl isInvalid={!!emailError}>
        <div className={clsx(['flex flex-col w-full', !emailError && 'pb-4'])}>
          <Input
            type='text'
            name='email'
            placeholder='Email'
            value={email}
            autoCapitalize='off'
            onChange={(event) => {
              setEmail(event.target.value);
              if (emailError) setEmailError('');
            }}
            backgroundColor='white'
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
            backgroundColor='white'
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                handleLogin();
              }
            }}
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
          fontSize='small'
          className='hover:cursor-pointer hover:underline'
          onClick={() => navigateTo(ROUTES.FORGOT_PASSWORD)}
        >
          Forgot password?
        </Text>
        <Text
          fontSize='small'
          className='hover:cursor-pointer hover:underline'
          onClick={() => navigateTo(ROUTES.SIGN_UP)}
        >
          Sign up
        </Text>
      </div>

      <div className='flex gap-4'>
        <Button
          colorScheme='blue'
          onClick={handleLogin}
          isDisabled={!email || !password || !!emailError}
          isLoading={loginMutation.isPending}
        >
          Sign In
        </Button>
      </div>
    </div>
  );
};
