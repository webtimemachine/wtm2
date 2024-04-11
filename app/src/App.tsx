import viteLogo from '/vite.svg';

import { Button } from '@chakra-ui/react';
import { useSendLala } from './hooks';

function App() {
  const { sendLalaMutation } = useSendLala();

  return (
    <>
      <div className="flex flex-col p-5 bg-slate-100 min-h-screen">
        <div className="flex flex-col items-center">
          <div className="flex flex-col items-center p-10 bg-white rounded-2xl shadow-lg">
            <div className="flex gap-2 items-center">
              <a href="https://vitejs.dev" target="_blank">
                <img
                  src={viteLogo}
                  className="w-[120px] h-[120px]"
                  alt="Vite logo"
                />
              </a>
              <h1 className="text-6xl">+ </h1>

              <a href="https://react.dev" target="_blank">
                <img
                  src={viteLogo}
                  className="w-[120px] h-[120px]"
                  alt="React logo"
                />
              </a>
            </div>
            <h1 className="text-6xl pt-10">Vite + Lala</h1>
          </div>
        </div>

        <div className="p-2 pt-5 flex justify-center items-center">
          <Button
            colorScheme="blue"
            isLoading={sendLalaMutation.isPending}
            onClick={() => {
              sendLalaMutation.mutate();
            }}
          >
            Hello world 🌎
          </Button>
        </div>
      </div>
    </>
  );
}

export default App;
