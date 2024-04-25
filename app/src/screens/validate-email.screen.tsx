import React, { useState } from 'react';
import { Button, IconButton, Input, Text } from '@chakra-ui/react';
import { ServerUrlEditable } from '../components';
// import { useSignUp } from '../hooks';

import clsx from 'clsx';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { useAuthStore, useNavigationStore } from '../store';

export const ValidateEmailScreen: React.FC<{}> = () => {
  // const { signUpMutation } = useSignUp();
  const { navigateBack } = useNavigationStore();
  const setIsValidatingEmail = useAuthStore(
    (state) => state.setIsValidatingEmail,
  );

  const [verificationCode, serVerificationCode] = useState('');

  const handleValidate = () => {
    // signUpMutation.mutate({
    //   email,
    //   password,
    // });

    console.log('handleValidate');
  };

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

        <div className={clsx(['flex flex-col w-full pb-4'])}>
          <Input
            type='text'
            name='verification-code'
            placeholder='Verification code'
            value={verificationCode}
            onChange={(event) => {
              serVerificationCode(event.target.value);
            }}
            backgroundColor={'white'}
          />
        </div>

        <div className='flex flex-row gap-2 w-full pb-4'>
          <Text fontSize={'small'}>Didn't found the verification code?</Text>
          <Text
            fontSize={'small'}
            className='hover:cursor-pointer hover:underline'
            onClick={() => console.log('AAAAA')}
          >
            Resend Code
          </Text>
        </div>
        <div className='flex gap-4'>
          <Button
            colorScheme='blue'
            onClick={() => handleValidate()}
            isDisabled={!verificationCode}
            // isLoading={signUpMutation.isPending}
          >
            Validate
          </Button>
        </div>
      </div>
    </>
  );
};
