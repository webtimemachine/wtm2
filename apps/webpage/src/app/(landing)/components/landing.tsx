'use client';
import { BROWSER_DATA, DownloadButton } from './download-button';
import AnimatedGridPattern from '@/components/ui/animated-grid-pattern';
import { BROWSERS, cn } from '@wtm/utils';
import BoxReveal from '@/components/ui/box-reveal';
import Image from 'next/image';
import BlurFade from '@/components/ui/blur-fade';
import { Dock, DockIcon } from '@/components/ui/dock';

const images = [
  {
    name: 'Home',
    img: '/webtm.png',
  },
  {
    name: 'Search',
    img: '/webtm-search.png',
  },
  {
    name: 'Preferences',
    img: '/webtm-preferences.png',
  },
];

export const Landing: React.FC = () => {
  return (
    <div className='relative overflow-hidden w-full flex flex-col gap-12 items-center pt-16 pb-4 px-4 sm:px-10'>
      <AnimatedGridPattern
        numSquares={100}
        maxOpacity={0.1}
        duration={3}
        repeatDelay={1}
        className={cn(
          '[mask-image:radial-gradient(1000px_circle_at_center,white,transparent)]',
          'inset-x-0 inset-y-[-30%] h-[200%] skew-y-12 ',
        )}
      />
      <div className='flex flex-col gap-6'>
        <div className='flex flex-col gap-1'>
          <BoxReveal boxColor={'#3182CE'} duration={0.5}>
            <p className='text-[3.5rem] font-semibold'>
              WebTM<span className='text-[#3182CE] font-semibold'>.</span>
            </p>
          </BoxReveal>

          <BoxReveal boxColor={'#3182CE'} duration={0.5}>
            <h2 className='mt-[.5rem] text-[1rem]'>
              It{"'"}s like a Time Machine for{' '}
              <span className='text-[#3182CE] font-semibold'>your Browser</span>
            </h2>
          </BoxReveal>
          <BoxReveal boxColor={'#3182CE'} duration={0.5}>
            <p>
              Search{' '}
              <span className='text-[#3182CE] font-semibold'>
                through everything
              </span>{' '}
              {"you've"} seen and find that thing you {"don't"} know where you
              looked up.
            </p>
          </BoxReveal>

          <BoxReveal boxColor={'#3182CE'} duration={0.5}>
            <div className='mt-6'>
              <p>
                -&gt; Store your web history in one place, whether in{' '}
                <span className='font-semibold text-[#3182CE]'>iOS Safari</span>
                ,{' '}
                <span className='font-semibold text-[#3182CE]'>
                  Android Firefox
                </span>
                , or{' '}
                <span className='font-semibold text-[#3182CE]'>
                  Desktop Chrome.
                </span>
                <br />
                -&gt; Secure synchronization to keep your history{' '}
                <span className='font-semibold text-[#3182CE]'>
                  always available.
                </span>
                <br />
                -&gt; Use state of the art{' '}
                <span className='font-semibold text-[#3182CE]'>
                  Machine Learning
                </span>{' '}
                to query your browser history.
                <br />
              </p>
            </div>
          </BoxReveal>
        </div>

        <div className='flex flex-col-reverse sm:flex-row items-center gap-6'>
          <BlurFade delay={0.25} inView>
            <DownloadButton />
          </BlurFade>
          <BlurFade delay={0.25} inView>
            <div className='relative'>
              <Dock direction='middle' className='mt-0'>
                <DockIcon>
                  <a
                    href={BROWSER_DATA[BROWSERS.SAFARI].downloadLink}
                    target='_blank'
                    rel='noreferrer'
                  >
                    <Icons.apple className='size-6 hover:stroke-[#3182CE] transition-all duration-300' />
                  </a>
                </DockIcon>
                <DockIcon>
                  <a
                    href={BROWSER_DATA[BROWSERS.CHROME].downloadLink}
                    target='_blank'
                    rel='noreferrer'
                  >
                    <Icons.chrome className='size-6 hover:stroke-[#3182CE] transition-all duration-300' />
                  </a>
                </DockIcon>
                <DockIcon>
                  <a
                    href={BROWSER_DATA[BROWSERS.FIREFOX].downloadLink}
                    target='_blank'
                    rel='noreferrer'
                  >
                    <Icons.firefox className='size-6 hover:stroke-[#3182CE] transition-all duration-300' />
                  </a>
                </DockIcon>
                <DockIcon>
                  <a
                    href='https://x.com/webtmapp'
                    target='_blank'
                    rel='noreferrer'
                  >
                    <Icons.twitter className='size-6 hover:stroke-[#3182CE] transition-all duration-300' />
                  </a>
                </DockIcon>
                <DockIcon>
                  <a
                    href='https://github.com/webtimemachine/wtm2'
                    target='_blank'
                    rel='noreferrer'
                  >
                    <Icons.github className='size-6 hover:stroke-[#3182CE] transition-all duration-300' />
                  </a>
                </DockIcon>
                <DockIcon>
                  <a
                    href='https://news.ycombinator.com/item?id=40379746#40380459'
                    target='_blank'
                    rel='noreferrer'
                  >
                    <Icons.hackernews className='size-6 hover:stroke-[#3182CE] transition-all duration-300' />
                  </a>
                </DockIcon>
              </Dock>
            </div>
          </BlurFade>
        </div>
      </div>

      <section
        id='photos'
        className='sm:p-10 sm:bg-white/30 sm:border sm:border-neutral-300 sm:rounded-lg sm:shadow-lg relative sm:overflow-hidden gap-10 flex flex-col w-full'
      >
        <div className='flex flex-col sm:flex-row gap-4'>
          {images.map((image, idx) => (
            <BlurFade
              key={image.img}
              delay={0.25 + idx * 0.05}
              className='border rounded-lg border-neutral-300 shadow-lg'
              inView
            >
              <Image
                className='size-full rounded-lg object-contain'
                width={600}
                height={600}
                src={image.img}
                alt={image.name}
              />
            </BlurFade>
          ))}
        </div>
      </section>
    </div>
  );
};

