'use client';

import React, { useEffect } from 'react';
import { Text, Spinner } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { useAuthStore, useNavigation } from '@/store';
import { useLoginSharedCredentials } from '@/hooks/use-login-shared-credentials.hook';
import { useSearchParams } from 'next/navigation';

const HoldScreen: React.FC<{}> = () => {
  const { navigateBack, navigateTo } = useNavigation();
  const searchParams = useSearchParams();

  const token = searchParams.get('token');
  const backUrl = searchParams.get('backUrl');

  const { reLoginMutation } = useLoginSharedCredentials(backUrl, token);

  const saveSharedCredentials = useAuthStore(
    (state) => state.saveSharedCredentials,
  );

  useEffect(() => {
    const processCloneUserSession = async () => {
      if (token && backUrl) {
        saveSharedCredentials(backUrl, token);
        reLoginMutation.mutate();
      }
    };
    processCloneUserSession();
  }, []);

  useEffect(() => {
    if (reLoginMutation.isSuccess) {
      navigateTo('navigation-entries');
    }
  }, [reLoginMutation.isSuccess]);

  return (
    <div className='flex justify-center items-center h-screen'>
      <div className='flex flex-col p-3 md:p-8 py-10 items-center md:h-1/3 max-w-6xl min-w-[360px] w-1/3 md:min-h-[500px] bg-white rounded-md shadow-2xl transition-shadow filter drop-shadow'>
        <div className='flex w-full justify-start pb-4 gap-4 items-center'>
          <div className='flex w-full justify-center'>
            <Text fontSize={'xx-large'} fontWeight={'bold'}>
              {`WebTM`}
            </Text>
          </div>
          <div>
            <p></p>
          </div>
        </div>
        <div className='flex w-full items-center justify-center min-h-[300px] mt-4'>
          {token ? <Spinner size={'lg'} /> : 'Please log In into the extension'}
        </div>
      </div>
    </div>
  );
};
export default HoldScreen;
