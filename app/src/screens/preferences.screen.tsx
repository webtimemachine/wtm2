import React, { useEffect, useState } from 'react';
import { Text, IconButton, Switch, Input, Button } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { useGetPreferences, useUpdatePreferences } from '../hooks';
import { useNavigation } from '../store';

export const PreferencesScreen: React.FC<object> = () => {
  const [enabled, setEnabled] = useState(false);
  const [enabledLiteMode, setEnabledLiteMode] = useState(false);
  const [imageEncodingEnabled, setImageEncodingEnabled] = useState(false);
  const [explicitContentFilterEnabled, setExplicitContentFilterEnabled] = useState(false);
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
    )
  }, [userPreferencesQuery.data]);

  const handleSavePreferences = async () => {
    updatePreferencesMutation.mutate({
      enableNavigationEntryExpiration: enabled,
      navigationEntryExpirationInDays: days || 0,
      enableImageEncoding: imageEncodingEnabled,
      enableExplicitContentFilter: explicitContentFilterEnabled
    });

    await chrome.storage.local.set({
      enabledLiteMode,
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
        <div className='flex flex-col w-full min-h-[400px]'>
          <div className='flex w-full py-2 justify-between items-center'>
            <Text fontSize={'medium'}>
              Enable image captioning and encoding
            </Text>
            <Switch
              size='md'
              isChecked={imageEncodingEnabled}
              onChange={(e) => setImageEncodingEnabled(e.target.checked)}
            />
          </div>
          <div className='flex w-full py-2 justify-between items-center'>
            <Text fontSize={'medium'}>
              Enable explicit content filter
            </Text>
            <Switch
              size='md'
              isChecked={explicitContentFilterEnabled}
              onChange={(e) => setExplicitContentFilterEnabled(e.target.checked)}
            />
          </div>
          <div className='flex w-full py-2 justify-between items-center'>
            <Text fontSize={'medium'}>Enable Lite Mode</Text>
            <Switch
              size='md'
              isChecked={enabledLiteMode}
              onChange={(e) => setEnabledLiteMode(e.target.checked)}
            />
          </div>
          <div className='flex w-full py-2 justify-between items-center'>
            <Text fontSize={'medium'}>
              Enable expirantion date on History entries
            </Text>
            <Switch
              size='md'
              isChecked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
            />
          </div>
          <div className='flex w-full py-2 justify-between items-center'>
            <Text fontSize={'medium'}>Expiration time in days:</Text>
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
        </div>
        <div className='pb-8'>
          <Button
            colorScheme='blue'
            isDisabled={enabled && !days}
            onClick={handleSavePreferences}
          >
            Save
          </Button>
        </div>
      </div>
    </>
  );
};
