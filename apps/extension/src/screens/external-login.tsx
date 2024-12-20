import React, { useEffect } from 'react';
import { Button, Text } from '@chakra-ui/react';
import { useExtensionNavigation, useGetBasicUserInformation } from '../hooks';
import { useAuthStore } from '../store';
import { readAuthStateFromLocal } from '../store/auth.store';
import { ExtensionRoutes } from '../hooks/use-extension-navigation';

export const ExternalLoginScreen: React.FC = () => {
  const { currentRoute, navigateTo } = useExtensionNavigation();

  const { basicUserInformationQuery } = useGetBasicUserInformation();

  const authState = readAuthStateFromLocal();

  const searchParamsString = currentRoute.split('?')[1] || '';
  const params = new URLSearchParams(searchParamsString);
  const credentialsParam = params.get('c');
  const credentials = JSON.parse(atob(credentialsParam || ''));

  const { externalLogin } = useAuthStore((state) => state);

  useEffect(() => {
    console.log('credentials', credentials);

    if (
      credentials.accessToken &&
      credentials.refreshToken &&
      !authState?.isLoggedIn
    ) {
      externalLogin(credentials.accessToken, credentials.refreshToken);
    }
  }, [credentials.accessToken, credentials.refreshToken]);

  return (
    <div className='flex flex-col p-8 pt-10 items-center w-full'>
      <div className='pb-4'>
        <Text id='extension-login-header' fontSize='xx-large' fontWeight='bold'>
          WebTM
        </Text>
      </div>

      {basicUserInformationQuery.isLoading ? (
        <div>Loading...</div>
      ) : basicUserInformationQuery.isError ? (
        <div>
          <Text>Error</Text>
        </div>
      ) : (
        <div>
          <Text>Welcome! {basicUserInformationQuery.data?.email}</Text>
          <Button
            onClick={() => navigateTo(ExtensionRoutes.NAVIGATION_ENTRIES)}
          >
            Go to home
          </Button>
        </div>
      )}
    </div>
  );
};
