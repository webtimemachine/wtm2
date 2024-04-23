import React, { useEffect } from 'react';
import {
  Button,
  Input,
  InputGroup,
  InputRightElement,
  Text,
} from '@chakra-ui/react';
import { ServerUrlEditable } from '../components';
import { useGetVersion, useLogin, useSayHello } from '../hooks';
import { useAuthStore } from '../store';

export const LoginScreen: React.FC<{}> = () => {
  const deviceKey = useAuthStore((state) => state.deviceKey);

  // TODO remove this testing mutations
  const { sayHelloMutation } = useSayHello();
  const { getVersionMutation } = useGetVersion();

  const { loginMutation, navigateToMainPageIfIsLogged } = useLogin();

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const [showPass, setShowPass] = React.useState(false);

  const handleLogin = () => {
    // TODO implement validations
    const loginData = {
      email,
      password,
      deviceKey,
      userAgent: window.navigator.userAgent,
    };

    loginMutation.mutate(loginData);
  };

  useEffect(() => {
    navigateToMainPageIfIsLogged();
  });

  return (
    <>
      <div className='flex flex-col p-8 pt-5 bg-slate-100 min-h-screen justify-center items-center w-full'>
        <div className='pb-12'>
          <Text fontSize={'xx-large'} fontWeight={'bold'}>
            WebTM
          </Text>
        </div>
        <div className='pb-4 flex w-full'>
          <ServerUrlEditable />
        </div>
        <div className='pb-4 flex w-full'>
          <Input
            type='text'
            name='email'
            placeholder='Email'
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            backgroundColor={'white'}
            autoCapitalize='false'
          />
        </div>
        <div className='pb-4 flex w-full'>
          <InputGroup size='md'>
            <Input
              pr='4.5rem'
              type={showPass ? 'text' : 'password'}
              name='password'
              placeholder='Enter password'
              value={password}
              onChange={(event) => setPassword(event.target.value)}
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
        </div>
        <div className='flex flex-row w-full justify-between'>
          <Text fontSize={'small'} className='cursor-pointer'>
            Recovery password
          </Text>
          <Text fontSize={'small'} className='cursor-pointer'>
            Sign up
          </Text>
        </div>
        <div className='flex pt-2 gap-4'>
          <Button
            colorScheme='blue'
            onClick={() => handleLogin()}
            isLoading={loginMutation.isPending}
          >
            Sign In
          </Button>
        </div>

        {/* TODO remove these testing buttons */}
        <div className='flex w-full gap-4 pt-6'>
          <Button
            className='w-[200px]'
            colorScheme='blue'
            onClick={() => {
              getVersionMutation.mutate();
            }}
          >
            Get Version
          </Button>
          <Button
            className='w-[200px]'
            colorScheme='blue'
            onClick={() => {
              sayHelloMutation.mutate('Hi from frontend!');
            }}
          >
            Hi :D
          </Button>
        </div>
      </div>
    </>
  );
};
