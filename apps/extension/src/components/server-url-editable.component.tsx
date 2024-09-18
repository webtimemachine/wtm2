import { useState } from 'react';
import {
  Editable,
  EditableInput,
  EditablePreview,
  useEditableControls,
  ButtonGroup,
  IconButton,
  Input,
  useToast,
} from '@chakra-ui/react';
import { CheckIcon, CloseIcon, EditIcon } from '@chakra-ui/icons';

import { useServerUrl } from '../hooks';

import clsx from 'clsx';

const EditableControls = () => {
  const {
    isEditing,
    getSubmitButtonProps,
    getCancelButtonProps,
    getEditButtonProps,
  } = useEditableControls();

  return isEditing ? (
    <ButtonGroup justifyContent='center' size='sm'>
      <IconButton
        {...getSubmitButtonProps()}
        aria-label='Save'
        icon={<CheckIcon />}
      />
      <IconButton
        aria-label='Cancel'
        icon={<CloseIcon />}
        {...getCancelButtonProps()}
      />
    </ButtonGroup>
  ) : (
    <div className='flex'>
      <IconButton
        aria-label='Edit'
        size='sm'
        icon={<EditIcon />}
        {...getEditButtonProps()}
      />
    </div>
  );
};

export const ServerUrlEditable = () => {
  const { serverUrl, setServerUrl } = useServerUrl();
  const [value, setValue] = useState(serverUrl);
  const toast = useToast();

  return (
    <div className='flex w-full justify-center items-center min-h-[40px]'>
      <Editable
        defaultValue={serverUrl}
        isPreviewFocusable={false}
        value={value}
        fontSize='lg'
        width='100%'
        onChange={(e) => setValue(e)}
        onSubmit={() => {
          try {
            let url = new URL(value).href;
            if (url[url.length - 1] === '/') {
              url = url.substring(0, url.length - 1);
            }
            setServerUrl(url);
            setValue(url);
          } catch (error) {
            console.error(error);
            setValue(serverUrl);
            toast({
              title: 'Server URL was not a valid URL',
              status: 'error',
              duration: 3000,
              isClosable: true,
            });
          }
        }}
      >
        <div className='flex flex-row items-center w-full gap-4'>
          <div
            className={clsx([
              'flex-1 w-full',
              '[&>span]:px-3 [&>span]:py-[6px] [&>span]:w-full [&>span]:bg-slate-200 [&>span]:rounded-lg',
            ])}
          >
            <EditablePreview />
            {/* <div className=''>
          </div> */}
            <Input as={EditableInput} backgroundColor={'white'} />
          </div>
          <EditableControls />
        </div>
      </Editable>
    </div>
  );
};
