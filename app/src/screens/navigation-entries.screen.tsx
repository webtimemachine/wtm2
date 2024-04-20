import React from 'react'
import { Button, Input, Text } from '@chakra-ui/react'
import { CompleteNavigationEntryDto } from '../background/interfaces/navigation-entry'
import { useNavigationEntries } from '../hooks/use-navigation-entries.hook'

export const NavigationEntriesScreen: React.FC<object> = () => {
  const { data } = useNavigationEntries()

  return (
    <>
      <div className="flex flex-col p-5 bg-slate-100 min-h-screen items-center w-full">
        <div className='pb-4'>
          <Text fontSize={'xx-large'} fontWeight={'bold'}>WebTM</Text>
        </div>
        <div className='p-4 flex w-full'>
          <Input type='text' name='search' placeholder='Search' backgroundColor={'white'} />
        </div>
        <div>
          {data && data.items.map((element: CompleteNavigationEntryDto) => {
            return <div key={element.id}>
              <Text fontSize={'small'}>{element.title}</Text>
            </div>
          })}
        </div>
        <div className='flex w-full justify-between'>
          <Button
            colorScheme="blue"
          >
            &larr;
          </Button>
          <Button
            colorScheme="blue"
          >
            &rarr;
          </Button>
        </div>
      </div>
    </>
  )
}