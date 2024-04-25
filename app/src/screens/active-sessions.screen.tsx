import React from 'react';
import { Text, IconButton } from '@chakra-ui/react';
import { ArrowBackIcon, EditIcon, DeleteIcon } from '@chakra-ui/icons';
import { useNavigationStore } from '../store';
import { useGetActiveSessions } from '../hooks/use-get-active-sessions.hook';

export const ActiveSessionsScreen: React.FC<object> = () => {
  const { navigateBack } = useNavigationStore();
  const { userGetActiveSessionsQuery } = useGetActiveSessions();

  return (
    <>
      <div className='flex flex-col px-5 py-3 bg-slate-100 min-h-screen items-center w-full'>
        <div className='flex w-full justify-start pb-4 gap-4 items-center'>
          <IconButton aria-label='Back icon' onClick={() => navigateBack()}>
            <ArrowBackIcon boxSize={5} />
          </IconButton>
          <div className='flex w-full justify-center pr-[40px]'>
            <Text fontSize={'xx-large'} fontWeight={'bold'}>
              Active Sessions
            </Text>
          </div>
        </div>
        <div className='flex flex-col w-full min-h-[400px]'>
          <Text fontSize={'medium'}>
            Below you can see the complete list of active sessions:
          </Text>
          <div className='flex flex-col w-full h-full gap-2 pt-5'>
            {userGetActiveSessionsQuery.data &&
              userGetActiveSessionsQuery.data.map((session) => {
                let name =
                  session.userDevice.deviceAlias ||
                  `${session.userDevice.device.uaResult?.device.model} - ${session.userDevice.device.uaResult?.browser.name}`;

                if (session.userDevice.isCurrentDevice) {
                  name = `${name} (current)`;
                }
                return (
                  <div className='flex w-full justify-between items-center bg-white px-2 py-1 rounded'>
                    <Text fontSize={'medium'} className='flex items-center'>
                      {name}
                    </Text>
                    <div className='flex gap-1'>
                      <IconButton
                        aria-label='Edit icon'
                        className='cursor-pointer'
                      >
                        <EditIcon boxSize={4} />
                      </IconButton>
                      {!session.userDevice.isCurrentDevice && (
                        <IconButton
                          aria-label='Delete icon'
                          className='cursor-pointer'
                        >
                          <DeleteIcon boxSize={4} />
                        </IconButton>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </>
  );
};
