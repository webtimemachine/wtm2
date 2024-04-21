import React from 'react'
import { Button, Input, Text } from '@chakra-ui/react'
import { CompleteNavigationEntryDto } from '../background/interfaces/navigation-entry'
import { useNavigationEntries } from '../hooks/use-navigation-entries.hook'
import { useLogout, useNavigationStore } from '../store'

export const NavigationEntriesScreen: React.FC<object> = () => {
  const { data } = useNavigationEntries()

  // TODO Delete logout function & button
  const { logout } = useLogout()
  const { navigateTo } = useNavigationStore()

  const handleLogout = () => {
    logout()
    navigateTo('login')
  }


  return (
    <>
      <div className="flex flex-col p-5 bg-slate-100 min-h-screen items-center w-full">
        <div className='pb-4'>
          <Text fontSize={'xx-large'} fontWeight={'bold'}>WebTM</Text>
        </div>
        <div className='flex flex-col w-full h-[400px] justify-between'>
          <div>
            <div className='p-4 flex w-full'>
              <Input type='text' name='search' placeholder='Search' backgroundColor={'white'} />
            </div>
            <div className='flex flex-col w-full'>
              {data && data.items.length ? data.items.map((element: CompleteNavigationEntryDto) => {
                return <div key={element.id} className='flex bg-white px-2 py-1 rounded mb-1 gap-1'>
                  <Text fontSize={'small'} className='overflow-hidden truncate'>{new Date(element.navigationDate).toLocaleString()} - {element.title}</Text>
                </div>
              }) : <div>
                <Text fontSize={'small'}>No results found. Try different search terms!</Text>
              </div>}
            </div>
          </div>

          <div className='flex w-full justify-between'>
            <Button
              colorScheme="blue"
            >
              &larr;
            </Button>
            <Button
              colorScheme="blue"
              onClick={handleLogout}
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