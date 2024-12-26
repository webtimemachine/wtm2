'use client';

import { AuthLayout } from '@/components/auth-layout';
import { ExternalLoginScreen } from '@/components';
import { Suspense } from 'react';

export default function ExternalLogin() {
  return (
    <AuthLayout>
      <Suspense>
        <ExternalLoginScreen />
      </Suspense>
    </AuthLayout>
  );
}
