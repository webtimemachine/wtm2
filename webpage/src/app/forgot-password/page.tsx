'use client';

import React, { useState, useEffect } from 'react';
import {
  Alert,
  AlertIcon,
  Button,
  FormControl,
  FormErrorMessage,
  IconButton,
  Input,
  Text,
} from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';

import { useAuthStore, useNavigation } from '@/store';
import { ServerUrlEditable } from '@/components';
import clsx from 'clsx';
import { useRecoverPassword } from '@/hooks';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ForgotPasswordScreen: React.FC<{}> = () => {
  const { navigateTo } = useNavigation();

  const notifyRecoveryCodeSent = useAuthStore(
    (state) => state.notifyRecoveryCodeSent,
  );

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const { recoverPasswordMutation } = useRecoverPassword();

  const validateInputs = () => {
    let emailErrorFound = false;

    if (!email) {
      setEmailError('Email is required');
      emailErrorFound = true;
    } else {
      if (!emailRegex.test(email)) {
        setEmailError('Please enter a valid email address');
        emailErrorFound = true;
      }
    }

    return emailErrorFound;
  };

  const sendCode = () => {
    const errorsFound = validateInputs();
    if (!errorsFound) {
      console.log('sendCode');
      recoverPasswordMutation.mutate({ email });
    }
  };

  useEffect(() => {
    if (recoverPasswordMutation.isSuccess) {
      navigateTo('validate-recovery-code');
      notifyRecoveryCodeSent(email);
    }
  }, [recoverPasswordMutation.isSuccess]);

  return (
    <>
      <div className='flex flex-col p-8 pt-10 items-center w-full'>
        <div className='flex w-full justify-start pb-4 gap-4 items-center'>
          <IconButton aria-label='Back icon'>
            <ArrowBackIcon
              boxSize={5}
              onClick={() => {
                navigateTo('login');
              }}
            />
          </IconButton>
          <div className='flex w-full justify-center pr-[40px]'>
            <Text fontSize={'xx-large'} fontWeight={'bold'}>
              Restore Password
            </Text>
          </div>
        </div>

        <div className='w-full pb-4 [&>div]:rounded-lg'>
          <Alert status='info'>
            <AlertIcon />
            <Text fontSize='small'>
              Complete your email to receive a code and start the password
              restoration process.
            </Text>
          </Alert>
        </div>

        <div className='pb-4 flex w-full'>
          <ServerUrlEditable />
        </div>

        <div className='flex flex-col w-full'>
          <FormControl isInvalid={!!emailError}>
            <div className={clsx(['flex flex-col w-full'])}>
              <Input
                type='text'
                name='email'
                placeholder='Email'
                value={email}
                autoCapitalize='false'
                onChange={(event) => {
                  setEmail(event.target.value);
                  if (emailError) setEmailError('');
                }}
                backgroundColor={'white'}
              />
              <div className='min-h-[32px] [&>div]:mt-1 [&>div]:mb-1'>
                <FormErrorMessage>{emailError}</FormErrorMessage>
              </div>
            </div>
          </FormControl>
        </div>

        <div className='flex gap-4'>
          <Button
            colorScheme='blue'
            isDisabled={!email}
            onClick={() => sendCode()}
            isLoading={recoverPasswordMutation.isPending}
            loadingText='Sending code'
          >
            Send code
          </Button>
        </div>
      </div>
    </>
  );
};
export default ForgotPasswordScreen;
