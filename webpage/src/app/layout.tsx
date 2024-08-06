import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ClientProviders } from '@/providers/ClientProvider';
import { manifestWeb } from '@/manifest-web';
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: manifestWeb.name,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <head>
        <link rel='icon' type='image/x-icon' href='/app-icon.png' />
      </head>
      <body className={`${inter.className} bg-slate-100`}>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
