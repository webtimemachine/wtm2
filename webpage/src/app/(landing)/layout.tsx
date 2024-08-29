import type { Metadata } from 'next';
import { manifestWeb } from '@/manifest-web';
import { Nav } from './components/nav';
import { Box, Container } from '@chakra-ui/react';

export const metadata: Metadata = {
  title: manifestWeb.name,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Container
      display={'flex'}
      flexDirection={'column'}
      justifyContent={'center'}
      alignItems={'center'}
      maxW={'6xl'}
      minHeight={'100vh'}
    >
      <Box
        as='main'
        display={'flex'}
        flexDir={'column'}
        flexGrow={1}
        justifyContent={'space-between'}
        w='100%'
      >
        <Nav />
        <Box
          as='main'
          w='100%'
          display={'flex'}
          flexGrow={1}
          alignItems={'center'}
        >
          <Box
            rounded={'xl'}
            w='100%'
            className='sm:bg-white sm:shadow-xl sm:p-8'
          >
            {children}
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
