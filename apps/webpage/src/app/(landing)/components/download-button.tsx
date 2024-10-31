'use client';

import { BROWSERS, getBrowser } from '@wtm/utils';
import { Link } from '@chakra-ui/react';
import NextLink from 'next/link';
import { ReactElement, useEffect, useState } from 'react';
import { FaBrave, FaChrome, FaFirefox, FaSafari } from 'react-icons/fa6';
import ShimmerButton from '@/components/ui/shimmer-button';

interface DownloadButtonProps {}

export const BROWSER_DATA: {
  [key: string]: {
    downloadLink: string;
    text: string;
    icon?: ReactElement;
    colorScheme: string;
  };
} = {
  [BROWSERS.CHROME]: {
    downloadLink:
      'https://chrome.google.com/webstore/detail/dfijieibikhpelmfhkjmihgfgpoeigch',
    text: 'Download for Chrome',
    icon: <FaChrome />,
    colorScheme: 'blue',
  },
  [BROWSERS.FIREFOX]: {
    downloadLink: 'https://addons.mozilla.org/en-US/firefox/addon/webtm',
    text: 'Download for Firefox',
    icon: <FaFirefox />,
    colorScheme: 'orange',
  },
  [BROWSERS.SAFARI]: {
    downloadLink: 'https://apps.apple.com/ar/app/webtm/id6477404511',
    text: 'Download for Safari',
    icon: <FaSafari />,
    colorScheme: 'blackAlpha',
  },
  [BROWSERS.BRAVE]: {
    downloadLink:
      'https://chrome.google.com/webstore/detail/dfijieibikhpelmfhkjmihgfgpoeigch',
    text: 'Download for Brave',
    colorScheme: 'red',
    icon: <FaBrave />,
  },
};

export const DownloadButton: React.FC<DownloadButtonProps> = ({}) => {
  const [browserName, setBrowserName] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setBrowserName(getBrowser());
    }
  }, []);

  if (browserName === null) return null;

  return (
    <>
      {browserName === BROWSERS.UNKNOWN && (
        <Link as={NextLink} href='/downloads'>
          <ShimmerButton>Download for your browser</ShimmerButton>
        </Link>
      )}
      {browserName !== BROWSERS.UNKNOWN && (
        <Link
          href={BROWSER_DATA[browserName].downloadLink}
          target='_blank'
          rel='noreferrer'
        >
          <ShimmerButton background='#3182CE' className='hover:underline'>
            <div className='flex items-center gap-2'>
              {BROWSER_DATA[browserName].icon}
              {BROWSER_DATA[browserName].text}
            </div>
          </ShimmerButton>
        </Link>
      )}
    </>
  );
};
