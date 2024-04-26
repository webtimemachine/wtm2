import React, { useEffect, useState } from 'react';
import { Text, IconButton, Input } from '@chakra-ui/react';
import {
  ArrowBackIcon,
  EditIcon,
  DeleteIcon,
  CheckIcon,
  CloseIcon,
} from '@chakra-ui/icons';
import { useNavigationStore } from '../store';
import { ActiveSessionsResponse } from '../background/interfaces/active-sessons.interface';
import {
  useCloseActiveSession,
  useGetActiveSessions,
  useUpdateDeviceAlias,
} from '../hooks';

export const ActiveSessionsScreen: React.FC<object> = () => {
  const [editingSession, setEditingSession] =
    useState<ActiveSessionsResponse>();
  const [editingSessionName, setEditingSessionName] = useState<string>();
  const { navigateBack } = useNavigationStore();
  const { getActiveSessionsQuery } = useGetActiveSessions();
  const { closeActiveSession } = useCloseActiveSession();
  const { updateDeviceAlias } = useUpdateDeviceAlias();

  useEffect(() => {
    if (closeActiveSession.isSuccess) {
      getActiveSessionsQuery.refetch();
    }
  }, [closeActiveSession.isSuccess, getActiveSessionsQuery]);

  useEffect(() => {
    if (updateDeviceAlias.isSuccess && editingSession) {
      setEditingSession(undefined);
      getActiveSessionsQuery.refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateDeviceAlias.isSuccess]);

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
            {getActiveSessionsQuery.data &&
              getActiveSessionsQuery.data.map((session) => {
                let name =
                  session.userDevice.deviceAlias ||
                  `${session.userDevice.device.uaResult?.device.model} - ${session.userDevice.device.uaResult?.browser.name}`;

                if (session.userDevice.isCurrentDevice) {
                  name = `${name} (current)`;
                }
                return (
                  <div
                    className='flex w-full justify-between items-center bg-white px-2 py-1 rounded-lg'
                    key={session.id}
                  >
                    {!editingSession || editingSession.id !== session.id ? (
                      <>
                        <Text fontSize={'medium'} className='flex items-center'>
                          {name}
                        </Text>
                        <div className='flex gap-1'>
                          <IconButton
                            aria-label='Edit icon'
                            className='cursor-pointer'
                            onClick={() => {
                              setEditingSession(session);
                              setEditingSessionName(
                                session.userDevice.isCurrentDevice
                                  ? name.split(' (current)')[0]
                                  : name,
                              );
                            }}
                          >
                            <EditIcon boxSize={4} />
                          </IconButton>
                          {!session.userDevice.isCurrentDevice && (
                            <IconButton
                              aria-label='Delete icon'
                              className='cursor-pointer'
                              onClick={() => {
                                closeActiveSession.mutate({
                                  sessionIds: [session.id] as number[],
                                });
                              }}
                            >
                              <DeleteIcon boxSize={4} />
                            </IconButton>
                          )}
                        </div>
                      </>
                    ) : (
                      <>
                        <Input
                          type='text'
                          value={editingSessionName}
                          onChange={(e) =>
                            setEditingSessionName(e.target.value)
                          }
                        />
                        <div className='flex gap-1 pl-4'>
                          <IconButton
                            aria-label='Delete icon'
                            className='cursor-pointer'
                            onClick={() => {
                              if (editingSessionName) {
                                updateDeviceAlias.mutate({
                                  id: editingSession.userDeviceId,
                                  deviceAlias: editingSessionName,
                                });
                              }
                            }}
                          >
                            <CheckIcon boxSize={4} />
                          </IconButton>
                          <IconButton
                            aria-label='Delete icon'
                            className='cursor-pointer'
                            onClick={() => {
                              setEditingSession(undefined);
                            }}
                          >
                            <CloseIcon boxSize={4} />
                          </IconButton>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </>
  );
};
