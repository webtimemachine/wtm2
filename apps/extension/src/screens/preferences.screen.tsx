import React, { useEffect, useState } from 'react';
import {
  Text,
  IconButton,
  Switch,
  Input,
  Button,
  Divider,
  Spinner,
  Flex,
} from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { useGetPreferences, useUpdatePreferences } from '../hooks';
import { useNavigation } from '../store';
import { updateIcon } from '../utils/updateIcon';
import { GrTest } from 'react-icons/gr';

export const PreferencesScreen: React.FC<object> = () => {
  const [enabled, setEnabled] = useState(false);
  const [enabledLiteMode, setEnabledLiteMode] = useState(false);
  const [imageEncodingEnabled, setImageEncodingEnabled] = useState(false);
  const [explicitContentFilterEnabled, setExplicitContentFilterEnabled] =
    useState(false);
  const [stopTrackingEnabled, setStopTrackingEnabled] = useState(false);
  const [webLLMEnabled, setWebLLMEnabled] = useState(false);
  const [days, setDays] = useState<number | null>(null);
  const { navigateBack } = useNavigation();
  const { userPreferencesQuery } = useGetPreferences();
  const { updatePreferencesMutation } = useUpdatePreferences();

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
    setStopTrackingEnabled(
      userPreferencesQuery.data?.enableStopTracking || false,
    );
  }, [userPreferencesQuery.data]);

  useEffect(() => {
    if (updatePreferencesMutation.isSuccess) {
      updateIcon(true);
    }
  }, [updatePreferencesMutation.isSuccess]);

  const handleSavePreferences = async () => {
    updatePreferencesMutation.mutate({
      enableNavigationEntryExpiration: enabled,
      navigationEntryExpirationInDays: days || 0,
      enableImageEncoding: imageEncodingEnabled,
      enableExplicitContentFilter: explicitContentFilterEnabled,
      enableStopTracking: stopTrackingEnabled,
    });
    await chrome.storage.local.set({
      enabledLiteMode,
      stopTrackingEnabled,
      webLLMEnabled,
    });
  };

  useEffect(() => {
    const getLiteModeSettings = async () => {
      const { enabledLiteMode: isEnableLiteMode } =
        await chrome.storage.local.get(['enabledLiteMode']);

      setEnabledLiteMode(isEnableLiteMode);
    };

    getLiteModeSettings();
  }, []);

  useEffect(() => {
    const getWebLLMSettings = async () => {
      const { webLLMEnabled: isWebLLMEnabled } = await chrome.storage.local.get(
        ['webLLMEnabled'],
      );

      setWebLLMEnabled(isWebLLMEnabled);
    };

    getWebLLMSettings();
  }, []);

  return (
    <>
      <div className='flex flex-col px-5 py-3 items-center w-full'>
        <div className='flex w-full justify-start pb-4 gap-4 items-center'>
          <IconButton aria-label='Back icon' onClick={() => navigateBack()}>
            <ArrowBackIcon boxSize={5} />
          </IconButton>
          <div className='flex w-full justify-center pr-[40px]'>
            <Text fontSize={'xx-large'} fontWeight={'bold'}>
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
                <Text fontSize={14}>
                  Enable to filter out explicit content.
                </Text>
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
                  Enable to automatically remove history entries after a
                  specified number of days.
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

              <div className='flex flex-col w-full py-2'>
                <div className='flex flex-row w-full justify-between pb-2'>
                  <Text fontSize={'medium'} fontWeight={700}>
                    Stop Tracking
                  </Text>
                  <Switch
                    size='md'
                    isChecked={stopTrackingEnabled}
                    aria-label='Stop Tracking'
                    onChange={(e) => setStopTrackingEnabled(e.target.checked)}
                  />
                </div>
                <Text fontSize={14}>
                  Enable to stop tracking your search history.
                </Text>
              </div>
              <Divider />
              <Flex
                marginBottom={1}
                marginTop={5}
                gap={1}
                alignItems={'center'}
              >
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
                  Note: This feature is still in development, it may consume
                  more resources.
                </Text>
              </div>

              <Divider />
            </div>
            <div className='pb-8 pt-4'>
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
    </>
  );
};
