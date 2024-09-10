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
import { BiLock } from 'react-icons/bi';

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
              Reset Password
            </Text>
          </div>
        </div>

        <div className='flex w-full pb-4 gap-2 items-center'>
          <div className='[&>p]:px-3 [&>p]:py-[6px] [&>p]:w-full [&>p]:bg-slate-200 [&>p]:rounded-lg'>
            <Text fontSize='medium'>Email: {recoveryEmail}</Text>
          </div>
        </div>

        <div className='flex flex-col w-full pb-6 items-center'>
          <HStack>
            <PinInput
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

        <div className='flex gap-4'>
          <Button
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
        </div>
      </div>
    </div>
  );
};

export default ValidateRecoveryCode;
