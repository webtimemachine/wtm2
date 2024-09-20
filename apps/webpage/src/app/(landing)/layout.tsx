import type { Metadata } from 'next';
import { manifestWeb } from '@/manifest-web';
import { Nav } from './components/nav';
import { Box, Container } from '@chakra-ui/react';

export const metadata: Metadata = {
  title: manifestWeb.name,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='flex flex-col justify-center items-center max-w-6xl min-h-screen mx-auto px-4'>
      <div className='flex flex-col flex-grow justify-between w-full'>
        <Nav />
        <div className='flex w-full flex-grow items-center'>
          <div className='w-full rounded-xl sm:bg-white sm:shadow-xl sm:p-8 pb-4'>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
