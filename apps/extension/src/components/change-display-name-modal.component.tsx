import { useEffect, useState } from 'react';

import {
  Button,
  Divider,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react';
import { BsPerson } from 'react-icons/bs';
import { useChangeUserDisplayName, useGetBasicUserInformation } from '../hooks';

const ChangeDisplayNameModal = () => {
  const { basicUserInformationQuery } = useGetBasicUserInformation();
  const { changeUserDisplayNameMutation } = useChangeUserDisplayName();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newDisplayName, setNewDisplayName] = useState('');
  const isError =
    newDisplayName === basicUserInformationQuery.data?.displayname;
  const handleNewDisplaynameChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => setNewDisplayName(e.target.value);
  useEffect(() => {
    if (!isOpen) {
      setNewDisplayName('');
    }
  }, [isOpen]);
  const verifyFields = () => {
    return (
      newDisplayName &&
      newDisplayName.length > 3 &&
      newDisplayName != basicUserInformationQuery.data?.displayname
    );
  };
  const handleSubmit = () => {
    if (verifyFields()) {
      changeUserDisplayNameMutation.mutate({
        displayname: newDisplayName,
      });
    }
  };

  return (
    <>
      <Button
        size='sm'
        onClick={onOpen}
        className='flex justify-between items-center gap-2'
      >
        <BsPerson /> Change display name
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size={{ base: 'full', md: 'md' }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Change the displayname</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isInvalid={isError}>
              <FormLabel>Actual Displayname</FormLabel>
              <Input
                type='text'
                value={basicUserInformationQuery.data?.displayname}
                disabled
              />
              <Divider my={2} />
              <FormLabel>New Displayname</FormLabel>
              <Input
                type='text'
                value={newDisplayName}
                onChange={handleNewDisplaynameChange}
              />
              {!isError ? (
                <FormHelperText>
                  Displayname must be different to actual displayname.
                </FormHelperText>
              ) : (
                <FormErrorMessage>
                  {'Displayname must be different to actual displayname.'}
                </FormErrorMessage>
              )}
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <div className='flex w-full justify-center md:justify-end'>
              <Button
                colorScheme='blue'
                mr={3}
                onClick={handleSubmit}
                disabled={isError}
              >
                Change
              </Button>
              <Button variant='ghost' onClick={onClose}>
                Close
              </Button>
            </div>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ChangeDisplayNameModal;
