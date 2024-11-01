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
      <Stack className='py-5 sm:px-8 lg:px-20 flex flex-col items-center gap-6 rounded-lg sm:border sm:border-gray-300 sm:shadow-lg'>
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
