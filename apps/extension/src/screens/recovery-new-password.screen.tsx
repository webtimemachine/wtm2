import React, { useEffect, useState } from 'react';
import {
  Button,
  FormControl,
  IconButton,
  Input,
  InputGroup,
  Text,
  InputRightElement,
  useDisclosure,
  FormErrorMessage,
  Tooltip,
} from '@chakra-ui/react';
import { Icon, InfoIcon } from '@chakra-ui/icons';
import { LuLogIn } from 'react-icons/lu';

import { useAuthStore, useNavigation } from '../store';
import { useRestorePassword } from '../hooks';

const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[^\s]{8,20}$/;
const passwordRegexMessage =
  'Password must be between 8 and 20 characters long and contain at least one uppercase letter, one lowercase letter, and one digit. Spaces are not allowed.';

export const RecoveryNewPassword: React.FC<{}> = () => {
  const { navigateTo } = useNavigation();
  const { recoveryEmail, deviceKey } = useAuthStore((state) => state);
  const { restorePasswordMutation } = useRestorePassword();

  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [confirmPassword, setConformPassword] = useState('');
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const [passwordError, setPasswordError] = useState('');
  const [confirmPassError, setConfirmPassError] = useState('');

  const {
    isOpen: passTooltipIsOpen,
    onOpen: passTooltipOnOpen,
    onClose: passTooltipOnClose,
    onToggle: passTooltipOnToggle,
  } = useDisclosure();

  const validateInputs = () => {
    let emailErrorFound = false;
    let passwordErrorFound = false;
    let confirmPassErrorFound = false;

    if (!password) {
      setPasswordError('Password is required');
      passwordErrorFound = true;
    } else {
      if (!passwordRegex.test(password)) {
        setPasswordError('Please enter a valid password');
        passwordErrorFound = true;
      }
    }

    if (!confirmPassword) {
      setConfirmPassError('Confirmation password is required');
      confirmPassErrorFound = true;
    } else {
      if (confirmPassword !== password) {
        setConfirmPassError('Confirmation password must be equal to Password');
        confirmPassErrorFound = true;
      }
    }

    return emailErrorFound || passwordErrorFound || confirmPassErrorFound;
  };

  const handleRestorePassword = () => {
    const errorsFound = validateInputs();
    if (!errorsFound) {
      restorePasswordMutation.mutate({
        password,
        verificationPassword: confirmPassword,
        deviceKey,
        userAgent: window.navigator.userAgent,
        userAgentData: JSON.stringify(
          (window as any)?.navigator?.userAgentData || '{}',
        ),
      });
    }
  };

  useEffect(() => {
    if (restorePasswordMutation.isSuccess) {
      navigateTo('navigation-entries');
    }
  }, [restorePasswordMutation.isSuccess]);

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
              New Password
            </Text>
          </div>
        </div>

        <div className='flex w-full pb-4 gap-2 items-center'>
          <div className='[&>p]:px-3 [&>p]:py-[6px] [&>p]:w-full [&>p]:bg-slate-200 [&>p]:rounded-lg'>
            <Text fontSize='medium'>Email: {recoveryEmail}</Text>
          </div>
        </div>

        <FormControl isInvalid={!!passwordError}>
          <div className='flex flex-col w-full pb-4'>
            <InputGroup size='md'>
              <Input
                pr='4.5rem'
                type={showPass ? 'text' : 'password'}
                name='password'
                placeholder='Enter password'
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  if (passwordError) setPasswordError('');
                }}
                backgroundColor={'white'}
              />
              <InputRightElement width='4.5rem'>
                <Button
                  h='1.75rem'
                  size='sm'
                  onClick={() => setShowPass(!showPass)}
                >
                  {showPass ? 'Hide' : 'Show'}
                </Button>
              </InputRightElement>
            </InputGroup>
            <div className='[&>div]:mt-1 [&>div]:mb-1 flex gap-2 select-none'>
              <FormErrorMessage>{passwordError}</FormErrorMessage>
              {!!passwordError && (
                <div>
                  <Tooltip
                    bg='red.600'
                    label={passwordRegexMessage}
                    isOpen={passTooltipIsOpen}
                    hasArrow
                  >
                    <InfoIcon
                      color='red.600'
                      onMouseEnter={passTooltipOnOpen}
                      onMouseLeave={passTooltipOnClose}
                      onClick={passTooltipOnToggle}
                    />
                  </Tooltip>
                </div>
              )}
            </div>
          </div>
        </FormControl>

        <FormControl isInvalid={!!confirmPassError}>
          <div className='flex flex-col w-full pb-4'>
            <InputGroup size='md'>
              <Input
                pr='4.5rem'
                type={showConfirmPass ? 'text' : 'password'}
                name='password'
                placeholder='Confirm password'
                value={confirmPassword}
                onChange={(event) => {
                  setConformPassword(event.target.value);
                  if (confirmPassError) setConfirmPassError('');
                }}
                backgroundColor={'white'}
              />
              <InputRightElement width='4.5rem'>
                <Button
                  h='1.75rem'
                  size='sm'
                  onClick={() => setShowConfirmPass(!showConfirmPass)}
                >
                  {showConfirmPass ? 'Hide' : 'Show'}
                </Button>
              </InputRightElement>
            </InputGroup>
            <div className='[&>div]:mt-1 [&>div]:mb-1 select-none'>
              <FormErrorMessage>{confirmPassError}</FormErrorMessage>
            </div>
          </div>
        </FormControl>

        <div className='flex gap-4 pt-2'>
          <Button
            colorScheme='blue'
            onClick={() => handleRestorePassword()}
            isDisabled={
              !password ||
              !!passwordError ||
              !confirmPassword ||
              !!confirmPassError
            }
            isLoading={restorePasswordMutation.isPending}
            loadingText='Updating'
          >
            Update Password
          </Button>
        </div>
      </div>
    </>
  );
};
