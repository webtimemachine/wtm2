import { useToast } from '@chakra-ui/react'
import { useMutation } from '@tanstack/react-query'

import { useSendBackgroundMessage } from './use-send-message.hook'

export const useSayHello = () => {
  const toast = useToast()
  const { sendBackgroundMessage } = useSendBackgroundMessage()

  const sayHello = (sayHello: string) =>
    sendBackgroundMessage('say-hello', {
      sayHello,
    })

  const sayHelloMutation = useMutation({
    mutationFn: sayHello,
    onSuccess: (res) => {
      toast({
        title: 'Message',
        description: res?.message,
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    },
    onError: (error) => {
      console.error(error)
      toast({
        title: 'Error while saying Hi!',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    },
    retry: false
  })
  return { sayHelloMutation }
}
