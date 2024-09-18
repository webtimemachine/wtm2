import {
  Button,
  Icon,
  IconButton,
  Input,
  Spinner,
  Switch,
  Text,
  useToast,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';

import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  SettingsIcon,
  SmallCloseIcon,
} from '@chakra-ui/icons';
import { BsStars } from 'react-icons/bs';
import { IconType } from 'react-icons';

import { CompleteNavigationEntryDto } from '@wtm/api';
import { useDeleteNavigationEntry, useNavigationEntries } from '../hooks';

import { useNavigation } from '../store';
import { getBrowserIconFromDevice } from '../utils';

import clsx from 'clsx';

import { updateIcon } from '../utils/updateIcon';
import Markdown from 'react-markdown';
const truncateString = (str: string, maxLength: number) => {
  return str.length <= maxLength ? str : str.slice(0, maxLength) + '...';
};
const getPreProcessedMarkDown = (relevantSegment: string) => {
  const emptyListPatterns = [
    /\*\n(\*\n)*/g, // matches lines with only *
    /-\n(-\n)*/g, // matches lines with only -
    /- \*\*\n(\*+\n)*/g, // matches lines with only - ** and *+
    /\n\s*\*\*\n(\s*\*+\n)*/g, // matches lines with ** and *+ with spaces
    /- \*\n(\s*\*\n)*/g, // matches lines with - * and *+
    /\n\s*\*\n(\s*\*\n)*/g, // matches lines with * and *+ with spaces
    /\n\s*-\n(\s*-\n)*/g, // matches lines with - and -+ with spaces
  ];
  let markdown = relevantSegment;
  emptyListPatterns.forEach((pattern) => {
    markdown = markdown.replace(pattern, '');
  });
  markdown = markdown.replace(/\n{2,}/g, '\n\n');
  return markdown || '';
};
const RelevantSegment = ({ relevantSegment }: { relevantSegment: string }) => {
  const markdown = getPreProcessedMarkDown(relevantSegment);
  return (
    <div>
      <p className='font-semibold mb-4'>Most relevant match</p>
      <div className='markdown-content'>
        <Markdown>{markdown}</Markdown>
      </div>
    </div>
  );
};

export interface NavEntryProps {
  element: CompleteNavigationEntryDto;
  BrowserIcon: IconType;
  deleteNavEntry: ({ id }: { id: number }) => void;
  processOpenLink: (url: string) => Promise<void>;
  isSemantic: boolean;
}

const NavigationEntry = ({
  element,
  BrowserIcon,
  deleteNavEntry,
  processOpenLink,
  isSemantic,
}: NavEntryProps) => {
  const [visible, setVisible] = useState<boolean>(false);

  return (
    <div className='flex flex-col w-full bg-white px-2 py-1 rounded-lg mb-1 gap-3'>
      <div key={element.id} className='flex items-center justify-between'>
        <div className='flex gap-2'>
          <div className='flex justify-center items-center'>
            <Icon as={BrowserIcon} boxSize={6} color='gray.600' />
          </div>
          <div className='flex flex-col w-full'>
            <Text
              className='cursor-pointer hover:underline'
              fontSize={'small'}
              {...(element.liteMode && {
                fontWeight: 'bold',
                fontStyle: 'italic',
              })}
              onClick={() => processOpenLink(element.url)}
            >
              {truncateString(element.title, 40)}
            </Text>
            <Text
              className='text-slate-600'
              fontSize={'smaller'}
              {...(element.liteMode && {
                fontStyle: 'italic',
              })}
            >
              {new Date(element.navigationDate).toLocaleString()}
              {element.liteMode && <span className='italic'> - Lite Mode</span>}
            </Text>
          </div>
        </div>
        <div className='space-x-2 flex items-center justify-center'>
          {element.relevantSegment && (
            <IconButton
              aria-label={
                visible ? 'hide relevant result' : 'show relevant result'
              }
              size='xs'
              icon={visible ? <ChevronUpIcon /> : <ChevronDownIcon />}
              onClick={() => setVisible(!visible)}
            />
          )}
          <IconButton
            aria-label='delete navigation entry'
            size='xs'
            icon={<SmallCloseIcon />}
            onClick={() => {
              deleteNavEntry({
                id: element.id,
              });
            }}
          />
        </div>
      </div>
      {isSemantic && element.relevantSegment && visible && (
        <RelevantSegment relevantSegment={element.relevantSegment} />
      )}
    </div>
  );
};

