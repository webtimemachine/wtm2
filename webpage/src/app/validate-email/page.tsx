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
    <div className='flex justify-center items-center h-screen'>
      <div className='flex flex-col p-3 md:p-8 py-10 items-center md:h-1/3 max-w-6xl min-w-[360px] w-1/3 md:min-h-[500px] bg-white rounded-md shadow-2xl transition-shadow filter drop-shadow'>
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

        <div className='flex flex-col w-full pb-2 items-center'>
          <Text my={4}>
            {' '}
            Please, insert the <Code fontWeight={600}>code</Code> provided to
            your email.
          </Text>
          <HStack>
            <PinInput
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
            Resend Email Code
          </Button>
        </div>

        <div className='flex gap-4'>
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
          >
            Validate
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ValidateEmailScreen;
