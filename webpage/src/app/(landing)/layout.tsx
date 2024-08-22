import type { Metadata } from 'next';
import { manifestWeb } from '@/manifest-web';
import { Footer } from './components/footer';

export const metadata: Metadata = {
  title: manifestWeb.name,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='max-w-6xl mx-auto min-h-screen flex flex-col'>
      <main className='flex-grow flex p-10'>{children}</main>
      <Footer />
    </div>
  );
}
