import type { Metadata } from 'next';
import { manifestWeb } from '@/manifest-web';
import { Footer } from './components/footer';
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
      >
        <Box
          as='main'
          padding={5}
          display={'flex'}
          flexGrow={1}
          alignItems={'center'}
        >
          <Box
            bg={{ sm: 'white', base: 'none' }}
            rounded={'xl'}
            w='100%'
            shadow={{ sm: 'xl', base: 'none' }}
            padding={5}
          >
            {children}
          </Box>
        </Box>
        <Footer />
      </Box>
    </Container>
  );
}
