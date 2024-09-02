'use client';

import { Button, Stack } from '@chakra-ui/react';
import { BROWSER_DATA } from '../components/download-button';

export default function Downloads() {
  return (
    <Stack width={'100%'} spacing={10}>
      <Stack className='text-center sm:text-start'>
        <h1 className='font-semibold text-4xl'>Downloads</h1>
        <h2 className='text-lg font-medium'>
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
    </Stack>
  );
}
