'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push('/login');
  }, [router]);

  return (
    <div className='flex w-full min-h-screen bg-slate-100'>
      <div
        className={clsx([
          'flex w-full min-h-screen',
          'mx-[auto] max-w-[1080px]',
          'min-w-[500px]',
        ])}
      ></div>
    </div>
  );
}