type IconProps = React.HTMLAttributes<SVGElement>;

const Icons = {
  twitter: (props: IconProps) => (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={24}
      height={24}
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth={2}
      strokeLinecap='round'
      strokeLinejoin='round'
      className='icon icon-tabler icons-tabler-outline icon-tabler-brand-x'
      {...props}
    >
      <path stroke='none' d='M0 0h24v24H0z' fill='none' />
      <path d='M4 4l11.733 16h4.267l-11.733 -16z' />
      <path d='M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772' />
    </svg>
  ),
  hackernews: (props: IconProps) => (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={24}
      height={24}
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth={2}
      strokeLinecap='round'
      strokeLinejoin='round'
      className='icon icon-tabler icons-tabler-outline icon-tabler-brand-ycombinator'
      {...props}
    >
      <path stroke='none' d='M0 0h24v24H0z' fill='none' />
      <path d='M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z' />
      <path d='M8 7l4 6l4 -6' />
      <path d='M12 17l0 -4' />
    </svg>
  ),
  apple: (props: IconProps) => (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={24}
      height={24}
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth={2}
      strokeLinecap='round'
      strokeLinejoin='round'
      className='icon icon-tabler icons-tabler-outline icon-tabler-brand-appstore'
      {...props}
    >
      <path stroke='none' d='M0 0h24v24H0z' fill='none' />
      <path d='M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0' />
      <path d='M8 16l1.106 -1.99m1.4 -2.522l2.494 -4.488' />
      <path d='M7 14h5m2.9 0h2.1' />
      <path d='M16 16l-2.51 -4.518m-1.487 -2.677l-1 -1.805' />
    </svg>
  ),
  chrome: (props: IconProps) => (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={24}
      height={24}
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth={2}
      strokeLinecap='round'
      strokeLinejoin='round'
      className='icon icon-tabler icons-tabler-outline icon-tabler-brand-chrome'
      {...props}
    >
      <path stroke='none' d='M0 0h24v24H0z' fill='none' />
      <path d='M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0' />
      <path d='M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0' />
      <path d='M12 9h8.4' />
      <path d='M14.598 13.5l-4.2 7.275' />
      <path d='M9.402 13.5l-4.2 -7.275' />
    </svg>
  ),
  github: (props: IconProps) => (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={24}
      height={24}
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth={2}
      strokeLinecap='round'
      strokeLinejoin='round'
      className='icon icon-tabler icons-tabler-outline icon-tabler-brand-github'
      {...props}
    >
      <path stroke='none' d='M0 0h24v24H0z' fill='none' />
      <path d='M9 19c-4.3 1.4 -4.3 -2.5 -6 -3m12 5v-3.5c0 -1 .1 -1.4 -.5 -2c2.8 -.3 5.5 -1.4 5.5 -6a4.6 4.6 0 0 0 -1.3 -3.2a4.2 4.2 0 0 0 -.1 -3.2s-1.1 -.3 -3.5 1.3a12.3 12.3 0 0 0 -6.2 0c-2.4 -1.6 -3.5 -1.3 -3.5 -1.3a4.2 4.2 0 0 0 -.1 3.2a4.6 4.6 0 0 0 -1.3 3.2c0 4.6 2.7 5.7 5.5 6c-.6 .6 -.6 1.2 -.5 2v3.5' />
    </svg>
  ),
  firefox: (props: IconProps) => (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={24}
      height={24}
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth={2}
      strokeLinecap='round'
      strokeLinejoin='round'
      className='icon icon-tabler icons-tabler-outline icon-tabler-brand-firefox'
      {...props}
    >
      <path stroke='none' d='M0 0h24v24H0z' fill='none' />
      <path d='M4.028 7.82a9 9 0 1 0 12.823 -3.4c-1.636 -1.02 -3.064 -1.02 -4.851 -1.02h-1.647' />
      <path d='M4.914 9.485c-1.756 -1.569 -.805 -5.38 .109 -6.17c.086 .896 .585 1.208 1.111 1.685c.88 -.275 1.313 -.282 1.867 0c.82 -.91 1.694 -2.354 2.628 -2.093c-1.082 1.741 -.07 3.733 1.371 4.173c-.17 .975 -1.484 1.913 -2.76 2.686c-1.296 .938 -.722 1.85 0 2.234c.949 .506 3.611 -1 4.545 .354c-1.698 .102 -1.536 3.107 -3.983 2.727c2.523 .957 4.345 .462 5.458 -.34c1.965 -1.52 2.879 -3.542 2.879 -5.557c-.014 -1.398 .194 -2.695 -1.26 -4.75' />
    </svg>
  ),
};
