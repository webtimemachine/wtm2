import type { Metadata } from 'next';
import { manifestWeb } from '@/manifest-web';
import { Nav } from './components/nav';

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
      <div className='flex flex-col flex-1 justify-between w-full'>
        <Nav />
        <div className='flex w-full flex-grow'>{children}</div>
      </div>
    </div>
  );
}
