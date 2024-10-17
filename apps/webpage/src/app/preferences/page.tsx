'use client';

import React, { useEffect, useState } from 'react';
import {
  Text,
  Switch,
  Input,
  Button,
  Divider,
  Spinner,
  Flex,
} from '@chakra-ui/react';
import { useGetPreferences, useUpdatePreferences } from '../../hooks';
import { useAuthStore } from '../../store';
import { GrTest } from 'react-icons/gr';

const PreferencesScreen: React.FC<object> = () => {
  const [enabled, setEnabled] = useState(false);
  const [enabledLiteMode, setEnabledLiteMode] = useState(false);
  const [imageEncodingEnabled, setImageEncodingEnabled] = useState(false);
  const [explicitContentFilterEnabled, setExplicitContentFilterEnabled] =
    useState(false);
  const [stopTrackingEnabledValue, setStopTrackingEnabledValue] =
    useState(false);
  const [webLLMEnabled, setWebLLMEnabled] = useState(false);
  const [days, setDays] = useState<number | null>(null);
  const { userPreferencesQuery } = useGetPreferences();
  const { updatePreferencesMutation } = useUpdatePreferences();

  const isEnableLiteMode = useAuthStore((state) => state.enabledLiteMode);
  const setIsEnabledLiteMode = useAuthStore(
    (state) => state.updateEnabledLiteMode,
  );
  const isStopTrackingEnabled = useAuthStore(
    (state) => state.enabledStopTracking,
  );

  const setEnableStopTracking = useAuthStore(
    (state) => state.updateEnabledStopTracking,
  );

  const isEnabledWebLLM = useAuthStore((state) => state.webLLMEnabled);
  const setEnableWebLLM = useAuthStore((state) => state.updateWebLLMEnabled);

  useEffect(() => {
    if (!enabled) {
      setDays(null);
    }
  }, [enabled]);

  useEffect(() => {
    if (userPreferencesQuery.data?.enableNavigationEntryExpiration) {
      setEnabled(true);
      setDays(userPreferencesQuery.data?.navigationEntryExpirationInDays);
    }
    setImageEncodingEnabled(
      userPreferencesQuery.data?.enableImageEncoding || false,
    );
    setExplicitContentFilterEnabled(
      userPreferencesQuery.data?.enableExplicitContentFilter || false,
    );
  }, [userPreferencesQuery.data]);

  const handleSavePreferences = async () => {
    updatePreferencesMutation.mutate({
      enableNavigationEntryExpiration: enabled,
      navigationEntryExpirationInDays: days || 0,
      enableImageEncoding: imageEncodingEnabled,
      enableExplicitContentFilter: explicitContentFilterEnabled,
      enableStopTracking: stopTrackingEnabledValue,
    });
    setIsEnabledLiteMode(enabledLiteMode);
    setEnableStopTracking(stopTrackingEnabledValue);
    setEnableWebLLM(webLLMEnabled);
  };

  useEffect(() => {
    setEnabledLiteMode(isEnableLiteMode);
    setStopTrackingEnabledValue(isStopTrackingEnabled);
    setWebLLMEnabled(isEnabledWebLLM);
  }, [isEnableLiteMode, isStopTrackingEnabled, isEnabledWebLLM]);

  return (
    <div className='flex flex-col tems-center h-full'>
      <div className='flex w-full justify-start pb-4 gap-4 items-center'>
        <div className='flex flex-col leading-none w-full justify-center items-center px-0 md:px-[40px] h-[40px]'>
          <Text
            fontSize={{ base: 'x-large', md: 'xx-large' }}
            fontWeight={'bold'}
          >
            Preferences
          </Text>
        </div>
      </div>
      {userPreferencesQuery.isLoading ? (
        <div className='flex w-full h-full items-center justify-center'>
          <Spinner size={'lg'} />
        </div>
      ) : (
        <>
          <div className='flex flex-col w-full min-h-[400px]'>
            <div className='flex flex-col w-full py-2'>
              <div className='flex flex-row w-full justify-between pb-2'>
                <Text fontSize={'medium'} fontWeight={700}>
                  AI Search on Images
                </Text>
                <Switch
                  size='md'
                  aria-label='AI Search on Images'
                  isChecked={imageEncodingEnabled}
                  onChange={(e) => setImageEncodingEnabled(e.target.checked)}
                />
              </div>
              <Text fontSize={14}>
                Enable to automatically generate captions and encode images.
              </Text>
            </div>
            <Divider />
            <div className='flex flex-col w-full py-2'>
              <div className='flex flex-row w-full justify-between pb-2'>
                <Text fontSize={'medium'} fontWeight={700}>
                  Explicit Filter
                </Text>
                <Switch
                  size='md'
                  isChecked={explicitContentFilterEnabled}
                  aria-label='Explicit Filter'
                  onChange={(e) =>
                    setExplicitContentFilterEnabled(e.target.checked)
                  }
                />
              </div>
              <Text fontSize={14}>Enable to filter out explicit content.</Text>
            </div>
            <Divider />
            <div className='flex flex-col w-full py-2'>
              <div className='flex flex-row w-full justify-between pb-2'>
                <Text fontSize={'medium'} fontWeight={700}>
                  Lite Mode
                </Text>
                <Switch
                  size='md'
                  isChecked={enabledLiteMode}
                  aria-label='Lite Mode'
                  onChange={(e) => setEnabledLiteMode(e.target.checked)}
                />
              </div>
              <Text fontSize={14}>
                Enable to reduce data usage and enhance performance. This
                records are not going to be included on the AI search results.
              </Text>
            </div>
            <Divider />
            <div className='flex flex-col w-full py-2'>
              <div className='flex flex-row w-full justify-between pb-2'>
                <Text fontSize={'medium'} fontWeight={700}>
                  History Entries Expiration
                </Text>
                <Switch
                  size='md'
                  isChecked={enabled}
                  aria-label='History Entries Expiration'
                  onChange={(e) => setEnabled(e.target.checked)}
                />
              </div>
              <Text fontSize={14}>
                Enable to automatically remove history entries after a specified
                number of days.
              </Text>
            </div>

            {enabled && (
              <div className='flex w-full py-2 items-center justify-between pb-2'>
                <div className='flex pr-4'>
                  <Text fontSize={14}>
                    Set the number of days before history entries expire.
                  </Text>
                </div>
                <Input
                  type='number'
                  name='days'
                  backgroundColor={'white'}
                  width={75}
                  value={days || ''}
                  isDisabled={!enabled}
                  onChange={(e) => setDays(parseInt(e.target.value))}
                />
              </div>
            )}

            <Divider />
            <div className='flex flex-col w-full py-2'>
              <div className='flex flex-row w-full justify-between pb-2'>
                <Text fontSize={'medium'} fontWeight={700}>
                  Stop Tracking
                </Text>
                <Switch
                  size='md'
                  isChecked={stopTrackingEnabledValue}
                  aria-label='Stop Tracking'
                  onChange={(e) =>
                    setStopTrackingEnabledValue(e.target.checked)
                  }
                />
              </div>
              <Text fontSize={14}>
                Enable to stop tracking your browsing history.
              </Text>
            </div>
            <Divider />
            <Flex marginBottom={1} marginTop={5} gap={1} alignItems={'center'}>
              <Text fontSize={'large'} fontWeight={700}>
                Labs
              </Text>
              <GrTest size={20} />
            </Flex>
            <Divider />
            <div className='flex flex-col w-full py-2'>
              <div className='flex flex-row w-full justify-between pb-2'>
                <Text fontSize={'medium'} fontWeight={700}>
                  Enable WebLLM
                </Text>
                <Switch
                  size='md'
                  isChecked={webLLMEnabled}
                  aria-label='Enable WebLLM'
                  onChange={(e) => setWebLLMEnabled(e.target.checked)}
                />
              </div>
              <Text fontSize={14}>
                Enable to use WebLLM for better search results
              </Text>
              <Text fontSize={10}>
                Note: This feature is still in development, it may consume more
                resources.
              </Text>
            </div>

            <Divider />
          </div>
          <div className='flex justify-center pb-8 pt-4'>
            <Button
              colorScheme='blue'
              isDisabled={enabled && !days}
              onClick={handleSavePreferences}
            >
              Save Changes
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
export default PreferencesScreen;
