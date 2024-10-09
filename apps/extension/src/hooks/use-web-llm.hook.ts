import { useContext } from 'react';
import { WebLLMContext } from '../context/webllm';

export const useWebLLM = () => {
  const context = useContext(WebLLMContext);
  if (!context) {
    throw new Error('useWebLLM must be used within a WebLLMProvider');
  }
  return context;
};
