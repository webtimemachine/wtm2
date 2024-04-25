import React, { useEffect, useState } from 'react';
import { Button, Checkbox, Input, Text, IconButton } from '@chakra-ui/react';
import { CompleteNavigationEntryDto } from '../background/interfaces/navigation-entry.interface';
import { useNavigationEntries } from '../hooks/use-navigation-entries.hook';
import { SettingsIcon, SmallCloseIcon } from '@chakra-ui/icons';
import { useNavigationStore } from '../store';

export const NavigationEntriesScreen: React.FC<object> = () => {
  const { navigateTo } = useNavigationStore();

  const LIMIT = 8;
  const [page, setPage] = useState<number>(0);
  const [query, setQuery] = useState<string>('');
  const [isSemantic, setIsSemantic] = useState<boolean>(false);

  const offset = page * LIMIT;
  const limit = LIMIT;

  const { navigationEntriesQuery } = useNavigationEntries({
    offset,
    limit,
    query,
    isSemantic,
  });

  const navigationEntries = navigationEntriesQuery?.data?.items;
  const count = navigationEntriesQuery?.data?.count || 0;

  useEffect(() => {
    navigationEntriesQuery.refetch();
  }, [page, isSemantic, navigationEntriesQuery]);

  return (
    <>
      <div className='flex flex-col px-5 py-3 bg-slate-100 min-h-screen items-center w-full'>
        <div className='flex w-full justify-start pb-4 gap-4 items-center'>
          <div className='flex w-full justify-center pl-[40px]'>
            <Text fontSize={'xx-large'} fontWeight={'bold'}>
              WebTM
            </Text>
          </div>
          <IconButton
            aria-label='Back icon'
            onClick={() => navigateTo('settings')}
          >
            <SettingsIcon boxSize={5} />
          </IconButton>
        </div>
        <div className='flex flex-col w-full min-h-[400px] justify-between'>
          <div>
            <div className='pt-4 pb-2 flex w-full'>
              <Input
                type='text'
                name='search'
                placeholder='Search'
                backgroundColor={'white'}
                onChange={(e) => setQuery(e.target.value)}
              />
              <div className='pl-4'>
                <Button
                  colorScheme='blue'
                  onClick={() => {
                    navigationEntriesQuery.refetch();
                  }}
                >
                  Search
                </Button>
              </div>
            </div>
            <div className='flex pb-2'>
              <Checkbox onChange={(e) => setIsSemantic(e.target.checked)}>
                Is semantic?
              </Checkbox>
            </div>
            <div className='flex flex-col w-full'>
              {navigationEntries && navigationEntries.length ? (
                navigationEntries.map((element: CompleteNavigationEntryDto) => {
                  return (
                    <div
                      key={element.id}
                      className='flex w-full bg-white px-2 py-1 rounded mb-1 items-center justify-between'
                    >
                      <Text
                        fontSize={'small'}
                        className='overflow-hidden truncate'
                      >
                        {new Date(element.navigationDate).toLocaleString()} -{' '}
                        {element.title}
                      </Text>
                      <SmallCloseIcon boxSize={5} />
                    </div>
                  );
                })
              ) : (
                <div>
                  <Text fontSize={'small'}>
                    No results found. Try different search terms!
                  </Text>
                </div>
              )}
            </div>
          </div>

          <div className='flex w-full justify-between pt-4'>
            <Button
              colorScheme='blue'
              isDisabled={offset === 0}
              onClick={() => {
                page > 0 && setPage(page - 1);
              }}
            >
              &larr;
            </Button>
            <Button
              colorScheme='blue'
              isDisabled={offset >= count}
              onClick={() => setPage(page + 1)}
            >
              &rarr;
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
