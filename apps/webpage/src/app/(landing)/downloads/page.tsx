'use client';

import { Button, Stack } from '@chakra-ui/react';
import { BROWSER_DATA } from '../components/download-button';

export default function Downloads() {
  return (
    <Stack
      justifyContent={'center'}
      alignItems={'center'}
      justify={'center'}
      w='100%'
    >
      <div className='sm:border sm:border-gray-300 w-full p-10 rounded-lg space-y-8 sm:shadow-lg'>
        <Stack className='text-center'>
          <h1 className='font-semibold text-2xl sm:text-4xl'>Downloads</h1>
          <h2 className='text-sm sm:text-base'>
            Download WebTM for your favorite browser
          </h2>
        </Stack>

        <Stack alignItems={'center'}>
          {Object.values(BROWSER_DATA).map((browser) => (
            <a
              href={browser.downloadLink}
              key={browser.downloadLink}
              target='_blank'
              rel='noreferrer'
            >
              <Button
                width='250px'
                colorScheme={browser.colorScheme}
                leftIcon={browser.icon}
              >
                {browser.text}
              </Button>
            </a>
          ))}
        </Stack>
      </div>
    </Stack>
  );
}
