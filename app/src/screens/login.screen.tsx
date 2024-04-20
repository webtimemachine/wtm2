import React from 'react';
import { Button, Input, Text } from '@chakra-ui/react';
import { ServerUrlEditable } from '../components';
import { useGetVersion, useSayHello } from '../hooks';

export const LoginScreen: React.FC<{}> = () => {
  const { sayHelloMutation } = useSayHello();
  const { getVersionMutation } = useGetVersion();

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
            backgroundColor={'white'}
          />
        </div>
        <div className='pb-4 flex w-full'>
          <Input
            type='password'
            name='password'
            placeholder='Password'
            backgroundColor={'white'}
          />
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
            onClick={() => {
              sayHelloMutation.mutate('Hi from frontend!');
            }}
          >
            Sign In
          </Button>
        </div>
        <div className='flex gap-4 pt-6'>
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
