export const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='flex justify-center items-center h-screen bg-white sm:bg-transparent'>
      <div className='flex gap-6 flex-col px-6 py-8 items-center max-w-6xl sm:min-w-[360px] w-full sm:w-1/3 md:min-h-[450px] sm:bg-white sm:rounded-xl sm:border sm:shadow-2xl sm:transition-shadow sm:filter sm:drop-shadow'>
        {children}
      </div>
    </div>
  );
};
