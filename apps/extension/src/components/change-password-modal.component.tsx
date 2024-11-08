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
import { BsKey } from 'react-icons/bs';
import { useChangeUserPassword } from '../hooks/use-change-user-password.hook';

const ChangePasswordModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newPassword, setNewPassword] = useState('');
  const [reNewPassword, setReNewPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');

  const { changeUserPasswordMutation } = useChangeUserPassword();

  const handleNewPasswordChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => setNewPassword(e.target.value);
  const handleOldPasswordChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => setOldPassword(e.target.value);
  const handleReNewPasswordChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => setReNewPassword(e.target.value);
  const isError = newPassword !== reNewPassword;
  useEffect(() => {
    if (!isOpen) {
      setNewPassword('');
      setOldPassword('');
      setReNewPassword('');
    }
  }, [isOpen]);
  const verifyFields = () => {
    return (
      newPassword &&
      oldPassword &&
      reNewPassword &&
      newPassword.length > 3 &&
      oldPassword.length > 3 &&
      reNewPassword.length > 3
    );
  };
  const handleSubmit = () => {
    if (verifyFields()) {
      changeUserPasswordMutation.mutate({
        oldPassword: oldPassword,
        newPassword: newPassword,
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
        <BsKey /> Change password
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size={{ base: 'full', md: 'md' }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Change the password</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isInvalid={isError}>
              <FormLabel>Old Password</FormLabel>
              <Input
                data-testid='old-password-field'
                type='password'
                value={oldPassword}
                onChange={handleOldPasswordChange}
              />
              <FormHelperText>
                Please enter your password for change.
              </FormHelperText>
              <Divider my={2} />
              <FormLabel>New Password</FormLabel>
              <Input
                data-testid='new-password-field'
                type='password'
                value={newPassword}
                onChange={handleNewPasswordChange}
              />
              <FormLabel pt={2}>Re-enter new Password</FormLabel>
              <Input
                data-testid='confirm-password-field'
                type='password'
                value={reNewPassword}
                onChange={handleReNewPasswordChange}
              />
              {!isError ? (
                <FormHelperText>
                  Password must be between 4 to 8 characters, it must have a
                  Symbol, an Uppercase and Lowercase.
                </FormHelperText>
              ) : (
                <FormErrorMessage>{"Passwords don't match."}</FormErrorMessage>
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
                data-testid='change-button'
              >
                Change
              </Button>

              <Button
                variant='ghost'
                onClick={onClose}
                data-testid='close-modal-button'
              >
                Close
              </Button>
            </div>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ChangePasswordModal;
