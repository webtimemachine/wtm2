import React, { useEffect, useState } from 'react';
import { Button, IconButton, Input, Text } from '@chakra-ui/react';
import { Icon } from '@chakra-ui/icons';
import { LuLogIn } from 'react-icons/lu';

import { useValidateRecoveryCode } from '../hooks';
import { useAuthStore, useNavigation } from '../store';

export const ValidateRecoveryCode: React.FC<{}> = () => {
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
              Reset Password
            </Text>
          </div>
        </div>

        <div className='flex w-full pb-4 gap-2 items-center'>
          <div className='[&>p]:px-3 [&>p]:py-[6px] [&>p]:w-full [&>p]:bg-slate-200 [&>p]:rounded-lg'>
            <Text fontSize='medium'>Email: {recoveryEmail}</Text>
          </div>
        </div>

        <div className='flex flex-col w-full pb-6'>
          <Input
            type='text'
            name='recovery-code'
            placeholder='Recovery code'
            value={recoveryCode}
            onChange={(event) => {
              setRecoveryCode(event.target.value.replace(/\D/g, ''));
            }}
            backgroundColor={'white'}
          />
        </div>

        <div className='flex gap-4'>
          <Button
            colorScheme='blue'
            isDisabled={!recoveryCode}
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
    </>
  );
};
