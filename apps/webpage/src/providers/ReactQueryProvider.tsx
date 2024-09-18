import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';

const queryClient = new QueryClient();

type QueryProviderProps = {
  children: ReactNode;
};

export const QueryProvider = ({ children }: QueryProviderProps) => {
  console.log('QueryProvider children:', children); // Verifica los children

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
