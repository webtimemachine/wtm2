'use client';
import { getColorFromEmail } from '../../utils/formatterUtils';
import { useGetBasicUserIngormation } from '../../hooks/use-get-user-basic-information.hook';
import { useNavigation } from '../../store';
import { ArrowBackIcon } from '@chakra-ui/icons';
import {
  AbsoluteCenter,
  Badge,
  Box,
  Button,
  Divider,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Spinner,
  Text,
  useToast,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { BiCopy } from 'react-icons/bi';

const ProfileScreen: React.FC<object> = () => {
  const { navigateBack } = useNavigation();
  const toast = useToast();
  const { basicUserInformationQuery } = useGetBasicUserIngormation();
  const [isReady, setIsReady] = useState<boolean>(false);
  console.log(basicUserInformationQuery.data);
  const getUserNameFromEmail = (email: string) => {
    return email.split('@')[0].toUpperCase();
  };
  useEffect(() => {
    if (
      basicUserInformationQuery &&
      basicUserInformationQuery.data &&
      basicUserInformationQuery.data.email &&
      basicUserInformationQuery.data.userType
    ) {
      setIsReady(true);
    }
  }, [basicUserInformationQuery]);
  const getInitialsFromMail = (email: string) => {
    return email.length > 2
      ? email.charAt(0).toUpperCase() + email.charAt(1).toUpperCase()
      : '';
  };
  const ProfileCard = () => {
    return (
      <Box className='bg-white p-6 rounded-lg shadow-lg w-full max-w-[60vw]'>
        <Box
          display={'flex'}
          justifyContent={'flex-start'}
          width={'100%'}
          alignItems={'center'}
        >
          <Box width={'10%'}>
            <IconButton aria-label='Back icon' onClick={() => navigateBack()}>
              <ArrowBackIcon boxSize={5} />
            </IconButton>
          </Box>
          <Box display={'flex'} alignItems={'center'} gap={5} h={'100%'}>
            <Box
              className={`bg-primary rounded-full w-16 h-16 flex items-center justify-center ${getColorFromEmail(
                basicUserInformationQuery.data?.email!,
              )} text-xl font-bold`}
            >
              {basicUserInformationQuery.data?.email &&
                getInitialsFromMail(basicUserInformationQuery.data.email)}
            </Box>
            <Box>
              <Box
                fontWeight={500}
                fontSize={'xl'}
                className='text-card-foreground text-lg font-medium'
              >
                {basicUserInformationQuery.data?.email &&
                  getUserNameFromEmail(basicUserInformationQuery.data?.email)}
              </Box>
              <Badge
                colorScheme={`${
                  basicUserInformationQuery.data?.userType == 'ADMIN'
                    ? 'red'
                    : 'green'
                }`}
                variant={'solid'}
              >
                {basicUserInformationQuery.data?.userType}
              </Badge>
            </Box>
          </Box>
        </Box>

        <Box className='flex flex-col items-center space-y-4'></Box>
        <Box position='relative' padding='10'>
          <Divider />
          <AbsoluteCenter px='4' fontWeight={200} fontSize={12}>
            Personal Information
          </AbsoluteCenter>
        </Box>
        <Box>
          <Text>Email:</Text>
          <Divider mb={2} />
          <InputGroup>
            <Input
              value={basicUserInformationQuery.data?.email}
              readOnly
              variant={'filled'}
            />
            <InputRightElement>
              {' '}
              <Button
                h='1.75rem'
                size='sm'
                mr={1}
                onClick={() => {
                  if (
                    basicUserInformationQuery &&
                    basicUserInformationQuery.data
                  ) {
                    navigator.clipboard.writeText(
                      basicUserInformationQuery.data?.email,
                    );
                    toast({
                      title: 'Copied to clipboard 🎉.',
                      description:
                        'Email has been succesfully copied to clipboard.',
                      status: 'success',
                      duration: 4000,
                      isClosable: true,
                    });
                  }
                }}
              >
                <BiCopy></BiCopy>
              </Button>
            </InputRightElement>
          </InputGroup>
        </Box>
      </Box>
    );
  };
  return (
    <Box className='flex flex-col items-center justify-center h-screen bg-background'>
      {isReady ? <ProfileCard /> : <Spinner />}
    </Box>
  );
};

export default ProfileScreen;
