'use client';

import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '@/lib/store';
import LoadingSpinner from '@/components/LoadingSpinner';

// Loading component for PersistGate
const Loading = () => (
  <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
    <LoadingSpinner size="lg" text="Initializing application..." />
  </div>
);

interface ReduxProviderProps {
  children: React.ReactNode;
}

export default function ReduxProvider({ children }: ReduxProviderProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <Provider store={store}>
        <Loading />
      </Provider>
    );
  }

  return (
    <Provider store={store}>
      <PersistGate loading={<Loading />} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
} 