import React from 'react';
import type { Metadata } from 'next';
import { manifestWeb } from '@/manifest-web';
import { MainLayout } from '@/components';

export const metadata: Metadata = {
  title: manifestWeb.name,
};

interface Props {
  children?: React.ReactNode;
}

const RootLayout: React.FC<Props> = ({ children }) => {
  return <MainLayout>{children}</MainLayout>;
};

export default RootLayout;
