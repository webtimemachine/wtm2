import type { Metadata } from 'next';

import { Landing } from './components/landing';

export const metadata: Metadata = {
  title: 'WebTM | Home',
  description:
    "WebTM is like a Time Machine for your browser. Search through everything you have seen and find that thing you don't know where you looked up.",
};

export default function Home() {
  return <Landing />;
}
