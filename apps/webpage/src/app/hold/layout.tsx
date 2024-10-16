import React, { Suspense } from 'react';

interface Props {
  children?: React.ReactNode;
}

const RootLayout: React.FC<Props> = ({ children }) => {
  return <Suspense>{children}</Suspense>;
};

export default RootLayout;
