'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Button } from '@chakra-ui/react';
import { NavMenu } from './nav-menu';
import { cn } from '@wtm/utils';
import { useMediaQuery } from 'usehooks-ts';

export enum Routes {
  HOME = '/',
  CONTACT_US = '/contact-us',
  PRIVACY_POLICIES = '/privacy-policies',
  LOGIN = '/login',
  DOWNLOADS = '/downloads',
}

const ROUTES_ARRAY = Object.keys(Routes)
  .map((key) => ({
    name: key.toLowerCase().replace('_', ' '),
    href: Routes[key as keyof typeof Routes],
  }))
  .filter((route) => route.href !== Routes.LOGIN);

export const Nav = () => {
  const [isMounted, setIsMounted] = useState(false);
  const renderNavigation = useMediaQuery('(min-width: 768px)');

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const pathname = usePathname();

  const baseStyles =
    'text-xs capitalize sm:text-sm text-gray-600 hover:text-gray-900';
  const currentRouteStyle = 'text-gray-900 font-medium';

  if (!isMounted) return null;

  return (
    <div className='w-full flex justify-between rounded-xl py-2 sm:px-3'>
      <Link
        className='flex items-center justify-center gap-2'
        href={Routes.HOME}
      >
        <div className='flex justify-center items-center max-w-[36px] max-h-[36px]'>
          <img src='/icon-512.png' alt='WebTM Icon' />
        </div>
        <span className='font-medium'>WebTM</span>
      </Link>

      <div className='flex items-center space-x-4'>
        {renderNavigation &&
          ROUTES_ARRAY.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(baseStyles, {
                [currentRouteStyle]: pathname === route.href,
              })}
            >
              {route.name}
            </Link>
          ))}
        <Link href={Routes.LOGIN}>
          <Button colorScheme='yellow' size='sm'>
            Dashboard
          </Button>
        </Link>
        {!renderNavigation && <NavMenu routes={ROUTES_ARRAY} />}
      </div>
    </div>
  );
};
