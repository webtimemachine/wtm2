import { Box, Button, Heading, Img, Link, Stack, Text } from '@chakra-ui/react';
import type { Metadata } from 'next';
import { FaGithub, FaHackerNews, FaTwitter } from 'react-icons/fa6';

export const metadata: Metadata = {
  title: 'WebTM | Home',
  description:
    "WebTM is like a Time Machine for your browser. Search through everything you have seen and find that thing you don't know where you looked up.",
};

export default function Home() {
  return (
    <Stack
      spacing={5}
      alignItems={'center'}
      direction={{ md: 'row', base: 'column' }}
      gap={12}
    >
      <Box
        boxSize={'sm'}
        display={'flex'}
        justifyContent={'center'}
        alignItems={'center'}
        maxW={'256px'}
      >
        <Img src='/icon-512.png' alt='WebTM Icon' />
      </Box>
      <Stack spacing={4}>
        <Stack spacing={1}>
          <Heading as='h1' size='3xl' paddingBottom={8}>
            WebTM
          </Heading>
          <Text as='p'>
            It{"'"}s like a Time Machine for your browser. Search through
            everything {"you've"} seen and find that thing you {"don't"} know
            where you looked up.
          </Text>
        </Stack>
        <Text as='p'>
          {"It's"} totally open source and we tried to make it easy to run your
          own.
        </Text>
        <Text as='p'>
          Store your web history in one place, whether in iOS Safari, Android
          Firefox, or Desktop Chrome
        </Text>
        <Text as='p'>
          Use state of the art Machine Learning to query your browser history
        </Text>

        <Stack spacing={2} direction={'row'} wrap={'wrap'} paddingTop={4}>
          <Link
            href='https://chrome.google.com/webstore/detail/dfijieibikhpelmfhkjmihgfgpoeigch'
            target='_blank'
            rel='noreferrer'
          >
            <Img
              src='/chrome-badget.png'
              alt='Chrome Web Store Badge'
              border={'1px'}
              bg='white'
              rounded='md'
              height={10}
            />
          </Link>
          <Link
            href='https://apps.apple.com/ar/app/webtm/id6477404511'
            target='_blank'
            rel='noreferrer'
          >
            <Img
              src='/apple-store.svg'
              alt='Apple Store Badge'
              rounded='md'
              height={10}
            />
          </Link>
          <Link
            href='https://addons.mozilla.org/en-US/firefox/addon/webtm'
            target='_blank'
            rel='noreferrer'
          >
            <Img
              src='/firefox-add-ons.png'
              alt='Firefox Add-ons Badge'
              rounded='md'
              height={10}
            />
          </Link>
          <Link
            href='https://discord.gg/JpR5Dn5jP5'
            target='_blank'
            rel='noreferrer'
          >
            <Img rounded='md' height={10} src='/discord.jpeg' alt='Discord' />
          </Link>
        </Stack>
        <Stack spacing={2} direction={'row'} wrap={'wrap'}>
          <Link
            href='https://github.com/webtimemachine/wtm2'
            target='_blank'
            rel='noreferrer'
          >
            <Button colorScheme={'gray'} size='md' leftIcon={<FaGithub />}>
              Source Code
            </Button>
          </Link>
          <Link
            href='https://news.ycombinator.com/item?id=40379746#40380459'
            target='_blank'
            rel='noreferrer'
          >
            <Button
              colorScheme={'orange'}
              size='md'
              leftIcon={<FaHackerNews />}
            >
              Comment on Hacker News
            </Button>
          </Link>
          <Link href='https://x.com/webtmapp' target='_blank' rel='noreferrer'>
            <Button colorScheme={'blue'} size='md' leftIcon={<FaTwitter />}>
              Follow me on Twitter
            </Button>
          </Link>
        </Stack>
      </Stack>
    </Stack>
  );
}
