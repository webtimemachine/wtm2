import { Metadata } from 'next';

import {
  Button,
  FormControl,
  Heading,
  Input,
  Select,
  Stack,
  Textarea,
} from '@chakra-ui/react';
import { sendMessageToDiscord } from './action';

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
          <form id='contact-form' action={sendMessageToDiscord}>
            <FormControl isRequired>
              <Stack
                wrap={'wrap'}
                justifyContent={'center'}
                direction={'row'}
                gap={6}
              >
                <Input
                  type='text'
                  borderColor={'gray.300'}
                  id='name'
                  placeholder='Your Name'
                  name='name'
                />
                <Input
                  type='email'
                  borderColor={'gray.300'}
                  id='email'
                  placeholder='Your Email'
                  name='email'
                />
                <Select
                  borderColor={'gray.300'}
                  id='query-type'
                  name='query-type'
                >
                  <option value=''>-- Please select an option --</option>
                  <option value='Technical Support'>Technical Support</option>
                  <option value='Delete Account Request'>
                    Delete Account Request
                  </option>
                  <option value='Other'>Other</option>
                </Select>
                <Input
                  type='text'
                  borderColor={'gray.300'}
                  id='subject'
                  placeholder='Subject'
                  name='subject'
                />
                <Textarea
                  placeholder='Leave a message here'
                  borderColor={'gray.300'}
                  id='message'
                  name='message'
                />
                <Button colorScheme='blue' type='submit'>
                  Send Message
                </Button>
              </Stack>
            </FormControl>
          </form>
        </Stack>
      </Stack>
    </Stack>
  );
}
