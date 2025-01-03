import React, { useEffect, useState } from 'react';
import { Text, IconButton } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { useModelsInformation, useExtensionNavigation } from '../hooks';
import { SystemModels } from '@wtm/api';

export const AboutWTMScreen: React.FC<object> = () => {
  const [backendURL, setBackendURL] = useState<string>('');
  const { data } = useModelsInformation();
  const [models, setModels] = useState<SystemModels | null>(null);

  const { goBack } = useExtensionNavigation();

  useEffect(() => {
    const getBackendVersion = async () => {
      const { serverUrl } = await chrome.storage.local.get(['serverUrl']);
      setBackendURL(serverUrl);
    };

    getBackendVersion();
    if (data) {
      setModels(data);
    }
  }, [data]);

  return (
    <div className='flex flex-col px-5 py-3 items-center w-full'>
      <div className='flex w-full justify-start pb-4 gap-4 items-center'>
        <IconButton aria-label='Back icon' onClick={goBack}>
          <ArrowBackIcon boxSize={5} />
        </IconButton>
        <div className='flex w-full justify-center pr-[40px]'>
          <Text fontSize={'xx-large'} fontWeight={'bold'}>
            About WebTM
          </Text>
        </div>
      </div>
      <div className='flex flex-col w-full min-h-[400px] gap-3'>
        <div className='flex gap-2 items-center w-full p-2 select-none bg-white rounded-lg'>
          <Text fontSize='medium'>
            <span className='font-bold'>Version:</span>{' '}
            {chrome.runtime.getManifest().version}
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
