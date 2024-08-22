'use client';

import { cn } from '@/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

enum Routes {
  HOME = '/',
  CONTACT_US = '/contact-us',
  PRIVACY_POLICIES = '/privacy-policies',
  LOGIN = '/login',
}

export const Footer = () => {
  const pathname = usePathname();

  const baseStyles = 'p-2 text-gray-600 hover:text-gray-900';
  const currentRouteStyle = 'text-gray-900 font-medium';

  return (
    <div className='pb-4 px-3 flex justify-end'>
      <Link
        href={Routes.HOME}
        className={cn(baseStyles, {
          [currentRouteStyle]: pathname === Routes.HOME,
        })}
      >
        Home
      </Link>
      <Link
        href={Routes.CONTACT_US}
        className={cn(baseStyles, {
          [currentRouteStyle]: pathname === Routes.CONTACT_US,
        })}
      >
        Contact Us
      </Link>
      <Link
        href={Routes.PRIVACY_POLICIES}
        className={cn(baseStyles, {
          [currentRouteStyle]: pathname === Routes.PRIVACY_POLICIES,
        })}
      >
        Privacy Policies
      </Link>
      <Link
        href={Routes.LOGIN}
        className={cn(baseStyles, {
          [currentRouteStyle]: pathname === Routes.LOGIN,
        })}
      >
        Login
      </Link>
    </div>
  );
};
