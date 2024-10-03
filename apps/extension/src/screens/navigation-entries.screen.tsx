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
  ChevronLeftIcon,
  ChevronRightIcon,
  SettingsIcon,
  SmallCloseIcon,
} from '@chakra-ui/icons';
import { BsStars } from 'react-icons/bs';
import { IconType } from 'react-icons';

import { CompleteNavigationEntryDto } from '@wtm/api';
import { useDeleteNavigationEntry, useNavigationEntries } from '../hooks';

import { useNavigation } from '../store';
import { getBrowserIconFromDevice } from '@wtm/utils';

import clsx from 'clsx';

import { updateIcon } from '../utils/updateIcon';
import Markdown from 'react-markdown';
import { useWebLLM } from '../hooks/use-web-llm.hook';
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
  const [aiResult, setAiResult] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const { engine } = useWebLLM();

  const generateAiResult = async () => {
    try {
      setLoading(true);
      const result = await engine?.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: `
              # IDENTITY and PURPOSE
  
              You are an expert content summarizer. You take semantic markdown content in and output a Markdown formatted summary using the format below. Also, you are an expert code formatter in markdown, making code more legible and well formatted.
  
              Take a deep breath and think step by step about how to best accomplish this goal using the following steps.
  
              # OUTPUT SECTIONS
  
              - Combine all of your understanding of the content into a single, 20-word sentence in a section called Search Summary:.
  
              - Output the 10 if exists, including most important points of the content as a list with no more than 15 words per point into a section called Main Points:.
  
              - Output a list of the 5 best takeaways from the content in a section called Takeaways:.
  
              - Output code must be formatted with Prettier like.
  
              - Output a section named Code: that shows a list of code present in INPUT content in markdown
  
              - Output a section named Tags found: that shows in a list of tags you find
  
              # OUTPUT INSTRUCTIONS
  
              - Create the output using the formatting above.
              - You only output human readable Markdown.
              - Sections MUST be in capital case.
              - Sections must be h2 to lower.
              - Output numbered lists, not bullets.
              - Do not output warnings or notes—just the requested sections.
              - Do not repeat items in the output sections.
              - Do not start items with the same opening words.
              - Do not show Code: section if no code is present on input provided.
              - You must detect the type of code and add it to code block so markdown styles are applied.
              - Set codes proper language if you can detect it.
              - Detect code and apply format to it.
              - The wrapped tags must be tags that you find from page information.
              - Tags must be a link that redirects to source url.
              # INPUT:
            `,
          },
          {
            role: 'user',
            content: `
              INPUT:
              URL: ${element.url}
              ${element.relevantSegment}
            `,
          },
        ],
      });

      if (result) {
        setAiResult(result.choices[0].message.content || '');
        setVisible(true);
      }
    } catch (error) {
      console.log('error', error);
    } finally {
      setLoading(false);
    }
  };

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
              icon={loading ? <Spinner size='xs' /> : <BsStars />}
              onClick={() => generateAiResult()}
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
      {isSemantic && aiResult && visible && (
        <RelevantSegment relevantSegment={aiResult} />
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
