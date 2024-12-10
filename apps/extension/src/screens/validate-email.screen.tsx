import React, { useEffect, useState } from 'react';
import { Button, IconButton, Input, Text, useToast } from '@chakra-ui/react';
import { RepeatIcon, Icon } from '@chakra-ui/icons';
import { LuLogIn } from 'react-icons/lu';
import { useLocation } from 'wouter';

import { useAuthStore } from '../store';
import { ServerUrlEditable } from '../components';
import { useResendCode, useVerifyCode } from '../hooks';

export const ValidateEmailScreen: React.FC<object> = () => {
  const { deviceKey } = useAuthStore((state) => state);
  const [, navigate] = useLocation();
  const [verificationCode, setVerificationCode] = useState('');
  const toast = useToast();

  const { resendCodeMutation } = useResendCode();
  const { verificationCodeMutation } = useVerifyCode();

  useEffect(() => {
    if (verificationCodeMutation.isSuccess) {
      navigate('/navigation-entries');
    }

    if (verificationCodeMutation.isError) {
      toast({
        title: 'Verification failed',
        description: 'Invalid verification code. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  }, [
    verificationCodeMutation.isSuccess,
    verificationCodeMutation.isError,
    navigate,
    toast,
  ]);

  const handleEmailVerification = () => {
    verificationCodeMutation.mutate({
      deviceKey,
      verificationCode,
      userAgent: window.navigator.userAgent,
      userAgentData: JSON.stringify(window?.navigator?.userAgentData || '{}'),
    });
  };

  return (
    <div className='flex flex-col p-8 pt-10 items-center w-full'>
      <div className='flex w-full justify-start pb-4 gap-4 items-center'>
        <IconButton aria-label='Back icon' onClick={() => navigate('/login')}>
          <Icon className='rotate-180' as={LuLogIn} boxSize={5} />
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
          onChange={(event) =>
            setVerificationCode(event.target.value.replace(/\D/g, ''))
          }
          backgroundColor={'white'}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              handleEmailVerification();
            }
          }}
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
          onClick={handleEmailVerification}
          isLoading={verificationCodeMutation.isPending}
          loadingText='Verifying email'
        >
          Validate
        </Button>
      </div>
    </div>
  );
};
