'use client';

import { AuthLayout } from '@/components/auth-layout';
import {
  useGetActiveSessions,
  useGetBasicUserInformation,
  useLogin,
} from '@/hooks';
import { readAuthStateFromLocal } from '@/store/auth.store';
import { apiClient } from '@/utils/api.client';
import { Button, Icon, Spinner, Text } from '@chakra-ui/react';
import { ActiveSession, ExternalClientPayload } from '@wtm/api';
import {
  getBrowserIconFromDevice,
  getSupportedBrowserFromDevice,
} from '@wtm/utils';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

export default function ExternalLogin() {
  const searchParams = useSearchParams();
  const externalClientToken = searchParams.get('externalClientToken') as string;
  const redirectUrl = searchParams.get('redirect') as string;

  console.log(redirectUrl);

  const { basicUserInformationQuery } = useGetBasicUserInformation();
  const { getActiveSessionsQuery } = useGetActiveSessions();
  const { loginMutation } = useLogin();

  const authState = readAuthStateFromLocal();

  const [isLoading, setIsLoading] = useState(false);

  const [externalClientPayload, setExternalClientPayload] =
    useState<ExternalClientPayload>();
  const [currentSession, setCurrentSession] = useState<ActiveSession>();

  const handleContinue = async () => {
    if (!externalClientPayload) return;

    try {
      const response = await apiClient.externalLogin({
        deviceKey: externalClientPayload.deviceKey,
        userAgentData: externalClientPayload.userAgentData,
        userAgent: externalClientPayload.userAgent,
      });

      const url = new URL(redirectUrl);
      url.searchParams.append('c', btoa(JSON.stringify(response)));

      window.open(url.toString(), '_blank');
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const verifyExternalClient = async () => {
      try {
        setIsLoading(true);

        const response =
          await apiClient.verifyExternalClient(externalClientToken);

        setExternalClientPayload(response.payload);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (authState?.isLoggedIn) {
      verifyExternalClient();
    }
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
  }, []);

  const deviceName = useMemo(() => {
    if (!currentSession) {
      return;
    }
    return getSupportedBrowserFromDevice(currentSession.userDevice.device);
  }, [currentSession]);

  return (
    <AuthLayout>
      <Link href='/'>
        <Text fontSize={'xx-large'} fontWeight={'bold'}>
          WebTM<span className='text-[#3182CE]'>.</span>
        </Text>
      </Link>

      {isLoading ? (
        <div className='flex items-center justify-center flex-1'>
          <Spinner />
        </div>
      ) : (
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
    </AuthLayout>
  );
}
