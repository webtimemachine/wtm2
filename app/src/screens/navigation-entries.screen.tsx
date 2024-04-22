import React from 'react'
import { Button, Checkbox, Input, Text, IconButton } from '@chakra-ui/react'
import { CompleteNavigationEntryDto } from '../background/interfaces/navigation-entry'
import { useNavigationEntries } from '../hooks/use-navigation-entries.hook'
import { useLogout } from '../hooks/use-logout.hook'
import { SettingsIcon, SmallCloseIcon } from '@chakra-ui/icons'

export const NavigationEntriesScreen: React.FC<object> = () => {
  const { data } = useNavigationEntries()

  // TODO Delete logout function & button
  const { logout } = useLogout()

  return (
    <>
      <div className="flex flex-col px-5 py-3 bg-slate-100 min-h-screen items-center w-full">
        <div className='flex w-full justify-end'>
          <IconButton aria-label='Settings icon' onClick={() => console.log('hola')}>
            <SettingsIcon boxSize={5} />
          </IconButton>
        </div>
        <div className='pb-4'>
          <Text fontSize={'xx-large'} fontWeight={'bold'}>WebTM</Text>
        </div>
        <div className='flex flex-col w-full min-h-[400px] justify-between'>
          <div>
            <div className='pt-4 pb-2 flex w-full'>
              <Input type='text' name='search' placeholder='Search' backgroundColor={'white'} />
            </div>
            <div className='flex pb-2'>
              <Checkbox>Is semantic?</Checkbox>
            </div>
            <div className='flex flex-col w-full'>
              {data && data.items.length ? data.items.map((element: CompleteNavigationEntryDto) => {
                return <div key={element.id} className='flex w-full bg-white px-2 py-1 rounded mb-1 items-center justify-between'>
                  <Text fontSize={'small'} className='overflow-hidden truncate'>{new Date(element.navigationDate).toLocaleString()} - {element.title}</Text>
                  <SmallCloseIcon boxSize={5} />
                </div>
              }) : <div>
                <Text fontSize={'small'}>No results found. Try different search terms!</Text>
              </div>}
            </div>
          </div>

          <div className='flex w-full justify-between pt-4'>
            <Button
              colorScheme="blue"
            >
              &larr;
            </Button>
            <Button
              colorScheme="blue"
              onClick={logout}
            >
              Logout
            </Button>
            <Button
              colorScheme="blue"
            >
              &rarr;
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}