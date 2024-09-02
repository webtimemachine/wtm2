import { Box, Button, Img, Link, Stack } from '@chakra-ui/react';
import type { Metadata } from 'next';
import { FaGithub, FaHackerNews, FaTwitter } from 'react-icons/fa6';
import { DownloadButton } from './components/download-button';

export const metadata: Metadata = {
  title: 'WebTM | Home',
  description:
    "WebTM is like a Time Machine for your browser. Search through everything you have seen and find that thing you don't know where you looked up.",
};

export default function Home() {
  return (
    <Stack spacing={20}>
      <Stack
        alignItems={'center'}
        direction={{ md: 'row', base: 'column' }}
        gap={8}
        justifyContent={'space-around'}
      >
        <Box
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
          maxW={'420px'}
        >
          <Img
            src='/WebTM.png'
            className='drop-shadow-lg rounded-lg'
            alt='WebTM App'
          />
        </Box>
        <Stack spacing={4}>
          <Stack className='sm:max-w-prose'>
            <p className='text-2xl sm:text-3xl font-medium'>
              It{"'"}s like a Time Machine for your browser. Search through
              everything {"you've"} seen and find that thing you {"don't"} know
              where you looked up.
            </p>
            <p className='text-sm'>
              {"It's"} totally open source and we tried to make it easy to run
              your own.
            </p>
            <p className='text-sm'>
              Store your web history in one place, whether in iOS Safari,
              Android Firefox, or Desktop Chrome
            </p>
            <p className='text-sm'>
              Use state of the art Machine Learning to query your browser
              history
            </p>
          </Stack>
          <Stack spacing={2} direction={'column'} wrap={'wrap'}>
            <DownloadButton />
            <Link
              href='https://github.com/webtimemachine/wtm2'
              target='_blank'
              rel='noreferrer'
            >
              <Button
                w='100%'
                colorScheme={'blackAlpha'}
                leftIcon={<FaGithub />}
              >
                Source Code
              </Button>
            </Link>
            <Link
              href='https://news.ycombinator.com/item?id=40379746#40380459'
              target='_blank'
              rel='noreferrer'
            >
              <Button
                w='100%'
                colorScheme={'orange'}
                leftIcon={<FaHackerNews />}
              >
                Comment on Hacker News
              </Button>
            </Link>
            <Link
              href='https://x.com/webtmapp'
              target='_blank'
              rel='noreferrer'
            >
              <Button w='100%' colorScheme={'blue'} leftIcon={<FaTwitter />}>
                Follow me on Twitter
              </Button>
            </Link>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
}
