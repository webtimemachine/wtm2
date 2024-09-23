'use client';

import {
  AbsoluteCenter,
  Badge,
  Box,
  Divider,
  Icon,
  IconButton,
  Input,
  Spinner,
  Switch,
  Text,
  Tooltip,
  useToast,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  SearchIcon,
  SmallCloseIcon,
} from '@chakra-ui/icons';
import { IconType } from 'react-icons';
import { BsStars } from 'react-icons/bs';

import { useDeleteNavigationEntry, useNavigationEntries } from '../../hooks';
import { CompleteNavigationEntryDto } from '@wtm/api';

import { getBrowserIconFromDevice } from '../../utils';

import clsx from 'clsx';

import Markdown from 'react-markdown';
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
      <div className='relative p-5'>
        <Divider />
        <div className='absolute left-1/2 top-0 h-full transform -translate-x-1/2 bg-white px-4 flex justify-center items-center'>
          <p className='font-bold truncate text-gray-600'>
            Most relevant match
          </p>
        </div>
      </div>
      <div className='markdown-content'>
        <Markdown>{markdown}</Markdown>
      </div>
    </div>
  );
};

declare global {
  interface Window {
    webkit: any;
  }
}

const NavigationEntriesScreen: React.FC = () => {
  const LIMIT = 16;
  const [page, setPage] = useState<number>(0);
  const [query, setQuery] = useState<string>('');
  const [isSemantic, setIsSemantic] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const toast = useToast();

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
    setLoading(true);
    setPage(0);
    await navigationEntriesQuery.refetch();
    setLoading(false);
  };

  const prev = () => page > 0 && setPage(page - 1);
  const next = () => !(offset + limit >= count) && setPage(page + 1);

  return (
    <div className='flex flex-col h-full'>
      <div className='flex flex-col w-full'>
        <div className='flex w-full justify-start pb-4 gap-4 items-center'>
          <div className='flex flex-col leading-none w-full justify-center items-center px-[40px] md:px-0 h-[40px]'>
            <Text
              fontSize={{ base: 'x-large', md: 'xx-large' }}
              fontWeight={'bold'}
            >
              Navigation History
            </Text>
          </div>
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
            <IconButton
              aria-label='Menu'
              colorScheme='blue'
              onClick={() => search()}
              isLoading={loading}
            >
              <SearchIcon boxSize={5} />
            </IconButton>
          </div>
        </div>

        <div className='flex py-1'>
          <div
            className='flex items-center gap-1 p-1 h-[32px] select-none cursor-pointer hover:bg-white rounded-lg'
            data-testid='ia-search-container'
            onClick={() => setIsSemantic((value) => !value)}
          >
            <Icon
              className={clsx([isSemantic ? 'fill-blue-500' : 'fill-gray-500'])}
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
          navigationEntries.map((element: CompleteNavigationEntryDto, i) => {
            const BrowserIcon = getBrowserIconFromDevice(
              element.userDevice.device,
            );
            return (
              <NavigationEntry
                key={i}
                BrowserIcon={BrowserIcon}
                deleteNavEntry={deleteNavigationEntryMutation.mutate}
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

      <div className='flex w-full justify-between items-center pt-4'>
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
  );
};
export default NavigationEntriesScreen;

export interface NavigationEntryProps {
  element: CompleteNavigationEntryDto;
  BrowserIcon: IconType;
  deleteNavEntry: ({ id }: { id: number }) => void;
  isSemantic: boolean;
}

const NavigationEntry: React.FC<NavigationEntryProps> = ({
  element,
  BrowserIcon,
  deleteNavEntry,
  isSemantic,
}: NavigationEntryProps) => {
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    setVisible(false);
  }, [element]);

  return (
    <div className='flex flex-col w-full bg-white px-2 py-1 rounded-lg mb-1 gap-3'>
      <div key={element.id} className='flex items-center justify-between'>
        <div className='flex gap-2'>
          <div className='flex justify-center items-center'>
            <Icon as={BrowserIcon} boxSize={6} color='gray.600' />
          </div>
          <div className='flex flex-col w-full'>
            <Tooltip label={element.title}>
              <Text
                as={'a'}
                href={element.url}
                target='_blank'
                rel='noreferrer'
                className='cursor-pointer hover:underline'
                noOfLines={1}
                fontSize={'small'}
                {...(element.liteMode && {
                  fontWeight: 'bold',
                })}
              >
                {element.title}
              </Text>
            </Tooltip>
            <Text className='text-slate-600' fontSize={'smaller'}>
              {new Date(element.navigationDate).toLocaleString()}
            </Text>
          </div>
          <div className='flex justify-center items-center m-3'>
            {element.liteMode && <Badge colorScheme='teal'>Lite Mode</Badge>}
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
