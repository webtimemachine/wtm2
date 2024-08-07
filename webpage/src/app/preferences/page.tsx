'use client';

import React, { useEffect, useState } from 'react';
import {
  Text,
  IconButton,
  Switch,
  Input,
  Button,
  Divider,
} from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { useGetPreferences, useUpdatePreferences } from '../../hooks';
import { useAuthStore, useNavigation } from '../../store';

const PreferencesScreen: React.FC<object> = () => {
  const [enabled, setEnabled] = useState(false);
  const [enabledLiteMode, setEnabledLiteMode] = useState(false);
  const [imageEncodingEnabled, setImageEncodingEnabled] = useState(false);
  const [explicitContentFilterEnabled, setExplicitContentFilterEnabled] =
    useState(false);
  const [days, setDays] = useState<number | null>(null);
  const { navigateBack } = useNavigation();
  const { userPreferencesQuery } = useGetPreferences();
  const { updatePreferencesMutation } = useUpdatePreferences();

  const isEnableLiteMode = useAuthStore((state) => state.enabledLiteMode);
  const setIsEnabledLiteMode = useAuthStore(
    (state) => state.updateEnabledLiteMode,
  );

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
    });
    setIsEnabledLiteMode(enabledLiteMode);
  };

  useEffect(() => {
    setEnabledLiteMode(isEnableLiteMode);
  }, []);

  return (
    <div className='flex justify-center items-center  w-full h-1/2'>
      <div className='flex flex-col px-5 py-3 items-center max-w-6xl min-w-[360px] w-3/4 min-h-[600px] h-screen'>
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
              Enable to reduce data usage and enhance performance. This records
              are not going to be included on the AI search results.
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
      </div>
    </div>
  );
};
export default PreferencesScreen;
