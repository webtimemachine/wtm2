'use client';
import { Button, Link, List, ListIcon, ListItem } from '@chakra-ui/react';
import { FaGithub, FaHackerNews, FaTwitter } from 'react-icons/fa6';
import { DownloadButton } from './download-button';
import { MdCheckCircle } from 'react-icons/md';

export const Landing: React.FC = () => {
  return (
    <div className='space-y-20'>
      <div className='flex flex-col md:flex-row gap-8'>
        <div className='hidden md:flex justify-center items-center max-w-[420px]'>
          <img
            src='/WebTM.png'
            className='drop-shadow-lg rounded-lg'
            alt='WebTM App'
          />
        </div>
        <div className='flex flex-col justify-between pt-[30px] md:pt-0'>
          <div className='flex flex-col sm:max-w-prose'>
            <p className='text-2xl sm:text-3xl font-medium pb-4'>
              It{"'"}s like a Time Machine for your Browser
            </p>
            <p className='text-lg sm:text-xl pb-6'>
              Search through everything {"you've"} seen and find that thing you{' '}
              {"don't"} know where you looked up.
            </p>

            <List spacing={3} pb={'30px'}>
              <ListItem>
                <ListIcon as={MdCheckCircle} color='green.500' />
                {"It's"} totally open source and we tried to make it easy to run
                your own.
              </ListItem>
              <ListItem>
                <ListIcon as={MdCheckCircle} color='green.500' />
                Store your web history in one place, whether in iOS Safari,
                Android Firefox, or Desktop Chrome
              </ListItem>
              <ListItem>
                <ListIcon as={MdCheckCircle} color='green.500' />
                Use state of the art Machine Learning to query your browser
                history
              </ListItem>
            </List>
          </div>

          <div className='flex md:hidden justify-center items-center mb-[30px] border border-slate-300 overflow-hidden rounded-lg drop-shadow-lg'>
            <img src='/WebTM.png' alt='WebTM App' />
          </div>

          <div className='flex flex-col max-w-[400px] w-full mx-auto gap-2 mt-2'>
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
          </div>
        </div>
      </div>
    </div>
  );
};
