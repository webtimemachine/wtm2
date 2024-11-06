import {
  Badge,
  Button,
  Checkbox,
  Divider,
  Icon,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Switch,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import React, { useEffect, useMemo, useState } from 'react';

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
import {
  useBulkDeleteNavigationEntries,
  useDeleteNavigationEntry,
  useNavigationEntries,
} from '../hooks';

import { useNavigation } from '../store';
import { getBrowserIconFromDevice } from '@wtm/utils';

import clsx from 'clsx';

import { updateIcon } from '../utils/updateIcon';
import Markdown from 'react-markdown';
import { BiTrash } from 'react-icons/bi';

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
const RelevantSegment = ({
  relevantSegment,
  tags,
}: {
  relevantSegment: string;
  tags?: string[];
}) => {
  const markdown = getPreProcessedMarkDown(relevantSegment);
  const colorTags: { [key: number]: string } = {
    0: 'teal',
    1: 'red',
    2: 'orange',
    3: 'green',
    4: 'purple',
    5: 'yellow',
    6: 'blue',
    7: 'cyan',
    8: 'pink',
  };
  const getRandomColor = (): string => {
    const keys = Object.keys(colorTags).map(Number) as Array<
      keyof typeof colorTags
    >;
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    return colorTags[randomKey];
  };
  return (
    <div>
      <Text textAlign={'center'} py={5} fontSize={'large'}>
        Relevant tags found
      </Text>
      <div className='w-full flex justify-center items-center gap-5 flex-wrap'>
        {tags &&
          tags.map((tag: string, index: number) => (
            <Badge key={index} colorScheme={getRandomColor()}>
              {tag.replace('_', ' ')}
            </Badge>
          ))}
      </div>
      <Divider py={5} />
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
  deleteProps?: {
    isDeleteOn: boolean;
    onSelect: (id: number, add: boolean) => void;
    currentSelectedEntries: number[];
  };
}

const NavigationEntry = ({
  element,
  BrowserIcon,
  deleteNavEntry,
  processOpenLink,
  deleteProps,
}: NavEntryProps) => {
  const [visible, setVisible] = useState<boolean>(false);
  useEffect(() => {
    setVisible(false);
  }, [element]);
  return (
    <div className='flex flex-col w-full bg-white px-2 py-1 rounded-lg mb-1 gap-3'>
      <div key={element.id} className='flex items-center justify-between'>
        <div className='flex gap-2'>
          {deleteProps && deleteProps.isDeleteOn && (
            <Checkbox
              isChecked={deleteProps.currentSelectedEntries.includes(
                element.id,
              )}
              onChange={(r) =>
                deleteProps.onSelect(element.id, r.target.checked)
              }
            />
          )}
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
          {element.aiGeneratedContent && (
            <IconButton
              aria-label={
                visible ? 'hide relevant result' : 'show relevant result'
              }
              size='xs'
              icon={visible ? <ChevronUpIcon /> : <ChevronDownIcon />}
              onClick={() => setVisible(!visible)}
            />
          )}

          {deleteProps && !deleteProps.isDeleteOn && (
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
          )}
        </div>
      </div>
      {element.aiGeneratedContent && visible && (
        <RelevantSegment
          relevantSegment={element.aiGeneratedContent}
          tags={element.tags}
        />
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
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedForDelete, setSelectedForDelete] = useState<number[]>([]);
  const [isBulkDeleteOn, setIsBulkDeleteOn] = useState<boolean>(false);
  const [isSemantic, setIsSemantic] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const offset = page * LIMIT;
  const limit = LIMIT;
  const { deleteBulkNavigationEntriesMutation } =
    useBulkDeleteNavigationEntries();
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
  }, [
    page,
    isSemantic,
    deleteNavigationEntryMutation.isSuccess,
    deleteBulkNavigationEntriesMutation?.isSuccess,
  ]);

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
  const handleBulkDelete = () => {
    if (selectedForDelete.length > 0) {
      deleteBulkNavigationEntriesMutation.mutate({
        navigationEntryIds: selectedForDelete,
      });

      setSelectedForDelete([]);
      setIsBulkDeleteOn(false);
      setPage(0);
    }
    onClose();
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
  const isDisabled = useMemo(() => {
    return selectedForDelete.length === 0;
  }, [selectedForDelete.length]);

  const isAddOrRemove = useMemo(() => {
    const truthArr = navigationEntries
      .map((element: CompleteNavigationEntryDto) => {
        return selectedForDelete.includes(element.id);
      })
      .filter((x) => !x);
    return truthArr.length > 0;
  }, [selectedForDelete, navigationEntries]);
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

          <div className='flex py-1 justify-between'>
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
            <div
              className='flex items-center gap-1 p-1 h-[32px] select-none cursor-pointer hover:bg-white rounded-lg'
              data-testid='bulk-delete-container'
              onClick={() => {
                setIsBulkDeleteOn((value) => !value);
                if (isBulkDeleteOn) setSelectedForDelete([]);
              }}
            >
              <BiTrash />
              <Text className='text-slate-600 mr-1' fontSize='small'>
                Bulk Delete
              </Text>
              <Switch
                size='sm'
                aria-label='Bulk Delete'
                isChecked={isBulkDeleteOn}
                onChange={() => {
                  setIsBulkDeleteOn((value) => !value);
                  if (isBulkDeleteOn) setSelectedForDelete([]);
                }}
              />
            </div>
          </div>

          {isBulkDeleteOn && (
            <div className='flex justify-between w-full gap-2 px-2 pb-3'>
              <div className='flex items-center gap-2'>
                <Button
                  colorScheme='blue'
                  size='sm'
                  onClick={() => {
                    if (isAddOrRemove)
                      setSelectedForDelete((oldState) => {
                        return [
                          ...oldState,
                          ...navigationEntries
                            .filter(
                              (element: CompleteNavigationEntryDto) =>
                                !selectedForDelete.includes(element.id),
                            )
                            .map((element: CompleteNavigationEntryDto) => {
                              return element.id;
                            }),
                        ];
                      });
                    else
                      setSelectedForDelete((oldState) => {
                        const currentEntries = navigationEntries.map(
                          (element: CompleteNavigationEntryDto) => {
                            return element.id;
                          },
                        );
                        const filteredOldState = oldState.filter(
                          (id) => !currentEntries.includes(id),
                        );
                        return filteredOldState;
                      });
                  }}
                >
                  {isAddOrRemove
                    ? 'Check page entries'
                    : 'Uncheck page entries'}
                </Button>
                <Text className='text-slate-600 mr-1' fontSize='small'>
                  Selected {selectedForDelete.length}
                </Text>
              </div>

              <Button
                isDisabled={isDisabled}
                colorScheme='red'
                size='sm'
                onClick={onOpen}
              >
                <BiTrash />
              </Button>
              <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>Navigation Entries Bulk Delete</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody>
                    <div>
                      You are about to delete {selectedForDelete.length}{' '}
                      entries. Please, check if you are not sure about which
                      entries you are about to delete, go back and check. This
                      action is irreversible.
                    </div>
                  </ModalBody>

                  <ModalFooter>
                    <Button colorScheme='red' mr={3} onClick={handleBulkDelete}>
                      Delete
                    </Button>
                    <Button variant='ghost' onClick={onClose}>
                      Close
                    </Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
            </div>
          )}
        </div>

        <div
          id='content'
          className='flex flex-col w-full h-full overflow-y-auto scrollbar pr-1'
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
                  deleteProps={{
                    isDeleteOn: isBulkDeleteOn,
                    onSelect: (id: number, add: boolean) => {
                      if (add) {
                        const newArr = [...selectedForDelete, id];

                        setSelectedForDelete(newArr);
                      } else {
                        if (selectedForDelete.length == 1) {
                          setSelectedForDelete([]);
                        } else {
                          const updatedArray = selectedForDelete.filter(
                            (item) => item != id,
                          );
                          setSelectedForDelete(updatedArray);
                        }
                      }
                    },
                    currentSelectedEntries: selectedForDelete,
                  }}
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
