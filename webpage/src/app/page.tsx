'use client';

import { useNavigation } from '../store';
import clsx from 'clsx';

export default function Home() {
  const { CurrentScreen } = useNavigation();
  return (
    <div className='flex w-full min-h-screen bg-slate-100'>
      <div
        className={clsx([
          'flex w-full min-h-screen',
          'mx-[auto] max-w-[1080px]',
          'min-w-[500px]',
        ])}
      >
        <CurrentScreen />
      </div>
    </div>
  );
}
