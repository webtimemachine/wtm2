import {
  CreateExtensionServiceWorkerMLCEngine,
  MLCEngineInterface,
} from '@mlc-ai/web-llm';
import { createContext, useEffect, useState } from 'react';

interface WebLLMContextType {
  engine?: MLCEngineInterface;
  loadingProgress: number;
  isLoading: boolean;
}

export const WebLLMContext = createContext<WebLLMContextType>(
  {} as WebLLMContextType,
);

export const WebLLMProvider = ({ children }: { children: React.ReactNode }) => {
  const [engine, setEngine] = useState<MLCEngineInterface>();
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const initEngine = async () => {
      const handler = await CreateExtensionServiceWorkerMLCEngine(
        'Phi-3.5-mini-instruct-q4f16_1-MLC',
        {
          initProgressCallback: (report) => {
            console.log('report', report);

            setLoadingProgress(report.progress);
            setIsLoading(report.progress < 1);
          },
        },
        {},
      );
      setEngine(handler);
    };

    initEngine();
  }, []);

  return (
    <WebLLMContext.Provider value={{ engine, loadingProgress, isLoading }}>
      {children}
    </WebLLMContext.Provider>
  );
};
