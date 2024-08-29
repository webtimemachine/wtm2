'use client';

import {
  Badge,
  Button,
  Icon,
  IconButton,
  Input,
  Spinner,
  Switch,
  Text,
  Tooltip,
  useDisclosure,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';

import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  HamburgerIcon,
  SmallCloseIcon,
} from '@chakra-ui/icons';
import { BsStars } from 'react-icons/bs';
import { useDeleteNavigationEntry, useNavigationEntries } from '../../hooks';
import {
  CompleteNavigationEntryDto,
  NavEntryProps,
} from '../../interfaces/navigation-entry.interface';
import { getBrowserIconFromDevice } from '../../utils';
import clsx from 'clsx';

import { CustomDrawer } from '../../components/custom-drawer';
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
      <p className='text-xs'></p>
      <div className='markdown-content'>
        <Markdown>{markdown}</Markdown>
      </div>
    </div>
  );
};

const NavigationEntry = ({
  element,
  BrowserIcon,
  deleteNavEntry,
  processOpenLink,
  isSemantic,
}: NavEntryProps) => {
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
            <Text
              className='cursor-pointer hover:underline'
              fontSize={'small'}
              {...(element.liteMode && {
                fontWeight: 'bold',
              })}
              onClick={() => processOpenLink(element.url)}
            >
              <Tooltip label={element.title}>
                {truncateString(element.title, 30)}
              </Tooltip>
            </Text>
            <Text className='text-slate-600' fontSize={'smaller'}>
              {new Date(element.navigationDate).toLocaleString()}
            </Text>
          </div>
          <div className='flex justify-center items-center m-3'>
            {element.liteMode && <Badge colorScheme='teal'>Lite Mode</Badge>}
          </div>
        </div>
        <div className='space-x-2'>
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
const NavigationEntriesScreen: React.FC<object> = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef<HTMLElement>(null);
  const LIMIT = 16;
  const [page, setPage] = useState<number>(0);
  const [query, setQuery] = useState<string>('');
  const [isSemantic, setIsSemantic] = useState<boolean>(true);

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

  const search = () => {
    setPage(0);
    navigationEntriesQuery.refetch();
  };

  const prev = () => page > 0 && setPage(page - 1);
  const next = () => !(offset + limit >= count) && setPage(page + 1);
  // Callback used for onClick Navigation Entry that redirects to te current element url.
  const processOpenLinkCallback = async (url: string): Promise<void> => {
    return new Promise((resolve) => {
      window.open(url, '_blank');
      resolve();
    });
  };

  return (
    <div className='flex justify-center items-center  w-full h-1/2'>
      <div className='flex flex-col px-5 py-3 items-center max-w-6xl min-w-[360px] w-3/4 min-h-[600px] h-screen'>
        <div className='flex flex-col w-full'>
          <div className='flex w-full justify-start pb-4 gap-4 items-center'>
            <IconButton aria-label='Back icon' onClick={onOpen}>
              <HamburgerIcon boxSize={5} />
            </IconButton>
            <div className='flex w-full justify-center pr-[40px]'>
              <Text fontSize={'xx-large'} fontWeight={'bold'}>
                WebTM
              </Text>
            </div>
          </div>

          <CustomDrawer isOpen={isOpen} onClose={onClose} btnRef={btnRef} />

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
              <Button colorScheme='blue' onClick={() => search()}>
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
            navigationEntries.map((element: CompleteNavigationEntryDto, i) => {
              const BrowserIcon = getBrowserIconFromDevice(
                element.userDevice.device,
              );
              return (
                <NavigationEntry
                  key={i}
                  BrowserIcon={BrowserIcon}
                  deleteNavEntry={deleteNavigationEntryMutation.mutate}
                  processOpenLink={processOpenLinkCallback}
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
    </div>
  );
};
export default NavigationEntriesScreen;
