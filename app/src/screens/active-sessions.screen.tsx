import React, { useEffect, useState } from 'react';
import { Text, IconButton, Input, Divider, Badge } from '@chakra-ui/react';
import {
  ArrowBackIcon,
  EditIcon,
  CheckIcon,
  CloseIcon,
  Icon,
} from '@chakra-ui/icons';
import { MdLogout } from 'react-icons/md';

import { useNavigation } from '../store';
import { ActiveSession } from 'wtm-lib/interfaces';
import {
  useCloseActiveSession,
  useGetActiveSessions,
  useUpdateDeviceAlias,
} from '../hooks';
import {
  getBrowserIconFromDevice,
  getOSIconFromDevice,
  getSupportedBrowserFromDevice,
} from '../utils';

const moveCurrentSessionToFirst = (arr: ActiveSession[]) => {
  const currentIndex = arr.findIndex(
    (obj) => obj.userDevice.isCurrentDevice === true,
  );
  if (currentIndex !== -1) {
    const currentSession = arr[currentIndex];
    arr.splice(currentIndex, 1);
    arr.unshift(currentSession);
  }
  return arr;
};

export const ActiveSessionsScreen: React.FC<object> = () => {
  const { navigateBack } = useNavigation();
  const { getActiveSessionsQuery } = useGetActiveSessions();
  const { closeActiveSessionMutation } = useCloseActiveSession();
  const { updateDeviceAliasMutation } = useUpdateDeviceAlias();

  const [editingSession, setEditingSession] = useState<ActiveSession>();
  const [editingSessionName, setEditingSessionName] = useState<string>();
  const [sessions, setSessions] = useState<ActiveSession[]>([]);

  useEffect(() => {
    if (getActiveSessionsQuery.isSuccess && getActiveSessionsQuery.data) {
      setSessions(moveCurrentSessionToFirst(getActiveSessionsQuery.data));
    }
  }, [getActiveSessionsQuery]);

  useEffect(() => {
    if (closeActiveSessionMutation.isSuccess) {
      getActiveSessionsQuery.refetch();
    }
  }, [closeActiveSessionMutation.isSuccess]);

  useEffect(() => {
    if (updateDeviceAliasMutation.isSuccess && editingSession) {
      setEditingSession(undefined);
      getActiveSessionsQuery.refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateDeviceAliasMutation.isSuccess]);

  interface ActiveSessionRowProps {
    session: ActiveSession;
  }

  const ActiveSessionRow: React.FC<ActiveSessionRowProps> = ({ session }) => {
    const deviceAlias = session.userDevice.deviceAlias;

    const osName = session.userDevice.device.uaResult?.os.name;
    const deviceModel = session.userDevice.device.uaResult?.device.model;
    const browserName = getSupportedBrowserFromDevice(
      session.userDevice.device,
    );
    const isCurrentDevice = session.userDevice.isCurrentDevice;

    let name = deviceAlias || `${browserName} - ${deviceModel || osName} `;

    const handleCloseActiveSession = () => {
      closeActiveSessionMutation.mutate({
        sessionIds: [session.id] as number[],
      });
    };

    const handleEditActiveSession = () => {
      setEditingSession(session);
      setEditingSessionName(
        isCurrentDevice ? name.split(' (current)')[0] : name,
      );
    };

    const handleSaveActiveSession = () => {
      if (editingSession && editingSessionName) {
        updateDeviceAliasMutation.mutate({
          id: editingSession.userDeviceId,
          deviceAlias: editingSessionName,
        });
      }
    };

    const BrowserIcon = getBrowserIconFromDevice(session.userDevice.device);
    const OSIcon = getOSIconFromDevice(session.userDevice.device);

    return (
      <div key={session.id}>
        <div className='flex w-full justify-between items-center bg-white px-2 py-1 rounded-lg'>
          {!editingSession || editingSession.id !== session.id ? (
            <>
              <div className='flex gap-2 items-center'>
                <Icon as={BrowserIcon} boxSize={8} color='gray.600' />
                <div className='flex flex-col'>
                  <Text fontSize='medium'>
                    {name}{' '}
                    {session.userDevice.isCurrentDevice && (
                      <Badge colorScheme='green'>current</Badge>
                    )}
                  </Text>
                  <div className='flex gap-1 items-center'>
                    <Icon as={OSIcon} boxSize={3} color='gray.600' />
                    <Text fontSize='small' color='gray.600'>
                      {new Date(session?.createdAt).toLocaleString()}
                    </Text>
                  </div>
                </div>
              </div>
              <div className='flex gap-1'>
                <IconButton
                  aria-label='Edit icon'
                  className='cursor-pointer'
                  onClick={() => handleEditActiveSession()}
                >
                  <EditIcon boxSize={4} />
                </IconButton>

                {!isCurrentDevice && (
                  <IconButton
                    aria-label='Close session'
                    className='cursor-pointer'
                    onClick={() => handleCloseActiveSession()}
                  >
                    <Icon as={MdLogout} boxSize={4} />
                  </IconButton>
                )}
              </div>
            </>
          ) : (
            <>
              <Input
                type='text'
                value={editingSessionName}
                onChange={(e) => setEditingSessionName(e.target.value)}
                autoFocus
              />
              <div className='flex gap-1 pl-4'>
                <IconButton
                  aria-label='Discard Icon'
                  className='cursor-pointer'
                  onClick={() => {
                    setEditingSession(undefined);
                  }}
                >
                  <CloseIcon boxSize={4} />
                </IconButton>
                <IconButton
                  aria-label='Save Icon'
                  className='cursor-pointer'
                  onClick={() => handleSaveActiveSession()}
                >
                  <CheckIcon boxSize={4} />
                </IconButton>
              </div>
            </>
          )}
        </div>
        {/* {isCurrentDevice && <Divider className='pt-2' />} */}
      </div>
    );
  };

  const [currentSession, ...restSessions] = sessions;

  return (
    <>
      <div className='flex flex-col px-5 py-3 items-center w-full'>
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
        <div className='flex flex-col w-full h-full'>
          <Text fontSize={'medium'}>
            Below you can see the complete list of active sessions:
          </Text>

          {currentSession && (
            <div className='pt-5 pr-3'>
              <ActiveSessionRow session={currentSession} />
            </div>
          )}
          <Divider className='my-2' />
          <div className='flex flex-col gap-2 w-full h-full overflow-y-auto scrollbar pr-1'>
            {restSessions &&
              restSessions.map((session) => (
                <ActiveSessionRow session={session} />
              ))}
          </div>
        </div>
      </div>
    </>
  );
};
