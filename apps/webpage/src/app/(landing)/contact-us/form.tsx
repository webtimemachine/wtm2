'use client';

import React, { useRef } from 'react';
import {
  FormControl,
  Stack,
  Input,
  Select,
  Textarea,
  useToast,
} from '@chakra-ui/react';
import { SubmitButton } from './submit-button';

interface ContactFormProps {
  action: (formData: FormData) => Promise<void>;
}

export const ContactForm: React.FC<ContactFormProps> = ({ action }) => {
  const toast = useToast();

  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    await action(formData);
    if (formRef.current) {
      formRef.current.reset();
    }

    toast({
      colorScheme: 'green',
      title: 'Message Sent',
      description: 'Your message has been sent successfully.',
    });
  };

  return (
    <form id='contact-form' ref={formRef} onSubmit={handleSubmit}>
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
          <Select borderColor={'gray.300'} id='query-type' name='query-type'>
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
          <SubmitButton />
        </Stack>
      </FormControl>
    </form>
  );
};
