import React, { useEffect, useState } from 'react';
import { Button, IconButton, Input, Text } from '@chakra-ui/react';
import { RepeatIcon, Icon } from '@chakra-ui/icons';
import { LuLogIn } from 'react-icons/lu';

import { useAuthStore, useNavigation } from '../store';
import { ServerUrlEditable } from '../components';
import { useResendCode, useVerifyCode } from '../hooks';

export const ValidateEmailScreen: React.FC<{}> = () => {
  const { deviceKey } = useAuthStore((state) => state);

  const { navigateTo } = useNavigation();
  const [verificationCode, setVerificationCode] = useState('');

  const { resendCodeMutation } = useResendCode();
  const { verificationCodeMutation } = useVerifyCode();

  useEffect(() => {
    if (verificationCodeMutation.isSuccess) {
      navigateTo('navigation-entries');
    }
  }, [verificationCodeMutation.isSuccess]);

  return (
    <>
      <div className='flex flex-col p-8 pt-10 items-center w-full'>
        <div className='flex w-full justify-start pb-4 gap-4 items-center'>
          <IconButton aria-label='Back icon'>
            <Icon
              className='rotate-180'
              as={LuLogIn}
              boxSize={5}
              onClick={() => {
                navigateTo('login');
              }}
            />
          </IconButton>
          <div className='flex w-full justify-center pr-[40px]'>
            <Text fontSize={'xx-large'} fontWeight={'bold'}>
              Validate Account
            </Text>
          </div>
        </div>

        <div className='pb-4 flex w-full'>
          <ServerUrlEditable />
        </div>

        <div className='flex flex-col w-full pb-2'>
          <Input
            type='text'
            name='verification-code'
            placeholder='Verification code'
            value={verificationCode}
            onChange={(event) => {
              setVerificationCode(event.target.value.replace(/\D/g, ''));
            }}
            backgroundColor={'white'}
          />
        </div>

        <div className='flex flex-row gap-2 w-full pb-4'>
          <Button
            leftIcon={<RepeatIcon />}
            colorScheme='blue'
            variant='gray'
            size='sm'
            onClick={() => resendCodeMutation.mutate()}
            isLoading={resendCodeMutation.isPending}
            loadingText='Sending email...'
          >
            Resend Email
          </Button>
        </div>

        <div className='flex gap-4'>
          <Button
            colorScheme='blue'
            isDisabled={!verificationCode}
            onClick={() =>
              verificationCodeMutation.mutate({
                deviceKey,
                verificationCode,
                userAgent: window.navigator.userAgent,
                userAgentData: JSON.stringify(
                  (window as any)?.navigator?.userAgentData || '{}',
                ),
              })
            }
            isLoading={verificationCodeMutation.isPending}
            loadingText='Verifying email'
          >
            Validate
          </Button>
        </div>
      </div>
    </>
  );
};
