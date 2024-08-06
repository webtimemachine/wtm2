import Link from 'next/link';
import { Button, Text } from '@chakra-ui/react';
0;
export default function NotFound() {
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <Text fontSize='6xl' fontWeight='bold'>
        404
      </Text>
      <Text fontSize='2xl' marginBottom='20px'>
        Page Not Found
      </Text>
      <Button colorScheme='blue'>
        <Link href='/'>Return Home</Link>
      </Button>
    </div>
  );
}
