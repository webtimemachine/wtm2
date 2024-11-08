import { useEffect, useState } from 'react';

import {
  Button,
  FormControl,
  FormHelperText,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react';
import { ReactImageSelector } from 'react-images-selector';
import { RxAvatar } from 'react-icons/rx';
import MaleOne from '../assets/Avatars/male_one.png';
import MaleTwo from '../assets/Avatars/male_two.png';
import FemaleOne from '../assets/Avatars/female_one.png';
import FemaleTwo from '../assets/Avatars/female_two.png';
import { ImageType } from 'react-images-selector/dist/image';
import { useChangeUserAvatar } from '../hooks/use-change-user-profile-avatar.hook';

const ChangeAvatarModal = () => {
  const { changeUserAvatarMutation } = useChangeUserAvatar();

  const avatars: { [key: string]: string } = {
    MaleOne: MaleOne,
    MaleTwo: MaleTwo,
    FemaleOne: FemaleOne,
    FemaleTwo: FemaleTwo,
  };

  const images: ImageType[] = [
    {
      src: avatars.MaleOne,
      value: 'MaleOne',
    },
    {
      src: avatars.MaleTwo,
      value: 'MaleTwo',
    },
    {
      src: avatars.FemaleOne,
      value: 'FemaleOne',
    },
    {
      src: avatars.FemaleTwo,
      value: 'FemaleTwo',
    },
  ];
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newAvatar, setNewAvatar] = useState<ImageType>({
    src: '',
    value: '',
  });
  const isError = !newAvatar.src && !newAvatar.value;

  useEffect(() => {
    if (!isOpen) {
      setNewAvatar({
        src: '',
        value: '',
      });
    }
  }, [isOpen]);
  const verifyFields = () => {
    return selectedImages.length > 0;
  };
  const handleSubmit = () => {
    if (verifyFields()) {
      changeUserAvatarMutation.mutate({
        profilePicture: selectedImages[0],
      });
    }
  };
  const handleRemoveAvatar = () => {
    changeUserAvatarMutation.mutate({
      profilePicture: '',
    });
    onClose();
  };

  return (
    <>
      <Button
        size='sm'
        onClick={onOpen}
        className='flex justify-between items-center gap-2'
      >
        <RxAvatar /> Change Avatar
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size={{ base: 'full', md: 'md' }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Change your Avatar</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <ReactImageSelector
                availableImages={images}
                selectedImages={selectedImages}
                SelectorControl={undefined}
                onPick={(image) => {
                  if (selectedImages.includes(image.value)) {
                    setSelectedImages([]);
                  } else {
                    setSelectedImages([image.value]);
                  }
                }}
                imageStyles={{ margin: 8, padding: 5 }}
              />
              <FormHelperText>Please, select one avatar.</FormHelperText>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <div className='flex w-full flex-col space-y-2 md:flex-row md:justify-end md:space-y-0 md:space-x-3'>
              <Button variant='ghost' onClick={handleRemoveAvatar}>
                Remove Actual Avatar
              </Button>
              <Button
                colorScheme='blue'
                onClick={handleSubmit}
                disabled={isError}
              >
                Change
              </Button>
            </div>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ChangeAvatarModal;
