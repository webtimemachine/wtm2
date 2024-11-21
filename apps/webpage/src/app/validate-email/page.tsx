'use client';

import React, { useEffect, useState } from 'react';
import {
  Button,
  IconButton,
  HStack,
  PinInput,
  PinInputField,
  Text,
  Code,
} from '@chakra-ui/react';
import { RepeatIcon, Icon } from '@chakra-ui/icons';
import { LuLogIn } from 'react-icons/lu';

import { useAuthStore, useNavigation } from '@/store';
import { ServerUrlEditable } from '@/components';
import { useResendCode, useVerifyCode } from '@/hooks';
import { AuthLayout } from '@/components/auth-layout';

const ValidateEmailScreen: React.FC<{}> = () => {
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

  const handlePinChange = (value: string) => {
    setVerificationCode(value);
  };

  return (
    <AuthLayout>
      <div className='flex w-full justify-start pb-4 gap-4 items-center'>
        <IconButton colorScheme='blue' aria-label='Back icon'>
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
          <Text fontSize={'x-large'} fontWeight={'bold'}>
            Validate Account
          </Text>
        </div>
      </div>

      <div className='pb-4 flex w-full'>
        <ServerUrlEditable />
      </div>

      <div className='flex flex-col w-full pb-2 items-center'>
        <Text my={4}>
          {' '}
          Please, insert the{' '}
          <Code colorScheme='blue' fontWeight={600}>
            code
          </Code>{' '}
          provided to your email.
        </Text>
        <HStack>
          <PinInput
            colorScheme='blue'
            otp
            value={verificationCode}
            onChange={handlePinChange}
            isInvalid={verificationCode.length !== 6}
            size='lg'
            placeholder='-'
          >
            <PinInputField />
            <PinInputField />
            <PinInputField />
            <PinInputField />
            <PinInputField />
            <PinInputField />
          </PinInput>
        </HStack>
      </div>

      <div className='flex mt-auto flex-col gap-1 w-full'>
        <Button
          leftIcon={<RepeatIcon />}
          colorScheme='blue'
          variant='outline'
          onClick={() => resendCodeMutation.mutate()}
          isLoading={resendCodeMutation.isPending}
          loadingText='Sending email...'
          className='w-full'
        >
          Resend Email Code
        </Button>

        <Button
          colorScheme='blue'
          isDisabled={verificationCode.length !== 6}
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
          className='w-full'
        >
          Validate
        </Button>
      </div>
    </AuthLayout>
  );
};

export default ValidateEmailScreen;
