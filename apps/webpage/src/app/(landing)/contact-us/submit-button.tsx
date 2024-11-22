import { Button } from '@chakra-ui/react';
import { useFormStatus } from 'react-dom';

export const SubmitButton = () => {
  const { pending } = useFormStatus();

  return (
    <Button isLoading={pending} colorScheme='blue' type='submit'>
      Send Message
    </Button>
  );
};
