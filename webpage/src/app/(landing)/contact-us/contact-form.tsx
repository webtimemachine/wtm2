'use client';

import {
  Button,
  FormControl,
  Input,
  Select,
  Stack,
  Textarea,
} from '@chakra-ui/react';
import { FormEvent } from 'react';

export const ContactForm = () => {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    const messageBody = `Name: ${data.name} \n Email: ${data.email} \n Query Type: ${data['query-type']} \n Subject: ${data.subject} \n Message: ${data.message}`;
    const mailtoLink = `mailto:info@webtimemachine.io?subject=${encodeURIComponent(
      data.subject as string,
    )}&body=${encodeURIComponent(messageBody)}`;
    window.open(mailtoLink, '_blank');
  };

  return (
    <form id='contact-form' onSubmit={handleSubmit}>
      <FormControl isRequired>
        <Stack wrap={'wrap'} justifyContent={'center'} direction={'row'}>
          <Input type='text' id='name' placeholder='Your Name' name='name' />
          <Input
            type='email'
            id='email'
            placeholder='Your Email'
            name='email'
          />
          <Select id='query-type' name='query-type'>
            <option value=''>-- Please select an option --</option>
            <option value='Technical Support'>Technical Support</option>
            <option value='Delete Account Request'>
              Delete Account Request
            </option>
            <option value='Other'>Other</option>
          </Select>
          <Input
            type='text'
            id='subject'
            placeholder='Subject'
            name='subject'
          />
          <Textarea
            placeholder='Leave a message here'
            id='message'
            name='message'
          />
          <Button type='submit'>Send Message</Button>
        </Stack>
      </FormControl>
    </form>
  );
};
