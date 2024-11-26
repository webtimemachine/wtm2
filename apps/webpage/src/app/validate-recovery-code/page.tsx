'use client';

import React, { useEffect, useState } from 'react';
import {
  Button,
  IconButton,
  HStack,
  PinInput,
  PinInputField,
  Text,
} from '@chakra-ui/react';
import { Icon } from '@chakra-ui/icons';
import { LuLogIn } from 'react-icons/lu';

import { useValidateRecoveryCode } from '@/hooks';
import { useAuthStore, useNavigation } from '@/store';

import { AuthLayout } from '@/components/auth-layout';

const ValidateRecoveryCode: React.FC<{}> = () => {
  const [recoveryCode, setRecoveryCode] = useState('');

  const { navigateTo } = useNavigation();
  const { recoveryEmail, notifyRecoveryCodeValidated } = useAuthStore(
    (state) => state,
  );

  const { validateRecoveryCodeMutation } = useValidateRecoveryCode();

  useEffect(() => {
    if (validateRecoveryCodeMutation.isSuccess) {
      navigateTo('recovery-new-password');
      notifyRecoveryCodeValidated();
    }
  }, [validateRecoveryCodeMutation.isSuccess]);

  const handlePinChange = (value: string) => {
    setRecoveryCode(value);
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
            Reset Password
          </Text>
        </div>
      </div>

      <div className='flex w-full pb-4 gap-2 items-center'>
        <div className='[&>p]:px-3 [&>p]:py-[6px] [&>p]:w-full [&>p]:border [&>p]:border-[#E2E8F0] w-full [&>p]:rounded-lg'>
          <Text fontSize='medium'>Email: {recoveryEmail}</Text>
        </div>
      </div>

      <div className='flex flex-col w-full pb-6 items-center'>
        <HStack>
          <PinInput
            colorScheme='blue'
            otp
            value={recoveryCode}
            onChange={handlePinChange}
            isInvalid={recoveryCode.length !== 6}
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

      <Button
        className='mt-auto w-full'
        colorScheme='blue'
        isDisabled={recoveryCode.length !== 6}
        onClick={() =>
          validateRecoveryCodeMutation.mutate({
            email: recoveryEmail,
            recoveryCode,
          })
        }
        isLoading={validateRecoveryCodeMutation.isPending}
        loadingText='Validating code'
      >
        Continue
      </Button>
    </AuthLayout>
  );
};

export default ValidateRecoveryCode;
