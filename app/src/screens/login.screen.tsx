import React from 'react'
import { Button, Input, Text } from '@chakra-ui/react'

export const LoginScreen: React.FC<object> = () => {

  return (
    <>
      <div className="flex flex-col p-5 bg-slate-100 min-h-screen justify-center items-center w-full">
        <div className='pb-12'>
          <Text fontSize={'xx-large'} fontWeight={'bold'}>WebTM</Text>
        </div>
        <div className='p-4 flex w-full'>
          <Input type='text' name='baseURL' placeholder='Backend URL' backgroundColor={'white'} />
        </div>
        <div className='p-4 flex w-full'>
          <Input type='text' name='email' placeholder='Email' backgroundColor={'white'} />
        </div>
        <div className='p-4 flex w-full'>
          <Input type='password' name='password' placeholder='Password' backgroundColor={'white'} />
        </div>
        <div className='flex flex-row w-full justify-between'>
          <Text fontSize={'small'} className='cursor-pointer'>Recovery password</Text>
          <Text fontSize={'small'} className='cursor-pointer'>Sign up</Text>
        </div>
        <div>
          <Button
            colorScheme="blue"
          >
            Sign In
          </Button>
        </div>
      </div>
    </>
  )
}