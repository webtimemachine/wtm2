'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import { Button, Icon, Spinner, Text } from '@chakra-ui/react';

import {
  useGetActiveSessions,
  useGetBasicUserInformation,
  useLogin,
} from '@/hooks';

import { readAuthStateFromLocal } from '@/store/auth.store';
import {
  getBrowserIconFromDevice,
  getSupportedBrowserFromDevice,
} from '@wtm/utils';
import { apiClient } from '@/utils/api.client';
import { ActiveSession, ExternalClientPayload } from '@wtm/api';

export const ExternalLoginScreen: React.FC<{}> = () => {
  const searchParams = useSearchParams();
  const externalClientToken = searchParams.get('externalClientToken') as string;

  const { basicUserInformationQuery } = useGetBasicUserInformation();
  const { getActiveSessionsQuery } = useGetActiveSessions();
  const { loginMutation } = useLogin();

  const authState = readAuthStateFromLocal();

  const [userEmail, setUserEmail] = useState<string>();

  const [externalClientPayload, setExternalClientPayload] =
    useState<ExternalClientPayload>();
  const [currentSession, setCurrentSession] = useState<ActiveSession>();

  const [pageState, setPageState] = useState<
    'verifying' | 'loggingIn' | 'error' | 'verified' | 'loggedIn'
  >('verifying');

  const handleContinue = async () => {
    if (!externalClientPayload) return;

    setPageState('loggingIn');

    try {
      const response = await apiClient.externalLogin({
        deviceKey: externalClientPayload.deviceKey,
        userAgentData: externalClientPayload.userAgentData,
        userAgent: externalClientPayload.userAgent,
      });

      setUserEmail(response.user.email);

      window.postMessage(
        {
          type: 'external_login',
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
          serverUrl: authState?.serverUrl,
        },
        window.location.origin,
      );

      setPageState('loggedIn');
    } catch (error) {
      console.log(error);
      setPageState('error');
    }
  };

  useEffect(() => {
    const verifyExternalClient = async () => {
      try {
        const response =
          await apiClient.verifyExternalClient(externalClientToken);

        setExternalClientPayload(response.payload);

        setPageState('verified');
      } catch (error) {
        console.log(error);
        setPageState('error');
      }
    };

    if (authState?.isLoggedIn) {
      setPageState('verified');
    }

    verifyExternalClient();
  }, []);

  useEffect(() => {
    if (getActiveSessionsQuery.data) {
      setCurrentSession(
        getActiveSessionsQuery.data.find(
          (s) => s.userDevice.isCurrentDevice === true,
        ),
      );
    }
  }, [getActiveSessionsQuery.data]);

  const browserIcon = useMemo(() => {
    if (!currentSession) {
      return;
    }
    return getBrowserIconFromDevice(currentSession.userDevice.device);
  }, [currentSession]);

  const deviceName = useMemo(() => {
    if (!currentSession) {
      return;
    }
    return getSupportedBrowserFromDevice(currentSession.userDevice.device);
  }, [currentSession]);

  return (
    <>
      <Link href='/'>
        <Text fontSize={'xx-large'} fontWeight={'bold'}>
          WebTM<span className='text-[#3182CE]'>.</span>
        </Text>
      </Link>

      {(pageState === 'verifying' || pageState === 'loggingIn') && (
        <div className='flex items-center justify-center flex-1'>
          <Spinner />
        </div>
      )}

      {pageState === 'verified' && (
        <div className='flex flex-col w-full gap-1 flex-1 justify-between'>
          <div>
            <Text fontSize={'large'} fontWeight={'bold'}>
              Continue with your current session?
            </Text>
            <Text fontSize={'medium'} color={'gray.500'}>
              You are currently logged in with this device.
            </Text>
          </div>

          <div className='flex gap-1 items-center'>
            <Icon as={browserIcon} boxSize={8} />
            <Text fontSize={'x-large'}>
              {deviceName} -{' '}
              {currentSession?.userDevice.device.uaResult?.os.name}
            </Text>
          </div>

          <Button
            onClick={() => handleContinue()}
            isLoading={loginMutation.isPending}
            className='w-full'
            colorScheme='blue'
          >
            Continue as {basicUserInformationQuery.data?.email}
          </Button>
        </div>
      )}

      {pageState === 'error' && (
        <div className='flex flex-col w-full gap-1 flex-1 justify-center items-center'>
          <Text fontSize={'medium'} color={'gray.500'}>
            An error occurred while verifying your external client.
          </Text>
          <Link href='/'>
            <Button>Go back</Button>
          </Link>
        </div>
      )}

      {pageState === 'loggedIn' && (
        <div className='flex flex-col w-full gap-1 flex-1 justify-center items-center'>
          <Text fontSize={'large'} fontWeight={'bold'}>
            Success
          </Text>
          <Text fontSize={'medium'} color={'gray.500'}>
            You have been logged in successfully as {userEmail}.
          </Text>
        </div>
      )}
    </>
  );
};
