import { useEffect, useState } from 'react';

import {
  Avatar,
  Badge,
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { useGetBasicUserInformation } from '../hooks/use-get-user-basic-information.hook';
import React from 'react';
import CustomInputBox from '../components/custom-input-box.component';
import { relativeTime } from '@wtm/utils';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { useNavigation } from '../store';
import { ReactImageSelector } from 'react-images-selector';
import { RxAvatar } from 'react-icons/rx';

import { ImageType } from 'react-images-selector/dist/image';
import { useChangeUserAvatar } from '../hooks/use-change-user-profile-avatar.hook';
import MaleOne from '../assets/Avatars/male_one.png';
import MaleTwo from '../assets/Avatars/male_two.png';
import FemaleOne from '../assets/Avatars/female_one.png';
import FemaleTwo from '../assets/Avatars/female_two.png';
import ChangePasswordModal from '../components/change-password-modal.component';
import ChangeDisplayNameModal from '../components/change-display-name-modal.component';

export const ProfileScreen: React.FC<object> = () => {
  const { navigateBack } = useNavigation();
  const { basicUserInformationQuery } = useGetBasicUserInformation();
  const user = basicUserInformationQuery.data;
  const { changeUserAvatarMutation } = useChangeUserAvatar();

  const avatars: { [key: string]: string } = {
    MaleOne: MaleOne,
    MaleTwo: MaleTwo,
    FemaleOne: FemaleOne,
    FemaleTwo: FemaleTwo,
  };

  const ChangeAvatarModal = () => {
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
  const ProfileCard = () => {
    const username = basicUserInformationQuery.data?.displayname;
    const relativeTimeLabel =
      basicUserInformationQuery.data &&
      basicUserInformationQuery.data?.passChangedAt
        ? relativeTime(
            new Date(),
            new Date(basicUserInformationQuery.data?.passChangedAt),
          )
        : 'Never';
    const currentUserAvatar = basicUserInformationQuery.data?.profilePicture;
    return (
      <div className='bg-white p-6 rounded-lg shadow-lg w-full'>
        <div className='flex justify-between '>
          <div className='flex flex-col items-center md:flex-row md:items-start w-full gap-2'>
            {currentUserAvatar && currentUserAvatar.length > 0 ? (
              <img src={avatars[currentUserAvatar]} className='w-[25%]' />
            ) : (
              <Avatar
                name={user?.email}
                size={{ base: 'xl', md: 'lg' }}
                bg='gray.400'
              />
            )}
            <div className='flex flex-col items-center md:items-start pt-1'>
              <span className='text-lg font-medium text-card-foreground'>
                {username}
              </span>
              <span className='text-xs text-gray-600'>{user?.email}</span>
              <div className='block md:hidden'>
                <Badge
                  colorScheme={`${user?.userType == 'ADMIN' ? 'red' : 'green'}`}
                  variant={'solid'}
                >
                  {user?.userType}
                </Badge>
              </div>
            </div>
          </div>

          <div className='hidden md:block'>
            <Badge
              colorScheme={`${user?.userType == 'ADMIN' ? 'red' : 'green'}`}
              variant={'solid'}
            >
              {user?.userType}
            </Badge>
          </div>
        </div>

        <div className='flex justify-center w-full pt-5'>
          <Tabs w={'100%'} variant='enclosed'>
            <TabList>
              <Tab>Personal Information</Tab>
              <Tab>Actions</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <div className='flex justify-between flex-wrap gap-5'>
                  <CustomInputBox label={'Email'} value={user?.email || ''} />
                  <CustomInputBox
                    label={'Display Name'}
                    value={user?.displayname || ''}
                  />
                  <CustomInputBox
                    label={`Last password change (${relativeTimeLabel})`}
                    value={
                      user?.passChangedAt
                        ? typeof user.passChangedAt === 'string'
                          ? new Date(user.passChangedAt).toLocaleTimeString(
                              'en-US',
                              {
                                hour12: false,
                              },
                            ) +
                            ' ' +
                            new Date(user.passChangedAt)
                              .toLocaleDateString('en-US')
                              .split('/')
                              .reverse()
                              .join('/')
                          : user.passChangedAt.toLocaleTimeString('en-US', {
                              hour12: false,
                            }) +
                            ' ' +
                            user.passChangedAt
                              .toLocaleDateString('en-US')
                              .split('/')
                              .reverse()
                              .join('/')
                        : ''
                    }
                  />
                </div>
              </TabPanel>
              <TabPanel>
                <div className='flex flex-col justify-start gap-5'>
                  <ChangePasswordModal />
                  <ChangeDisplayNameModal />
                  <ChangeAvatarModal />
                </div>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </div>
      </div>
    );
  };

  return (
    <div className='flex flex-col h-full w-full px-5 py-3 justify-center items-center'>
      <div className='flex w-full justify-start pb-4 gap-4 items-center'>
        <IconButton aria-label='Back icon' onClick={() => navigateBack()}>
          <ArrowBackIcon boxSize={5} />
        </IconButton>
        <div className='flex flex-col leading-none w-full justify-center items-center pr-[40px] mb-5 h-[40px]'>
          <Text
            fontSize={{ base: 'x-large', md: 'xx-large' }}
            fontWeight={'bold'}
          >
            Profile
          </Text>
        </div>
      </div>
      {user ? (
        <ProfileCard />
      ) : (
        <div className='flex w-full h-full items-center justify-center'>
          <Spinner size={'lg'} />
        </div>
      )}
    </div>
  );
};
