import { useEffect } from 'react';
import { useLoading } from '../context/LoadingContext';

export const usePageTransition = () => {
  const { startLoading, stopLoading } = useLoading();

  useEffect(() => {
    startLoading();

    // Simulate page loading time
    const timeout = setTimeout(() => {
      stopLoading();
    }, 800); // Adjust this value to control loading duration

    return () => clearTimeout(timeout);
  }, []);
};