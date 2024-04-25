import React, { useEffect, useState } from 'react';
import { Button, IconButton, Input, Text } from '@chakra-ui/react';
import { ArrowBackIcon, RepeatIcon } from '@chakra-ui/icons';

import { useAuthStore, useNavigationStore } from '../store';
import { ServerUrlEditable } from '../components';
import { useResendCode, useVerifyCode } from '../hooks';

export const ValidateEmailScreen: React.FC<{}> = () => {
  const { navigateBack, navigateTo } = useNavigationStore();
  const { setIsValidatingEmail, deviceKey } = useAuthStore((state) => state);
  const [verificationCode, serVerificationCode] = useState('');

  const { resendCodeMutation } = useResendCode();
  const { verificationCodeMutation } = useVerifyCode();

  useEffect(() => {
    if (verificationCodeMutation.isSuccess)
      if (verificationCodeMutation.data) {
        navigateTo('navigation-entries');
      } else {
        navigateTo('validate-email');
      }
  }, [verificationCodeMutation.isSuccess, verificationCodeMutation.data]);

  return (
    <>
      <div className='flex flex-col p-8 pt-10 bg-slate-100 min-h-screen items-center w-full'>
        <div className='flex w-full justify-start pb-4 gap-4 items-center'>
          <IconButton aria-label='Back icon'>
            <ArrowBackIcon
              boxSize={5}
              onClick={() => {
                setIsValidatingEmail(false);
                navigateBack();
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
              serVerificationCode(event.target.value.replace(/\D/g, ''));
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
