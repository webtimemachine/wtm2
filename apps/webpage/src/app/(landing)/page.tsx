import type { Metadata } from 'next';
import { Button, Link } from '@chakra-ui/react';
import { FaGithub, FaHackerNews, FaTwitter } from 'react-icons/fa6';
import { DownloadButton } from './components/download-button';

export const metadata: Metadata = {
  title: 'WebTM | Home',
  description:
    "WebTM is like a Time Machine for your browser. Search through everything you have seen and find that thing you don't know where you looked up.",
};

export default function Home() {
  //

  return (
    <div className='space-y-20'>
      <div className='flex flex-col md:flex-row items-center justify-around gap-8'>
        <div className='flex justify-center items-center max-w-[420px]'>
          <img
            src='/WebTM.png'
            className='drop-shadow-lg rounded-lg'
            alt='WebTM App'
          />
        </div>
        <div className='space-y-4'>
          <div className='sm:max-w-prose space-y-2'>
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
          </div>
          <div className='flex flex-col space-y-2'>
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
}
