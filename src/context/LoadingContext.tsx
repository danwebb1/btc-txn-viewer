import React, { createContext, useContext, useState } from 'react';

interface LoadingContextProviderProps {
  children?: React.ReactNode
}
export interface LoadingContextType {
  isLoading: boolean,
  startLoading: () => void;
  stopLoading: () => void;

}
const LoadingContext = createContext<LoadingContextType| undefined>(undefined);
export const useLoading = (): LoadingContextType => {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within a Loading Provider');
  }
  return context;
}

export const LoadingProvider = ({ children }: LoadingContextProviderProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const startLoading = () => setIsLoading(true);
  const stopLoading = () => setIsLoading(false);

  return (
    <LoadingContext.Provider value={{ isLoading, startLoading, stopLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};