export const NavigationEntriesScreen: React.FC<object> = () => {
  updateIcon(true);

  const { navigateTo } = useNavigation();
  const toast = useToast();

  const LIMIT = 16;
  const [page, setPage] = useState<number>(0);
  const [query, setQuery] = useState<string>('');
  const [isSemantic, setIsSemantic] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const offset = page * LIMIT;
  const limit = LIMIT;

  const { deleteNavigationEntryMutation } = useDeleteNavigationEntry();
  const { navigationEntriesQuery } = useNavigationEntries({
    offset,
    limit,
    query,
    isSemantic,
  });

  const navigationEntries = navigationEntriesQuery?.data?.items || [];
  const count = navigationEntriesQuery?.data?.count || 0;
  const pagesCount = Math.ceil(count / limit);

  useEffect(() => {
    navigationEntriesQuery.refetch();
  }, [page, isSemantic, deleteNavigationEntryMutation.isSuccess]);

  useEffect(() => {
    if (navigationEntriesQuery.isError) {
      toast({
        status: 'error',
        title: 'An error has occurred!',
        description:
          'It may be that the service is temporarily disabled. Please try again later',
        duration: 3000,
        isClosable: true,
      });
    }
  }, [navigationEntriesQuery.error]);

  const search = async () => {
    setIsLoading(true);
    setPage(0);
    await navigationEntriesQuery.refetch();
    setIsLoading(false);
  };

  const prev = () => page > 0 && setPage(page - 1);
  const next = () => !(offset + limit >= count) && setPage(page + 1);

  const processOpenLink = async (url: string) => {
    const result = await chrome.tabs.query({ url });
    if (result?.length >= 1 && result[0].id) {
      chrome.tabs.update(result[0].id, { active: true });
    } else {
      chrome.tabs.create({ url, active: true });
    }
  };

  return (
    <>
      <div className='flex flex-col px-5 py-3 items-center w-full min-h-[600px] h-screen'>
        <div className='flex flex-col w-full'>
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

          <div className='pt-4 flex w-full'>
            <Input
              type='text'
              name='search'
              placeholder='Search'
              backgroundColor={'white'}
              onChange={(e) => setQuery(e.target.value)}
              onKeyUp={(e) => {
                if (e.key === 'Enter') {
                  search();
                }
              }}
            />
            <div className='pl-4'>
              <Button
                colorScheme='blue'
                onClick={() => search()}
                isLoading={isLoading}
              >
                Search
              </Button>
            </div>
          </div>

          <div className='flex py-1'>
            <div
              className='flex items-center gap-1 p-1 h-[32px] select-none cursor-pointer hover:bg-white rounded-lg'
              data-testid='ia-search-container'
              onClick={() => setIsSemantic((value) => !value)}
            >
              <Icon
                className={clsx([
                  isSemantic ? 'fill-blue-500' : 'fill-gray-500',
                ])}
                as={BsStars}
                boxSize={4}
              />
              <Text className='text-slate-600 mr-1' fontSize='small'>
                AI Search
              </Text>
              <Switch
                size='sm'
                aria-label='AI Search'
                isChecked={isSemantic}
                onChange={() => setIsSemantic((value) => !value)}
              />
            </div>
          </div>
        </div>

        <div
          id='content'
          className='flex flex-col w-full h-full min-h-[350px] overflow-y-auto scrollbar pr-1'
        >
          {navigationEntries && navigationEntries.length ? (
            navigationEntries.map((element: CompleteNavigationEntryDto) => {
              const BrowserIcon = getBrowserIconFromDevice(
                element.userDevice.device,
              );

              return (
                <NavigationEntry
                  BrowserIcon={BrowserIcon}
                  deleteNavEntry={deleteNavigationEntryMutation.mutate}
                  processOpenLink={processOpenLink}
                  element={element}
                  isSemantic={isSemantic}
                />
              );
            })
          ) : !navigationEntriesQuery.isLoading ? (
            <div>
              <Text fontSize={'small'}>
                No results found. Try different search terms!
              </Text>
            </div>
          ) : null}
          {navigationEntriesQuery.isLoading && (
            <div className='flex w-full h-full items-center justify-center'>
              <Spinner size={'lg'} />
            </div>
          )}
        </div>

        <div className='flex w-full justify-between items-center py-4'>
          <IconButton
            colorScheme='blue'
            icon={<ChevronLeftIcon />}
            aria-label='left'
            isDisabled={offset === 0}
            onClick={() => prev()}
          />
          <div
            className='select-none'
            onWheel={(e) => {
              if (e.deltaY < 0) next();
              else prev();
            }}
          >
            {pagesCount ? (
              <Text className='text-slate-600' fontSize='medium'>
                {page + 1}
                {' / '}
                {pagesCount}
              </Text>
            ) : (
              <Text className='text-slate-600' fontSize='medium'>
                -
              </Text>
            )}
          </div>
          <IconButton
            colorScheme='blue'
            icon={<ChevronRightIcon />}
            aria-label='right'
            isDisabled={offset + limit >= count}
            onClick={() => next()}
          />
        </div>
      </div>
    </>
  );
};
