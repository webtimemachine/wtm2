import Image from 'next/image';
import { Footer } from './components/footer';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'WebTM | Home',
  description:
    "WebTM is like a Time Machine for your browser. Search through everything you have seen and find that thing you don't know where you looked up.",
};

export default function Home() {
  return (
    <div className='flex-grow flex-col lg:flex-row flex items-center gap-16'>
      <Image
        className='max-h-64'
        src='/icon-512.png'
        alt='WebTM Icon'
        height={256}
        width={256}
        priority
      />
      <div className='flex flex-col gap-4'>
        <div className='flex gap-2 flex-col'>
          <h1 className='text-4xl font-semibold'>WebTM</h1>
          <p>
            It{"'"}s like a Time Machine for your browser. Search through
            everything {"you've"} seen and find that thing you {"don't"} know
            where you looked up.
          </p>
        </div>
        <p>
          {"It's"} totally open source and we tried to make it easy to run your
          own.
        </p>
        <p>
          Store your web history in one place, whether in iOS Safari, Android
          Firefox, or Desktop Chrome
        </p>
        <p>
          Use state of the art Machine Learning to query your browser history
        </p>

        <div className='flex flex-col gap-4'>
          <div className='flex gap-2 flex-wrap'>
            <a
              href='https://chrome.google.com/webstore/detail/dfijieibikhpelmfhkjmihgfgpoeigch'
              target='_blank'
              rel='noreferrer'
            >
              <div className='rounded-lg h-10 w-auto'>
                <Image
                  src='/chrome-badget.png'
                  alt='Chrome Web Store Badge'
                  className='rounded-lg'
                  width={178}
                  height={40}
                />
              </div>
            </a>
            <a
              href='https://apps.apple.com/ar/app/webtm/id6477404511'
              target='_blank'
              rel='noreferrer'
            >
              <div className='rounded-lg h-10 w-auto'>
                <Image
                  className='size-full rounded-lg'
                  src='/apple-store.svg'
                  alt='Apple Store Badge'
                  width={178}
                  height={40}
                />
              </div>
            </a>
            <a
              href='https://addons.mozilla.org/en-US/firefox/addon/webtm'
              target='_blank'
              rel='noreferrer'
            >
              <div className='rounded-lg h-10 w-auto'>
                <Image
                  src='/firefox-add-ons.png'
                  alt='Firefox Add-ons Badge'
                  className='size-full rounded-lg'
                  width={178}
                  height={40}
                />
              </div>
            </a>
            <a
              href='https://discord.gg/JpR5Dn5jP5'
              target='_blank'
              rel='noreferrer'
            >
              <div className='rounded-lg h-10 w-auto'>
                <Image
                  className='size-full rounded-lg'
                  width={178}
                  height={40}
                  src='/discord.jpeg'
                  alt='Discord'
                />
              </div>
            </a>
          </div>
          <div className='flex flex-wrap gap-2'>
            <a href='https://github.com/webtimemachine/wtm2'>
              <button className='bg-gray-500 text-white px-2 h-10 flex items-center justify-center text-sm gap-1 rounded-lg border border-slate-500 hover:bg-gray-400'>
                <Image src='/github.svg' alt='GitHub' width={20} height={20} />
                Source Code
              </button>
            </a>
            <a
              href='https://news.ycombinator.com/item?id=40379746#40380459'
              target='_blank'
              rel='noreferrer'
            >
              <button className='bg-orange-500 text-white px-2 h-10 flex items-center justify-center text-sm gap-1 rounded-lg border border-orange-600 hover:bg-orange-400'>
                <Image
                  src='/hackernews.svg'
                  alt='Hackernews'
                  width={26}
                  height={26}
                />
                Comment on Hacker News
              </button>
            </a>
            <a href='https://x.com/webtmapp' target='_blank' rel='noreferrer'>
              <button className='bg-blue-500 text-white px-2 h-10 flex items-center justify-center text-sm gap-1 rounded-lg border border-blue-600 hover:bg-blue-400'>
                <Image
                  src='/twitter.svg'
                  alt='Twitter'
                  width={20}
                  height={20}
                />
                Follow me on Twitter
              </button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
