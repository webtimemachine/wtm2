import { Metadata } from 'next';
import { ContactForm } from './contact-form';
import { Heading, Stack } from '@chakra-ui/react';

export const metadata: Metadata = {
  title: 'WebTM | Contact Us',
  description:
    'Contact us for any questions, feedback, or concerns. We are here to help you.',
};

export default function ContactUsPage() {
  return (
    <Stack justifyContent={'center'} alignItems={'center'} justify={'center'}>
      <Stack
        paddingX={{ base: 0, md: 20 }}
        paddingY={5}
        border={'1px'}
        borderColor={'gray.300'}
        className='py-5 px-8 lg:px-20 flex flex-col items-center gap-6 rounded-lg shadow-lg'
      >
        <Heading as='h1' size={'xl'} fontWeight={'semibold'}>
          Contact Us
        </Heading>
        <Stack justifyContent={'center'}>
          <ContactForm />
        </Stack>
      </Stack>
    </Stack>
  );
}
