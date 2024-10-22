'use client';

import React, { useEffect, useState } from 'react';
import { Text, Badge } from '@chakra-ui/react';

import { useAuthStore } from '../../store';
import { manifestWeb } from '../../manifest-web';
import { useModelsInformation } from '../../hooks';

const AboutWTMScreen: React.FC<object> = () => {
  const [backendURL, setBackendURL] = useState<string>('');
  const [models, setModels] = useState<any>(null);
  const serverUrl = useAuthStore((state) => state.serverUrl);
  const { useModelsInformationMutation } = useModelsInformation();
  useEffect(() => {
    setBackendURL(serverUrl);
    useModelsInformationMutation.mutateAsync().then((d) => setModels(d));
  }, []);

  return (
    <div className='flex flex-col h-full'>
      <div className='flex w-full justify-start pb-4 gap-4 items-center'>
        <div className='flex flex-col leading-none w-full justify-center items-center px-0 md:px-[40px] h-[40px]'>
          <Text
            fontSize={{ base: 'x-large', md: 'xx-large' }}
            fontWeight={'bold'}
          >
            About
          </Text>
        </div>
      </div>
      <div className='m-10'>
        <Badge>
          <Text align={'center'} className='text-wrap'>
            {manifestWeb.description}
          </Text>
        </Badge>
      </div>
      <div className='flex flex-col w-full min-h-[400px] gap-3'>
        <div className='flex gap-2 items-center w-full p-2 select-none bg-white rounded-lg'>
          <Text fontSize='medium'>
            <span className='font-bold'>Version:</span> {manifestWeb.version}
          </Text>
        </div>
        <div className='flex gap-2 items-center w-full p-2 select-none bg-white rounded-lg'>
          <Text fontSize='medium'>
            <span className='font-bold'>Backend URL:</span> {backendURL || '-'}
          </Text>
        </div>
        <div className='flex gap-2 items-center w-full p-2 select-none bg-white rounded-lg'>
          <Text fontSize='medium'>
            <span className='font-bold'>Text Processing LLM Model:</span>{' '}
            {models && models.text_processing_model}
          </Text>
        </div>
        <div className='flex gap-2 items-center w-full p-2 select-none bg-white rounded-lg'>
          <Text fontSize='medium'>
            <span className='font-bold'>Image Processing LLM Model:</span>{' '}
            {models && models.image_processing_model}
          </Text>
        </div>
        <div
          className='flex gap-2 items-center w-full p-2 select-none bg-white rounded-lg cursor-pointer'
          onClick={() =>
            window.open(
              'https://github.com/webtimemachine/wtm2/issues',
              '_blank',
            )
          }
        >
          <Text fontSize='medium'>Report an Issue</Text>
        </div>
        <div
          className='flex gap-2 items-center w-full p-2 select-none bg-white rounded-lg cursor-pointer'
          onClick={() =>
            window.open('https://www.webtm.io/privacy-policies.html', '_blank')
          }
        >
          <Text fontSize='medium'>Privacy Policies</Text>
        </div>
      </div>
    </div>
  );
};
export default AboutWTMScreen;
